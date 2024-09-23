<script lang="ts">
	import Pomodoro from './Pomodoro.svelte';
	import Logpanel from './Logpanel.svelte';

	import type { Timer, TimerEvent } from '$lib/types';
	import { dbgParams, prodParams } from '$lib/constants';

	let debug: boolean = false;

	let timerLogs: Timer[] = [];

	function onTimer(event: TimerEvent) {
		timerLogs = [...timerLogs, event.detail];
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
