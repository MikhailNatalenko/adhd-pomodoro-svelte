<script lang="ts">
	import Pomodoro from '$lib/components/Pomodoro.svelte';
	import Logpanel from '$lib/components/Logpanel.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	import type { TimerEvent } from '$lib/types';
	import { pomApp, darkMode } from '$lib/stores/pomodoroStore';
	import { timer } from '$lib/stores/timerStore';
	import { onMount, onDestroy } from 'svelte';
	import { dev } from '$app/environment';

	let debug: boolean = false;
	let currentTimer: number;
	let loading = true;
	let activeTimerInterval: ReturnType<typeof setInterval> | undefined;

	// Update active timer finish time when timer is running
	$: if ($pomApp && currentTimer !== undefined) {
		pomApp.update((app) => {
			app.updateActiveTimer();
			return app;
		});
	}

	// Update active timer finish time periodically whenever it exists
	$: {
		if ($pomApp?.active) {
			if (!activeTimerInterval) {
				console.log('Starting active timer interval');
				activeTimerInterval = setInterval(() => {
					pomApp.update((app) => {
						if (app.active) {
							app.active.finish = new Date();
						}
						return app;
					});
				}, 1000);
			}
		} else {
			if (activeTimerInterval) {
				console.log('Clearing active timer interval');
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
			const now = new Date();
			const elapsed = (now.getTime() - $pomApp.active.start.getTime()) / 1000; // seconds
			const planned = $pomApp.active.value * 60; // convert minutes to seconds
			const remaining = Math.max(0, planned - elapsed);

			console.log('Auto-resuming timer:', {
				elapsed,
				planned,
				remaining,
				timerType: $pomApp.active.name
			});

			// If there's still time remaining, start the timer
			if (remaining > 0) {
				const remainingMinutes = remaining / 60;
				timer.start(remainingMinutes, $pomApp.active.name, debug);
				console.log('Started timer with', remainingMinutes, 'minutes remaining');
			} else {
				// Timer expired, remove active timer
				pomApp.update((app) => app.resetActive());
				console.log('Timer expired, cleared active timer');
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
					<h1 class="logo">Let's Pomodoro!</h1>
					<ThemeToggle />
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
	}

	.container {
		height: 100vh;
		flex-direction: column;
		display: flex;
		max-width: 70vw;
	}

	.header-row {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 20px;
		margin-bottom: 20px;
	}

	.pomodoro {
		height: 480px;
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
		right: 0; /* Привязка к правой стороне экрана */
		bottom: 0; /* Привязка к нижней стороне экрана */
		padding: 10px;
	}
</style>
