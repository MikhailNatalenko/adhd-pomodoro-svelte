<script lang="ts">
	import Pomodoro from './Pomodoro.svelte';
	import Logpanel from './Logpanel.svelte';

	import type { TimerEvent } from '$lib/types';
	import { TimerList } from '$lib/timerlog';

	let debug: boolean = false;

	let timerLogs: TimerList;

	let currentTimer: number;

	$: timerLogs = timerLogs?.setActiveDur(currentTimer);

	function onTimer(event: TimerEvent) {
		timerLogs = timerLogs.push(event.detail);
	}

	function onActiveTimer(event: TimerEvent) {
		timerLogs = timerLogs.setActive(event.detail);
	}

	function onCancel() {
		timerLogs = timerLogs.resetActive();
	}
</script>

<main>
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
<div class="debug-div">
	<label id="debug"> Debug:<input type="checkbox" bind:checked={debug} /> </label>
</div>

<style>
	@import './../styles/fonts.css';

	main {
		display: flex;
		justify-content: center;
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
