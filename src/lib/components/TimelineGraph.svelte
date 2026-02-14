<script lang="ts">
	import type { Timer } from '$lib/types';
	import { TIMER_TYPES } from '$lib/constants';
	import { selectTimer } from '$lib/stores/selectedTimerStore';

	export let timers: Timer[] = [];
	export let activeTimer: Timer | null = null;

	// Combine completed timers with active timer for display
	$: allTimers = activeTimer ? [...timers, activeTimer] : timers;

	// Fixed duration for empty timeline (2 hours in milliseconds)
	const FIXED_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours

	// Calculate total time span including active timer
	// When empty, use 2-hour window starting from active timer start or current time
	$: totalDuration = (() => {
		if (allTimers.length === 0) {
			return FIXED_DURATION_MS;
		}

		const calculatedDuration =
			Math.max(...allTimers.map((t) => t.finish.getTime())) - Math.min(...allTimers.map((t) => t.start.getTime()));

		// Use at least 2 hours, or actual duration if longer
		return Math.max(calculatedDuration, FIXED_DURATION_MS);
	})();

	$: earliestStart = (() => {
		if (allTimers.length === 0) {
			return Date.now();
		}
		return Math.min(...allTimers.map((t) => t.start.getTime()));
	})();

	$: latestFinish = (() => {
		const ONE_HOUR_MS = 60 * 60 * 1000;

		if (allTimers.length === 0) {
			return Date.now() + FIXED_DURATION_MS;
		}

		const maxFinish = Math.max(...allTimers.map((t) => t.finish.getTime()));
		let calculatedEnd = Math.max(maxFinish, earliestStart + FIXED_DURATION_MS);

		// If active timer exists and is approaching the end (within 10 minutes), extend by 1 hour
		if (activeTimer) {
			const now = Date.now();
			const timeUntilEnd = calculatedEnd - now;
			const TEN_MINUTES_MS = 10 * 60 * 1000;

			if (timeUntilEnd < TEN_MINUTES_MS && timeUntilEnd > 0) {
				calculatedEnd = calculatedEnd + ONE_HOUR_MS;
			}
		}

		return calculatedEnd;
	})();

	// Generate grid lines (every hour)
	$: gridLines = (() => {
		if (totalDuration === 0) return [];

		const lines: { position: number; label: string }[] = [];
		const startDate = new Date(earliestStart);
		const endDate = new Date(latestFinish);

		// Round to next hour
		const currentHour = new Date(startDate);
		currentHour.setMinutes(0, 0, 0);
		currentHour.setHours(currentHour.getHours() + 1);

		while (currentHour.getTime() <= endDate.getTime()) {
			const offset = currentHour.getTime() - earliestStart;
			const position = (offset / totalDuration) * 100;

			if (position >= 0 && position <= 100) {
				lines.push({
					position,
					label: currentHour.toLocaleTimeString(undefined, {
						hour: '2-digit',
						minute: '2-digit',
						hour12: false
					})
				});
			}

			currentHour.setHours(currentHour.getHours() + 1);
		}

		return lines;
	})();

	// Calculate future time overlay (time that hasn't happened yet)
	$: futureTimeOverlay = (() => {
		const now = Date.now();

		// If latest finish is in the future, show overlay
		if (latestFinish > now) {
			const futureStart = Math.max(earliestStart, now);
			const futureOffset = futureStart - earliestStart;
			const futureDuration = latestFinish - futureStart;

			const left = (futureOffset / totalDuration) * 100;
			const width = (futureDuration / totalDuration) * 100;

			return {
				left: `${left}%`,
				width: `${width}%`,
				visible: width > 0
			};
		}

		return { left: '0%', width: '0%', visible: false };
	})();

	// Convert timer to position and width percentages
	function getTimerStyle(timer: Timer) {
		if (totalDuration === 0) return { left: '0%', width: '0%' };

		const startOffset = timer.start.getTime() - earliestStart;
		const duration = timer.finish.getTime() - timer.start.getTime();

		const left = (startOffset / totalDuration) * 100;
		const width = (duration / totalDuration) * 100;

		return {
			left: `${left}%`,
			width: `${width}%`
		};
	}

	// Determine if timer is work or rest
	function isWorkTimer(timer: Timer): boolean {
		return timer.name === TIMER_TYPES.WORK;
	}

	// Check if there's a significant rest break (5+ minutes) before this timer
	function hasSignificantRestBefore(timer: Timer, allTimers: Timer[]): boolean {
		const timerIndex = allTimers.findIndex((t) => t.start.getTime() === timer.start.getTime());
		if (timerIndex <= 0) return true; // First timer or not found

		const previousTimer = allTimers[timerIndex - 1];

		// Check if previous timer is rest
		if (!isWorkTimer(previousTimer)) {
			// Check if rest was 5+ minutes
			const restDuration = previousTimer.durationS() / 60;
			return restDuration >= 5;
		}

		// Check if there's a gap (rest) between timers
		const gap = timer.start.getTime() - previousTimer.finish.getTime();
		const gapMinutes = gap / (1000 * 60);

		// If gap is 5+ minutes, it's a significant rest
		return gapMinutes >= 5;
	}

	// Get all consecutive work timers starting from this one going backwards
	function getConsecutiveWorkSession(timer: Timer, allTimers: Timer[]): Timer[] {
		if (!isWorkTimer(timer)) return [];

		const session: Timer[] = [timer];
		const timerIndex = allTimers.findIndex((t) => t.start.getTime() === timer.start.getTime());

		// Go backwards to find all consecutive work timers
		for (let i = timerIndex - 1; i >= 0; i--) {
			const prevTimer = allTimers[i];
			const currentFirst = session[0];

			// Check gap between previous timer and first in session
			const gap = currentFirst.start.getTime() - prevTimer.finish.getTime();
			const gapMinutes = gap / (1000 * 60);

			// If it's work and gap is less than 5 minutes, add to session
			if (isWorkTimer(prevTimer) && gapMinutes < 5) {
				session.unshift(prevTimer);
			} else if (!isWorkTimer(prevTimer) && prevTimer.durationS() / 60 < 5) {
				// Short rest (< 5 min) doesn't break the session, continue checking
				continue;
			} else {
				// Significant rest or non-work timer breaks the session
				break;
			}
		}

		return session;
	}

	// Determine if work timer shows overtime
	// New logic:
	// 1) For single timer: overtime starts 2 min after planned time (alarm)
	// 2) For consecutive work: merge sessions, overtime if total exceeds sum of planned + 25 min
	// 3) Only 5+ min rest resets overtime
	function isOvertimeTimer(timer: Timer, allTimers: Timer[]): boolean {
		if (!isWorkTimer(timer)) return false;
		if (!timer.value || timer.value === 0) return false; // No planned duration

		const OVERTIME_GRACE_PERIOD_MIN = 2; // Overtime starts 2 min after alarm
		const CONSECUTIVE_OVERTIME_THRESHOLD_MIN = 25; // For consecutive work sessions

		// Get consecutive work session
		const session = getConsecutiveWorkSession(timer, allTimers);

		if (session.length === 1) {
			// Single timer: overtime if actual > planned + 2 min
			const actualDurationMin = timer.durationS() / 60;
			const plannedDurationMin = timer.value;
			return actualDurationMin > plannedDurationMin + OVERTIME_GRACE_PERIOD_MIN;
		} else {
			// Consecutive work: calculate total planned and actual time
			const totalPlannedMin = session.reduce((sum, t) => sum + (t.value || 0), 0);
			const totalActualMin = session.reduce((sum, t) => sum + t.durationS() / 60, 0);

			// Overtime if total actual exceeds total planned + 25 min
			return totalActualMin > totalPlannedMin + CONSECUTIVE_OVERTIME_THRESHOLD_MIN;
		}
	}

	// Get the overtime portion of a timer (for visual display)
	// Returns the start time of overtime within this timer, or null if no overtime
	function getOvertimeStart(timer: Timer, allTimers: Timer[]): Date | null {
		if (!isOvertimeTimer(timer, allTimers)) return null;
		if (!timer.value) return null;

		const OVERTIME_GRACE_PERIOD_MIN = 2;
		const CONSECUTIVE_OVERTIME_THRESHOLD_MIN = 25;

		const session = getConsecutiveWorkSession(timer, allTimers);

		if (session.length === 1) {
			// Single timer: overtime starts at planned + 2 min
			const overtimeStartMs = timer.start.getTime() + (timer.value + OVERTIME_GRACE_PERIOD_MIN) * 60 * 1000;
			return new Date(overtimeStartMs);
		} else {
			// Consecutive work: find where overtime starts in the session
			const totalPlannedMin = session.reduce((sum, t) => sum + (t.value || 0), 0);
			const overtimeThresholdMin = totalPlannedMin + CONSECUTIVE_OVERTIME_THRESHOLD_MIN;

			// Calculate cumulative time to find which timer contains the overtime start
			let cumulativeMin = 0;
			for (const t of session) {
				const timerDurationMin = t.durationS() / 60;
				const nextCumulative = cumulativeMin + timerDurationMin;

				if (nextCumulative > overtimeThresholdMin) {
					// Overtime starts in this timer
					const overtimeOffsetMin = overtimeThresholdMin - cumulativeMin;
					const overtimeStartMs = t.start.getTime() + overtimeOffsetMin * 60 * 1000;
					return new Date(overtimeStartMs);
				}

				cumulativeMin = nextCumulative;
			}
		}

		return null;
	}

	// Format time for tooltip (uses browser locale settings)
	function formatTime(date: Date): string {
		return date.toLocaleTimeString(undefined, {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false // Force 24-hour format
		});
	}

	// Format duration in minutes
	function formatDuration(timer: Timer): string {
		const durationMin = Math.round(timer.durationS() / 60);
		return `${durationMin} min`;
	}
</script>

<div class="timeline-container">
	<div class="timeline-header">
		<span class="timeline-title">Timeline</span>
		<div class="legend">
			<span class="legend-item">
				<span class="legend-color work"></span>
				<span>Work</span>
			</span>
			<span class="legend-item" title="Overtime: 2+ min after alarm, or 25+ min for consecutive work">
				<span class="legend-color overtime"></span>
				<span>Overtime</span>
			</span>
			<span class="legend-item">
				<span class="legend-color rest"></span>
				<span>Rest</span>
			</span>
		</div>
	</div>

	<div class="timeline-bar">
		<!-- Start and end time labels -->
		<div class="time-label start">{formatTime(new Date(earliestStart))}</div>
		<div class="time-label end">{formatTime(new Date(latestFinish))}</div>

		<!-- Future time overlay (time that hasn't happened yet) -->
		{#if futureTimeOverlay.visible}
			<div
				class="future-overlay"
				style="left: {futureTimeOverlay.left}; width: {futureTimeOverlay.width};"
				title="Future time"
			></div>
		{/if}

		<!-- Grid lines -->
		{#each gridLines as line}
			<div class="grid-line" style="left: {line.position}%;">
				<div class="grid-label">{line.label}</div>
			</div>
		{/each}

		<!-- Completed timer blocks -->
		{#each timers as timer (timer.start)}
			{@const style = getTimerStyle(timer)}
			{@const isWork = isWorkTimer(timer)}
			{@const isOvertime = isOvertimeTimer(timer, timers)}
			{@const widthPercent = parseFloat(style.width)}
			{@const minWidth = !isWork && widthPercent < 0.5 ? '2px' : style.width}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="timer-block {isWork ? (isOvertime ? 'overtime' : 'work') : 'rest'}"
				style="left: {style.left}; width: {minWidth}; min-width: {!isWork ? '2px' : '0'}; cursor: pointer;"
				on:click={() => selectTimer(timer)}
				title="{formatTime(timer.start)} - {formatTime(timer.finish)} ({formatDuration(timer)}){isOvertime
					? ' ⚠️ Overtime'
					: ''}"
			></div>
		{/each}

		<!-- Active timer block (with pulsing animation) -->
		{#if activeTimer}
			{@const style = getTimerStyle(activeTimer)}
			{@const isWork = isWorkTimer(activeTimer)}
			{@const isOvertime = isOvertimeTimer(activeTimer, allTimers)}
			<div
				class="timer-block active {isWork ? (isOvertime ? 'overtime' : 'work') : 'rest'}"
				style="left: {style.left}; width: {style.width};"
				title="Active: {formatTime(activeTimer.start)} - now ({formatDuration(activeTimer)}){isOvertime
					? ' ⚠️ Overtime'
					: ''}"
			></div>
		{/if}
	</div>
</div>

<style>
	@import '../../styles/fonts.css';

	.timeline-container {
		margin: 10px 0;
		padding: 10px;
		background-color: var(--logs-background-color);
		border: 1px solid var(--logs-border-color);
		border-radius: 8px;
	}

	.timeline-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}

	.timeline-title {
		font-family: 'title_roboto', sans-serif;
		font-size: 18px;
		font-weight: 500;
	}

	.legend {
		display: flex;
		gap: 15px;
		font-family: 'title_roboto', sans-serif;
		font-size: 12px;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.legend-color {
		width: 20px;
		height: 12px;
		border-radius: 2px;
	}

	.legend-color.work {
		background-color: #4caf50;
	}

	.legend-color.overtime {
		background-color: #ff9800;
	}

	.legend-color.rest {
		background-color: transparent;
		border: 1px solid var(--logs-border-color);
	}

	.timeline-bar {
		position: relative;
		height: 40px;
		background-color: rgba(128, 128, 128, 0.1);
		border: 1px solid var(--logs-border-color);
		border-radius: 4px;
		overflow: hidden;
		margin-top: 25px; /* Space for time labels */
	}

	.time-label {
		position: absolute;
		top: -22px;
		font-family: 'title_roboto', sans-serif;
		font-size: 11px;
		font-weight: 500;
		opacity: 0.9;
	}

	.time-label.start {
		left: 0;
	}

	.time-label.end {
		right: 0;
	}

	.future-overlay {
		position: absolute;
		top: 0;
		height: 100%;
		background-color: rgba(128, 128, 128, 0.15);
		pointer-events: none;
		z-index: 0;
	}

	.grid-line {
		position: absolute;
		top: 0;
		height: 100%;
		width: 1px;
		background-color: var(--logs-border-color);
		opacity: 0.3;
		pointer-events: none;
	}

	.grid-label {
		position: absolute;
		top: -20px;
		left: 50%;
		transform: translateX(-50%);
		font-family: 'title_roboto', sans-serif;
		font-size: 10px;
		white-space: nowrap;
		opacity: 0.7;
	}

	.timer-block {
		position: absolute;
		top: 0;
		height: 100%;
		transition: opacity 0.2s;
		z-index: 1;
		cursor: pointer;
	}

	.timer-block:hover {
		opacity: 1 !important;
		filter: brightness(1.1);
	}

	.timer-block.work {
		background-color: #4caf50;
		opacity: 0.8;
	}

	.timer-block.work:hover {
		opacity: 1;
	}

	.timer-block.overtime {
		background-color: #ff9800; /* Orange for overtime */
		opacity: 0.8;
	}

	.timer-block.overtime:hover {
		opacity: 1;
	}

	.timer-block.rest {
		background-color: transparent;
		border: 1px solid var(--logs-border-color);
		opacity: 0.6;
		/* Rest periods shown with border to ensure visibility */
	}

	/* Active timer with pulsing animation */
	.timer-block.active {
		opacity: 1;
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.8;
		}
		50% {
			opacity: 1;
		}
	}
</style>
