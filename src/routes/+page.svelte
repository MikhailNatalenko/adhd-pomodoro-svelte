<script lang="ts">
	import Pomodoro from '$lib/components/Pomodoro.svelte';
	import Logpanel from '$lib/components/Logpanel.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	import type { TimerEvent } from '$lib/types';
	import { pomApp, darkMode, editMode } from '$lib/stores/pomodoroStore';
	import { timer } from '$lib/stores/timerStore';
	import { onMount, onDestroy } from 'svelte';
	import { dev } from '$app/environment';
	import { getParam } from '$lib/constants';
	import Pencil from '$lib/icons/Pencil.svelte';

	let debug: boolean = false;
	let currentTimer: number;
	let loading = true;
	let activeTimerInterval: ReturnType<typeof setInterval> | undefined;

	// Update active timer finish time when timer is running
	$: if ($pomApp && currentTimer !== undefined) {
		pomApp.update((app) => {
			app.tick(new Date(), getParam(debug).timersMultiplier);
			return app;
		});
	}

	// Update active timer finish time periodically whenever it exists
	$: {
		if ($pomApp?.active) {
			if (!activeTimerInterval) {
				activeTimerInterval = setInterval(() => {
					pomApp.update((app) => {
						const multiplier = getParam(debug).timersMultiplier;
						const autoStopped = app.tick(new Date(), multiplier);
						if (autoStopped) timer.stop();
						return app;
					});
				}, 1000);
			}
		} else {
			if (activeTimerInterval) {
				clearInterval(activeTimerInterval);
				activeTimerInterval = undefined;
			}
		}
	}

	onDestroy(() => {
		if (activeTimerInterval) {
			clearInterval(activeTimerInterval);
		}
	});

	function onTimer(event: TimerEvent) {
		pomApp.update((app) => app.addTimer(event.detail));
	}

	function onActiveTimer(event: TimerEvent) {
		pomApp.update((app) => app.setActive(event.detail));
	}

	function onCancel() {
		pomApp.update((app) => app.resetActive());
	}

	onMount(() => {
		console.log('get darkmode:', $darkMode);

		// Auto-resume timer if there's an active timer from cookies
		if ($pomApp?.active) {
			const status = $pomApp.getRecoveryStatus(new Date(), getParam(debug).timersMultiplier);

			if (status.shouldArchive) {
				pomApp.update((app) => {
					if (app.active) app.addTimer(app.active);
					return app;
				});
				console.log('Timer expired beyond cap while closed, archived to history');
			} else if (status.shouldResume) {
				timer.start(status.remainingMinutes, $pomApp.active.name, debug);
				console.log('Resumed timer with', status.remainingMinutes, 'minutes remaining');
			} else {
				console.log('Timer in overtime, resumed background monitoring');
			}
		}

		loading = false;
	});

	function toggleDark() {
		darkMode.update((value) => !value);
		console.log('toggle dark', $darkMode);
	}
</script>

{#if loading}
	<main style="background-color:gray; height:90 	vh"></main>
{:else}
	<main class:dark={$darkMode}>
		<div class="container">
			<div class="pomodoro">
				<div class="header-row">
					<div class="edit-wrapper">
						<button
							class="icon-button"
							class:active={$editMode}
							on:click={() => editMode.update((v) => !v)}
							title={$editMode ? 'Done' : 'Edit timers'}
						>
							<Pencil />
						</button>
					</div>
					<h1 class="logo">Let's Pomodoro!</h1>
					<div class="toggle-wrapper">
						<ThemeToggle />
					</div>
				</div>
				<Pomodoro
					debugFlag={debug}
					on:timer={onTimer}
					on:current={onActiveTimer}
					on:cancel={onCancel}
					bind:remainedSeconds={currentTimer}
				/>
			</div>
			<div class="logs">
				<Logpanel />
			</div>
		</div>
	</main>
{/if}
{#if dev}
	<div class="debug-div">
		<label id="debug">
			Debug:<input type="checkbox" bind:checked={debug} />
		</label>
	</div>
{/if}

<style>
	@import './../styles/fonts.css';

	:root {
		--background-color: rgb(245, 239, 236);
		--logs-background-color: #f0f0ed;
		--logs-border-color: #b6b6ae;
		--text-color: #482a2a;
		--work-buttons: #040d12;
		--buttons-text-color: #e0e0e0;
		--rest-buttons: #183d3d;
		--rest-light1: #5c8374;
		--delete-background-color: rgba(114, 42, 42, 0.726);
		--disabled-bg-color: #bfb6b4;
		--disabled-color: darkslategrey;
		--chosen-bg-color: burlywood;
		--hover-bg-color: #554242;
		--slider-color: #d3d3d3;
		--logline-time-color: #c0c0c0;
	}

	.dark {
		--background-color: #040d12;
		--logs-background-color: #06141c;
		--logs-border-color: #4d4d4c;
		--text-color: #c2bcbc;
		--work-buttons: #183d3d;
		--buttons-text-color: #e0e0e0;
		--rest-buttons: #183d3d;
		--rest-light1: #5c8374;
		--delete-background-color: rgba(103, 39, 39, 0.726);
		--disabled-bg-color: #363333;
		--disabled-color: rgb(24, 24, 24);
		--chosen-bg-color: #d99bc8;
		--hover-bg-color: #554242;
		--slider-color: #4d4d4c;
		--logline-time-color: #4d4d4c;
	}

	main {
		display: flex;
		justify-content: center;
		background-color: var(--background-color);
		color: var(--text-color);
		min-height: 100vh;
		overflow-y: auto;
	}

	.container {
		min-height: 100vh;
		flex-direction: column;
		display: flex;
		max-width: 70vw;
		padding-bottom: 40px;
	}

	.header-row {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 20px;
		width: 100%;
	}

	.toggle-wrapper {
		position: absolute;
		right: 20px;
	}

	.edit-wrapper {
		position: absolute;
		left: 20px;
	}

	.icon-button {
		background: transparent;
		border: none;
		color: var(--text-color);
		cursor: pointer;
		display: flex;
		align-items: center;
		padding: 8px;
		border-radius: 50%;
		transition:
			background-color 0.2s,
			color 0.2s;
		width: 40px;
		height: 40px;
		opacity: 0.6;
	}

	.icon-button:hover {
		background-color: rgba(128, 128, 128, 0.1);
		opacity: 1;
	}

	.icon-button.active {
		background-color: var(--chosen-bg-color);
		color: #000;
		opacity: 1;
	}

	.pomodoro {
		margin-bottom: 20px;
	}

	.logs {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		max-width: 70vw;
	}
	.logo {
		font-family: 'title_roboto', sans-serif;
		font-size: 45px;
		text-align: center;
		color: var(--text-color);
		margin: 0px;
	}

	.debug-div {
		position: fixed;
		right: 0;
		bottom: 0;
		padding: 10px;
	}
</style>
