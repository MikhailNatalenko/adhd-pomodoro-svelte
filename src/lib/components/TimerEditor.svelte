<script lang="ts">
	import { selectedTimer, deselectTimer } from '$lib/stores/selectedTimerStore';
	import { pomApp } from '$lib/stores/pomodoroStore';
	import { Timer } from '$lib/types';
	import { TIMER_TYPES } from '$lib/constants';

	let startOffset = 0; // Minutes offset from original start
	let endOffset = 0; // Minutes offset from original end
	let originalStart: Date;
	let originalEnd: Date;
	let currentTimerStartTime: number | null = null;

	// Drag state
	let isDragging = false;
	let dragHandle: 'start' | 'end' | null = null;
	let dragStartX = 0;
	let timelineWidth = 400; // Will be set from element
	let timelineElement: HTMLElement;

	// Get adjacent timers
	$: timerIndex = $selectedTimer
		? $pomApp.timerHistory.list.findIndex((t: Timer) => t.start.getTime() === $selectedTimer!.start.getTime())
		: -1;

	$: prevTimer = timerIndex > 0 ? $pomApp.timerHistory.list[timerIndex - 1] : null;
	$: nextTimer =
		timerIndex >= 0 && timerIndex < $pomApp.timerHistory.list.length - 1
			? $pomApp.timerHistory.list[timerIndex + 1]
			: null;

	// Calculate timeline bounds (show ±30 min around current timer)
	$: timelineStart = originalStart ? new Date(originalStart.getTime() - 30 * 60 * 1000) : new Date();
	$: timelineEnd = originalEnd ? new Date(originalEnd.getTime() + 30 * 60 * 1000) : new Date();
	$: timelineDuration = timelineEnd.getTime() - timelineStart.getTime();

	// Update local state when selected timer changes (only on first open)
	$: if ($selectedTimer && $selectedTimer.start.getTime() !== currentTimerStartTime) {
		currentTimerStartTime = $selectedTimer.start.getTime();

		originalStart = $selectedTimer.start instanceof Date ? $selectedTimer.start : new Date($selectedTimer.start);
		originalEnd = $selectedTimer.finish instanceof Date ? $selectedTimer.finish : new Date($selectedTimer.finish);

		startOffset = 0;
		endOffset = 0;
	}

	$: if (!$selectedTimer) {
		currentTimerStartTime = null;
	}

	// Calculate new times based on offsets
	$: newStart = originalStart ? new Date(originalStart.getTime() + startOffset * 60 * 1000) : new Date();
	$: newEnd = originalEnd ? new Date(originalEnd.getTime() + endOffset * 60 * 1000) : new Date();
	$: newDuration = $selectedTimer ? Math.round((newEnd.getTime() - newStart.getTime()) / (1000 * 60)) : 0;

	// Check for warnings
	$: warnings = getWarnings();

	function getWarnings(): string[] {
		const warns: string[] = [];

		if (prevTimer) {
			const prevEnd = newStart;
			const prevDuration = (prevEnd.getTime() - prevTimer.start.getTime()) / (1000 * 60);
			if (prevDuration < 0.5) {
				warns.push(`Previous ${prevTimer.name} will be removed (< 30 sec)`);
			}
		}

		if (nextTimer) {
			const nextStart = newEnd;
			const nextDuration = (nextTimer.finish.getTime() - nextStart.getTime()) / (1000 * 60);
			if (nextDuration < 0.5) {
				warns.push(`Next ${nextTimer.name} will be removed (< 30 sec)`);
			}
		}

		return warns;
	}

	// Convert timer to position on timeline
	function getTimerPosition(start: Date, end: Date) {
		const startOffset = start.getTime() - timelineStart.getTime();
		const duration = end.getTime() - start.getTime();

		const left = (startOffset / timelineDuration) * 100;
		const width = (duration / timelineDuration) * 100;

		return { left: `${left}%`, width: `${width}%` };
	}

	// Drag handlers
	function handleMouseDown(handle: 'start' | 'end', e: MouseEvent) {
		isDragging = true;
		dragHandle = handle;
		dragStartX = e.clientX;

		if (timelineElement) {
			timelineWidth = timelineElement.offsetWidth;
		}

		e.preventDefault();
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isDragging || !dragHandle) return;

		const deltaX = e.clientX - dragStartX;
		const deltaTime = (deltaX / timelineWidth) * timelineDuration;
		const deltaMinutes = Math.round(deltaTime / (60 * 1000));

		if (dragHandle === 'start') {
			startOffset = deltaMinutes;
		} else {
			endOffset = deltaMinutes;
		}
	}

	function handleMouseUp() {
		isDragging = false;
		dragHandle = null;
	}

	// Format time for display
	function formatTime(date: Date): string {
		return date.toLocaleTimeString(undefined, {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		});
	}

	function isWorkTimer(timer: Timer): boolean {
		return timer.name === TIMER_TYPES.WORK;
	}

	function handleSave() {
		if (!$selectedTimer) return;

		// Validate
		if (newStart >= newEnd) {
			alert('Start time must be before finish time');
			return;
		}

		if (warnings.length > 0) {
			const confirmed = confirm(`Warning:\n${warnings.join('\n')}\n\nContinue with save?`);
			if (!confirmed) return;
		}

		// Update timer and adjust adjacent timers
		pomApp.update((app) => {
			const timerIndex = app.timerHistory.list.findIndex(
				(t: Timer) => t.start.getTime() === $selectedTimer!.start.getTime()
			);

			if (timerIndex === -1) return app;

			const oldTimer = app.timerHistory.list[timerIndex];
			const timersToRemove: number[] = [];

			// Check previous timer - adjust its end time to match our new start
			if (timerIndex > 0) {
				const prevTimer = app.timerHistory.list[timerIndex - 1];
				const oldStart = oldTimer.start.getTime();

				// If we moved our start time, adjust previous timer's end
				if (newStart.getTime() !== oldStart) {
					const newPrevFinish = new Date(newStart);
					const newDuration = (newPrevFinish.getTime() - prevTimer.start.getTime()) / 1000;

					if (newDuration < 30) {
						timersToRemove.push(timerIndex - 1);
					} else {
						const updatedPrevTimer = new Timer(prevTimer.value, prevTimer.name, prevTimer.start, newPrevFinish);
						app.timerHistory.list[timerIndex - 1] = updatedPrevTimer;
					}
				}
			}

			// Check next timer - adjust its start time to match our new end
			if (timerIndex < app.timerHistory.list.length - 1) {
				const nextTimer = app.timerHistory.list[timerIndex + 1];
				const oldEnd = oldTimer.finish.getTime();

				// If we moved our end time, adjust next timer's start
				if (newEnd.getTime() !== oldEnd) {
					const newNextStart = new Date(newEnd);
					const newDuration = (nextTimer.finish.getTime() - newNextStart.getTime()) / 1000;

					if (newDuration < 30) {
						timersToRemove.push(timerIndex + 1);
					} else {
						const updatedNextTimer = new Timer(nextTimer.value, nextTimer.name, newNextStart, nextTimer.finish);
						app.timerHistory.list[timerIndex + 1] = updatedNextTimer;
					}
				}
			}

			// Remove timers that became too short
			timersToRemove
				.sort((a, b) => b - a)
				.forEach((index) => {
					app.timerHistory.list.splice(index, 1);
				});

			// Adjust timerIndex if we removed previous timer
			const adjustedIndex = timerIndex - timersToRemove.filter((i) => i < timerIndex).length;

			// Create new Timer object with updated values
			const updatedTimer = new Timer(oldTimer.value, oldTimer.name, newStart, newEnd);
			app.timerHistory.list[adjustedIndex] = updatedTimer;

			// Note: Consecutive same-type timers will be automatically merged
			// when the store is serialized (see TimerList.serialize)

			return app;
		});

		deselectTimer();
	}

	function handleCancel() {
		deselectTimer();
	}

	function handleDelete() {
		if (!$selectedTimer) return;

		if (confirm('Delete this timer?')) {
			pomApp.update((app) => app.remove($selectedTimer!.start));
			deselectTimer();
		}
	}

	// Close on Escape key
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			deselectTimer();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} on:mousemove={handleMouseMove} on:mouseup={handleMouseUp} />

{#if $selectedTimer}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="modal-backdrop" on:click={handleCancel}>
		<div class="modal">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div class="modal-header" on:click|stopPropagation>
				<h2>Edit Timer</h2>
				<button class="close-btn" on:click={handleCancel}>&times;</button>
			</div>

			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div class="modal-body" on:click|stopPropagation>
				<div class="info-row">
					<div class="info">
						<span class="label">Type:</span>
						<span class="value">{$selectedTimer.name}</span>
					</div>
					<div class="info">
						<span class="label">Duration:</span>
						<span class="value">{newDuration} min</span>
					</div>
				</div>

				{#if warnings.length > 0}
					<div class="warnings">
						{#each warnings as warning}
							<div class="warning-item">⚠️ {warning}</div>
						{/each}
					</div>
				{/if}

				<div class="timeline-editor" bind:this={timelineElement}>
					<div class="timeline-labels">
						<span>{formatTime(timelineStart)}</span>
						<span>{formatTime(timelineEnd)}</span>
					</div>

					<div class="timeline-track">
						<!-- Previous timer -->
						{#if prevTimer}
							{@const pos = getTimerPosition(prevTimer.start, newStart)}
							<div
								class="timer-block prev {isWorkTimer(prevTimer) ? 'work' : 'rest'}"
								style="left: {pos.left}; width: {pos.width};"
								title="{prevTimer.name}: {formatTime(prevTimer.start)} - {formatTime(newStart)}"
							>
								<span class="timer-label">{prevTimer.name}</span>
							</div>
						{/if}

						<!-- Current timer (editable) -->
						{#if $selectedTimer}
							{@const pos = getTimerPosition(newStart, newEnd)}
							<div
								class="timer-block current {isWorkTimer($selectedTimer) ? 'work' : 'rest'}"
								style="left: {pos.left}; width: {pos.width};"
							>
								<!-- Left handle -->
								<!-- svelte-ignore a11y-no-static-element-interactions -->
								<div
									class="drag-handle left"
									on:mousedown={(e) => handleMouseDown('start', e)}
									title="Drag to adjust start time"
								></div>

								<div class="timer-content">
									<div class="timer-label">{$selectedTimer.name}</div>
									<div class="timer-times">
										{formatTime(newStart)} - {formatTime(newEnd)}
									</div>
								</div>

								<!-- Right handle -->
								<!-- svelte-ignore a11y-no-static-element-interactions -->
								<div
									class="drag-handle right"
									on:mousedown={(e) => handleMouseDown('end', e)}
									title="Drag to adjust end time"
								></div>
							</div>
						{/if}

						<!-- Next timer -->
						{#if nextTimer}
							{@const pos = getTimerPosition(newEnd, nextTimer.finish)}
							<div
								class="timer-block next {isWorkTimer(nextTimer) ? 'work' : 'rest'}"
								style="left: {pos.left}; width: {pos.width};"
								title="{nextTimer.name}: {formatTime(newEnd)} - {formatTime(nextTimer.finish)}"
							>
								<span class="timer-label">{nextTimer.name}</span>
							</div>
						{/if}
					</div>

					<div class="timeline-hint">💡 Drag the edges to adjust timer boundaries</div>
				</div>
			</div>

			<div class="modal-footer">
				<button class="btn btn-delete" on:click={handleDelete}>Delete</button>
				<div class="spacer"></div>
				<button class="btn btn-cancel" on:click={handleCancel}>Cancel</button>
				<button class="btn btn-save" on:click={handleSave}>Save</button>
			</div>
		</div>
	</div>
{/if}

<style>
	@import '../../styles/fonts.css';

	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.modal {
		background-color: var(--logs-background-color, white);
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		width: 90%;
		max-width: 400px;
		max-height: 90vh;
		overflow-y: auto;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px;
		border-bottom: 1px solid var(--logs-border-color, #ccc);
	}

	.modal-header h2 {
		margin: 0;
		font-family: 'title_roboto', sans-serif;
		font-size: 20px;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 28px;
		cursor: pointer;
		padding: 0;
		width: 30px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0.6;
	}

	.close-btn:hover {
		opacity: 1;
	}

	.modal-body {
		padding: 20px;
	}

	.info-row {
		display: flex;
		gap: 20px;
		margin-bottom: 20px;
	}

	.info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 5px;
		font-family: 'title_roboto', sans-serif;
	}

	.info .label {
		font-size: 12px;
		font-weight: 500;
		opacity: 0.7;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.info .value {
		font-size: 18px;
		font-weight: 600;
	}

	.warnings {
		margin-bottom: 15px;
		padding: 10px;
		background-color: rgba(255, 152, 0, 0.1);
		border-left: 3px solid #ff9800;
		border-radius: 4px;
	}

	.warning-item {
		font-family: 'title_roboto', sans-serif;
		font-size: 13px;
		color: #f57c00;
		margin: 5px 0;
	}

	.timeline-editor {
		margin-top: 20px;
	}

	.timeline-labels {
		display: flex;
		justify-content: space-between;
		margin-bottom: 8px;
		font-family: 'title_roboto', sans-serif;
		font-size: 11px;
		opacity: 0.6;
	}

	.timeline-track {
		position: relative;
		height: 80px;
		background-color: rgba(128, 128, 128, 0.05);
		border-radius: 4px;
		margin-bottom: 10px;
	}

	.timer-block {
		position: absolute;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		font-family: 'title_roboto', sans-serif;
		transition: opacity 0.2s;
	}

	.timer-block.work {
		background-color: var(--work-buttons, #4caf50);
		color: white;
	}

	.timer-block.rest {
		background-color: var(--rest-buttons, #2196f3);
		color: white;
	}

	.timer-block.prev,
	.timer-block.next {
		opacity: 0.4;
	}

	.timer-block.current {
		opacity: 1;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		z-index: 10;
	}

	.timer-label {
		font-size: 12px;
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.timer-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 0 10px;
	}

	.timer-times {
		font-size: 10px;
		opacity: 0.9;
		margin-top: 4px;
	}

	.drag-handle {
		position: absolute;
		top: 0;
		width: 12px;
		height: 100%;
		cursor: ew-resize;
		background-color: rgba(255, 255, 255, 0.3);
		transition: background-color 0.2s;
		z-index: 20;
	}

	.drag-handle:hover {
		background-color: rgba(255, 255, 255, 0.5);
	}

	.drag-handle.left {
		left: 0;
		border-radius: 4px 0 0 4px;
	}

	.drag-handle.right {
		right: 0;
		border-radius: 0 4px 4px 0;
	}

	.timeline-hint {
		text-align: center;
		font-family: 'title_roboto', sans-serif;
		font-size: 12px;
		opacity: 0.6;
		margin-top: 10px;
	}

	.modal-footer {
		display: flex;
		gap: 10px;
		padding: 20px;
		border-top: 1px solid var(--logs-border-color, #ccc);
	}

	.spacer {
		flex: 1;
	}

	.btn {
		padding: 8px 16px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-family: 'title_roboto', sans-serif;
		font-size: 14px;
		font-weight: 500;
		transition: opacity 0.2s;
	}

	.btn:hover {
		opacity: 0.8;
	}

	.btn-save {
		background-color: #4caf50;
		color: white;
	}

	.btn-cancel {
		background-color: #9e9e9e;
		color: white;
	}

	.btn-delete {
		background-color: var(--delete-background-color, #d32f2f);
		color: white;
	}
</style>
