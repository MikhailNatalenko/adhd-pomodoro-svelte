<script lang="ts">
	import type { Timer } from '$lib/types';
	import { TIMER_TYPES } from '$lib/constants';

	export let timers: Timer[] = [];

	// Calculate total time span
	$: totalDuration =
		timers.length > 0
			? Math.max(...timers.map((t) => t.finish.getTime())) - Math.min(...timers.map((t) => t.start.getTime()))
			: 0;

	$: earliestStart = timers.length > 0 ? Math.min(...timers.map((t) => t.start.getTime())) : Date.now();

	$: latestFinish = timers.length > 0 ? Math.max(...timers.map((t) => t.finish.getTime())) : Date.now();

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
					label: currentHour.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
				});
			}

			currentHour.setHours(currentHour.getHours() + 1);
		}

		return lines;
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

	// Format time for tooltip
	function formatTime(date: Date): string {
		return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
	}

	// Format duration in minutes
	function formatDuration(timer: Timer): string {
		const durationMin = Math.round(timer.durationS() / 60);
		return `${durationMin} мин`;
	}
</script>

<div class="timeline-container">
	<div class="timeline-header">
		<span class="timeline-title">График таймеров</span>
		<div class="legend">
			<span class="legend-item">
				<span class="legend-color work"></span>
				<span>Работа</span>
			</span>
			<span class="legend-item">
				<span class="legend-color rest"></span>
				<span>Отдых</span>
			</span>
		</div>
	</div>

	<div class="timeline-bar">
		<!-- Grid lines -->
		{#each gridLines as line}
			<div class="grid-line" style="left: {line.position}%;">
				<div class="grid-label">{line.label}</div>
			</div>
		{/each}

		<!-- Timer blocks -->
		{#each timers as timer (timer.start)}
			{@const style = getTimerStyle(timer)}
			{@const isWork = isWorkTimer(timer)}
			<div
				class="timer-block {isWork ? 'work' : 'rest'}"
				style="left: {style.left}; width: {style.width};"
				title="{formatTime(timer.start)} - {formatTime(timer.finish)} ({formatDuration(timer)})"
			></div>
		{/each}
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
	}

	.timer-block.work {
		background-color: #4caf50;
		opacity: 0.8;
	}

	.timer-block.work:hover {
		opacity: 1;
	}

	.timer-block.rest {
		background-color: transparent;
		/* Rest periods are shown as empty space */
	}
</style>
