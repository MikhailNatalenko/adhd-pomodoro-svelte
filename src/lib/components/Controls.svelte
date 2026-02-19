<script lang="ts">
	import TimerStarter from '$lib/components/TimerStarter.svelte';
	import { createEventDispatcher } from 'svelte';
	import { TIMER_TYPES } from '$lib/constants';
	import { workTimers, restTimers } from '$lib/stores/pomodoroStore';

	const dispatch = createEventDispatcher();

	let workComponents: TimerStarter[] = [];
	let restComponents: TimerStarter[] = [];

	// dialog state
	let dialogOpen = false;
	let dialogForType: 'work' | 'rest' | null = null;
	let dialogInput: number | null = null;
	let dialogEl: HTMLElement | null = null;

	interface TimerStartEvent {
		detail: { val: number; name: string };
	}

	function handleTimerStart(event: TimerStartEvent) {
		dispatch('start', { timer: event.detail.val, name: event.detail.name });
	}

	function openDialog(type: 'work' | 'rest') {
		dialogForType = type;
		dialogInput = null;
		dialogOpen = true;
		setTimeout(() => {
			dialogEl?.querySelector<HTMLInputElement>('.dialog-input')?.focus();
		}, 0);
	}

	function closeDialog() {
		dialogOpen = false;
		dialogForType = null;
	}

	function confirmDialog() {
		if (dialogInput !== null && dialogInput > 0) {
			const val = Math.round(dialogInput);
			if (dialogForType === 'work') {
				if (!$workTimers.includes(val)) {
					workTimers.update((list) => [...list, val].sort((a, b) => a - b));
				}
			} else if (dialogForType === 'rest') {
				if (!$restTimers.includes(val)) {
					restTimers.update((list) => [...list, val].sort((a, b) => a - b));
				}
			}
		}
		closeDialog();
	}

	function removeTimer(type: 'work' | 'rest', value: number) {
		if (type === 'work') {
			workTimers.update((list) => list.filter((v) => v !== value));
		} else {
			restTimers.update((list) => list.filter((v) => v !== value));
		}
	}

	function handleDialogKey(e: KeyboardEvent) {
		if (e.key === 'Enter') confirmDialog();
		if (e.key === 'Escape') closeDialog();
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) closeDialog();
	}

	export function clear() {
		workComponents.forEach((el) => el?.reset());
		restComponents.forEach((el) => el?.reset());
	}
</script>

<div class="controls-wrapper">
	<div class="grid-container">
		<!-- Active column -->
		<div class="item">
			<span class="label">Active</span><br />
			<div class="timers-list">
				{#each $workTimers as timer, i}
					<div class="timer-item">
						<TimerStarter
							value={timer}
							name={TIMER_TYPES.WORK}
							on:start={handleTimerStart}
							bind:this={workComponents[i]}
						/>
						<button class="delete-timer-btn" on:click={() => removeTimer('work', timer)} title="Удалить">×</button>
					</div>
				{/each}
				<button class="add-btn" title="Добавить таймер" on:click={() => openDialog('work')}>+</button>
			</div>
		</div>

		<div class="item">
			<slot></slot>
		</div>

		<!-- Rest column -->
		<div class="item">
			<span class="label">Rest</span><br />
			<div class="timers-list">
				{#each $restTimers as timer, i}
					<div class="timer-item">
						<TimerStarter
							value={timer}
							name={TIMER_TYPES.REST}
							on:start={handleTimerStart}
							bind:this={restComponents[i]}
						/>
						<button class="delete-timer-btn" on:click={() => removeTimer('rest', timer)} title="Удалить">×</button>
					</div>
				{/each}
				<button class="add-btn" title="Добавить таймер" on:click={() => openDialog('rest')}>+</button>
			</div>
		</div>
	</div>
</div>

<!-- Modal dialog -->
{#if dialogOpen}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="backdrop" on:click={handleBackdropClick} role="presentation">
		<div
			class="dialog"
			bind:this={dialogEl}
			on:keydown={handleDialogKey}
			role="dialog"
			aria-modal="true"
			aria-label="Добавить таймер"
		>
			<p class="dialog-title">Своё время (мин)</p>
			<input class="dialog-input" type="number" min="1" max="999" placeholder="например, 45" bind:value={dialogInput} />
			<div class="dialog-actions">
				<button class="dialog-ok" on:click={confirmDialog} disabled={!dialogInput || dialogInput <= 0}>
					Добавить
				</button>
				<button class="dialog-cancel" on:click={closeDialog}>Отмена</button>
			</div>
		</div>
	</div>
{/if}

<style>
	@import '../../styles/fonts.css';

	.controls-wrapper {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.grid-container {
		display: grid;
		grid-template-columns: 1fr 3fr 1fr;
		column-gap: 50px;
		min-height: 168px; /* roughly 35% of 480 */
		align-items: start;
	}

	.item {
		text-align: center;
	}

	.label {
		font-family: 'Roboto-Regular';
		padding: 10px;
		color: #554242;
	}

	.timers-list {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
	}

	.timer-item {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.delete-timer-btn {
		position: absolute;
		right: -25px;
		top: 50%;
		transform: translateY(-50%);
		background: #722a2a;
		color: white;
		border: none;
		border-radius: 50%;
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		font-weight: bold;
		font-size: 14px;
		z-index: 5;
		padding: 0;
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 0.2s,
			visibility 0.2s;
	}

	.timer-item:hover .delete-timer-btn {
		opacity: 1;
		visibility: visible;
	}

	.add-btn {
		height: 38px;
		width: 46px;
		border-radius: 8px;
		border: 1px dashed #554242;
		background-color: transparent;
		color: rgb(180, 180, 180);
		font-size: 22px;
		line-height: 1;
		cursor: pointer;
		margin: 5px 8px;
		transition:
			background-color 0.2s,
			border-color 0.2s;
	}

	.add-btn:hover {
		background-color: #554242;
		border-color: #7e5454;
		color: rgb(220, 220, 220);
	}

	.backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.55);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.dialog {
		background: rgb(31, 30, 30);
		border: 1px solid #554242;
		border-radius: 12px;
		padding: 24px 28px 20px;
		min-width: 240px;
		display: flex;
		flex-direction: column;
		gap: 14px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
	}

	.dialog-title {
		margin: 0;
		font-family: 'Roboto-Regular';
		color: rgb(220, 220, 220);
		font-size: 16px;
	}

	.dialog-input {
		width: 100%;
		height: 40px;
		border-radius: 8px;
		border: 1px solid #554242;
		background-color: rgb(20, 19, 19);
		color: rgb(220, 220, 220);
		font-size: 18px;
		font-family: 'Roboto-Regular';
		text-align: center;
		box-sizing: border-box;
		padding: 0 8px;
	}

	.dialog-input:focus {
		outline: none;
		border-color: var(--work-buttons, #7e5454);
	}

	.dialog-input::-webkit-outer-spin-button,
	.dialog-input::-webkit-inner-spin-button {
		-webkit-appearance: none;
	}
	.dialog-input[type='number'] {
		-moz-appearance: textfield;
		appearance: textfield;
	}

	.dialog-actions {
		display: flex;
		gap: 10px;
		justify-content: flex-end;
	}

	.dialog-ok,
	.dialog-cancel {
		height: 38px;
		padding: 0 18px;
		border-radius: 8px;
		border: none;
		font-size: 15px;
		font-family: 'Roboto-Regular';
		cursor: pointer;
		width: auto;
	}

	.dialog-ok {
		background-color: #554242;
		color: rgb(220, 220, 220);
	}

	.dialog-ok:hover:not(:disabled) {
		background-color: #7e5454;
	}

	.dialog-ok:disabled {
		background-color: var(--disabled-bg-color, #3a3a3a);
		color: var(--disabled-color, #888);
		cursor: default;
	}

	.dialog-cancel {
		background-color: rgb(50, 48, 48);
		color: rgb(180, 180, 180);
	}

	.dialog-cancel:hover {
		background-color: #554242;
		color: rgb(220, 220, 220);
	}
</style>
