<script lang="ts">
	import Pomodoro from './Pomodoro.svelte';
	import Logpanel from './Logpanel.svelte';
	import Cookies from 'js-cookie';

	import type { TimerEvent } from '$lib/types';
	import { TimerList } from '$lib/timerlog';
	import { onMount } from 'svelte';

	let debug: boolean = false;

	let timerLogs: TimerList;

	let currentTimer: number;
	let darkMode: boolean;
	let loading = true;

	$: timerLogs = timerLogs?.setActiveDur(currentTimer);

	function onTimer(event: TimerEvent) {
		timerLogs = timerLogs.addTimer(event.detail);
	}

	function onActiveTimer(event: TimerEvent) {
		timerLogs = timerLogs.setActive(event.detail);
	}

	function onCancel() {
		timerLogs = timerLogs.resetActive();
	}

	onMount(() => {
		darkMode = Cookies.get('darkmode') === 'true';
		console.log('get darkmode:', darkMode);
		loading = false;
	});

	function toggleDark() {
		darkMode = !darkMode;
		console.log('toggle dark', darkMode);
		Cookies.set('darkmode', darkMode ? 'true' : 'false', { expires: 31 });
	}
</script>

{#if loading}
	<main style="background-color:gray; height:90 	vh"></main>
{:else}
	<main class:dark={darkMode}>
		<div class="container">
			<div class="pomodoro">
				<h1 class="logo">Let's Pomodoro!</h1>
				<Pomodoro
					debugFlag={debug}
					on:timer={onTimer}
					on:current={onActiveTimer}
					on:cancel={onCancel}
					bind:remainedSeconds={currentTimer}
				/>
			</div>
			<div class="logs">
				<Logpanel bind:timerLogs />
			</div>
		</div>
	</main>
{/if}
<div class="debug-div">
	<label id="debug">
		Debug:<input type="checkbox" bind:checked={debug} />
		<button on:click={toggleDark}> Toggle Dark Mode </button></label
	>
</div>

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
		--choosen-bg-color: burlywood;
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
		--choosen-bg-color: #d99bc8;
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

	.pomodoro {
		height: 400px;
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
