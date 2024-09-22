<script lang="ts">
	import Pomodoro from './Pomodoro.svelte';
	import type { TimerLog, TimerEvent } from './types.ts';
	import Logpanel from './Logpanel.svelte';
	import { dbgParams, prodParams } from './constants';

	let debug: boolean = false;

	let timerLogs: TimerLog[] = [];
	let logCur = 0;

	function onTimer(event: TimerEvent) {
		console.log(`Start time: ${event.detail.start} - finish: ${event.detail.finish}`);
		let logRecord: TimerLog = {
			id: ++logCur,
			name: event.detail.name,
			start: event.detail.start,
			finish: event.detail.finish
		};
		timerLogs = [...timerLogs, logRecord];
	}
</script>

<main>
	<div class="centered-div">
		<h1 class="logo">Let's Pomodoro!</h1>

		{#if debug}
			<Pomodoro {...dbgParams} on:timer={onTimer} />
		{:else}
			<Pomodoro {...prodParams} on:timer={onTimer} />
		{/if}

		<Logpanel bind:timerLogs />
	</div>
</main>
<div class="debug-div">
	<label id="debug"> Debug:<input type="checkbox" bind:checked={debug} /> </label>
</div>

<style>
	@import './../styles/fonts.css';

	main {
		display: flex;
		justify-content: center; /* Выравнивание по центру горизонтально */
	}
	.logo {
		font-family: 'title_roboto', sans-serif;
		font-size: 45px;
		text-align: center;
		color: #482a2a;
		margin: 0px;
	}

	.debug-div {
		position: fixed;
		right: 0; /* Привязка к правой стороне экрана */
		bottom: 0; /* Привязка к нижней стороне экрана */
		padding: 10px;
	}
</style>
