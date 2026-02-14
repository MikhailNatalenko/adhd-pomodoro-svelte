<script lang="ts">
	import { selectedTimer, deselectTimer } from '$lib/stores/selectedTimerStore';
	import { pomApp } from '$lib/stores/pomodoroStore';
	import type { Timer } from '$lib/types';

	let startTime = '';
	let finishTime = '';
	let startDate = '';
	let finishDate = '';

	// Update local state when selected timer changes
	$: if ($selectedTimer) {
		const start = $selectedTimer.start;
		const finish = $selectedTimer.finish;

		startDate = start.toISOString().split('T')[0];
		// Format time as HH:MM in 24-hour format for input type="time"
		startTime = `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`;

		finishDate = finish.toISOString().split('T')[0];
		finishTime = `${String(finish.getHours()).padStart(2, '0')}:${String(finish.getMinutes()).padStart(2, '0')}`;
	}

	// Calculate duration in minutes
	$: duration = $selectedTimer ? Math.round($selectedTimer.durationS() / 60) : 0;

	function handleSave() {
		if (!$selectedTimer) return;

		// Parse new dates
		const newStart = new Date(`${startDate}T${startTime}`);
		const newFinish = new Date(`${finishDate}T${finishTime}`);

		// Validate
		if (newStart >= newFinish) {
			alert('Start time must be before finish time');
			return;
		}

		// Update timer
		pomApp.update((app) => {
			const timerToUpdate = app.timerHistory.list.find(
				(t: Timer) => t.start.getTime() === $selectedTimer!.start.getTime()
			);

			if (timerToUpdate) {
				timerToUpdate.start = newStart;
				timerToUpdate.finish = newFinish;
			}

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

<svelte:window on:keydown={handleKeydown} />

{#if $selectedTimer}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="modal-backdrop" on:click={handleCancel}>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="modal" on:click|stopPropagation>
			<div class="modal-header">
				<h2>Edit Timer</h2>
				<button class="close-btn" on:click={handleCancel}>&times;</button>
			</div>

			<div class="modal-body">
				<div class="info">
					<span class="label">Type:</span>
					<span class="value">{$selectedTimer.name}</span>
				</div>

				<div class="info">
					<span class="label">Duration:</span>
					<span class="value">{duration} min</span>
				</div>

				<div class="form-group">
					<label for="start-date">Start Date</label>
					<input id="start-date" type="date" bind:value={startDate} />
				</div>

				<div class="form-group">
					<label for="start-time">Start Time</label>
					<input id="start-time" type="time" step="60" bind:value={startTime} />
				</div>

				<div class="form-group">
					<label for="finish-date">Finish Date</label>
					<input id="finish-date" type="date" bind:value={finishDate} />
				</div>

				<div class="form-group">
					<label for="finish-time">Finish Time</label>
					<input id="finish-time" type="time" step="60" bind:value={finishTime} />
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

	.info {
		display: flex;
		justify-content: space-between;
		margin-bottom: 15px;
		font-family: 'title_roboto', sans-serif;
	}

	.info .label {
		font-weight: 500;
		opacity: 0.7;
	}

	.info .value {
		font-weight: 600;
	}

	.form-group {
		margin-bottom: 15px;
	}

	.form-group label {
		display: block;
		margin-bottom: 5px;
		font-family: 'title_roboto', sans-serif;
		font-size: 14px;
		font-weight: 500;
	}

	.form-group input {
		width: 100%;
		padding: 8px;
		border: 1px solid var(--logs-border-color, #ccc);
		border-radius: 4px;
		font-size: 14px;
		font-family: 'title_roboto', sans-serif;
		box-sizing: border-box;
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
