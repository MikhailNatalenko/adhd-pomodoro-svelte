<script lang="ts">
	// @ts-nocheck

	import Clock from './Clock.svelte';
	import Controls from './Controls.svelte';
	import Volume from './audio/Volume.svelte';
	import Annoyer from './Annoyer.svelte';
	import Tooltip from './Tooltip.svelte';

	import { onMount } from 'svelte';
	import { playAlertSound } from './audio/Ringer.svelte';
	import { createEventDispatcher } from 'svelte';
	import { TimerState, Timer } from '$lib/types';
	import { changeFavicon } from './Favicon.svelte';
	import { getParam } from '$lib/constants';

	const dispatch = createEventDispatcher();

	// decrease timings or not
	export let debugFlag: boolean;
	// state of pomodoro
	let timerState = TimerState.STOPPED;
	// object of Timer to send on finish
	let currentTimer = new Timer();
	// time for visual clock
	let pomodoroClock = 0;

	$: changeFavicon(timerState);

	function setPomodoroClock(num) {
		pomodoroClock = num * getParam(debugFlag).timersMultiplier;
	}

	function startTimer(event: Any) {
		timerState = TimerState.RUNNING;
		setPomodoroClock(event.detail.timer);

		currentTimer = new Timer(event.detail.timer, event.detail.name);
		currentTimer.finish = new Date();
		dispatch('timer', currentTimer);
	}

	function alarming() {
		if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
			stopTimer(true); // Change timer state to STOPPED if page is visible
			return;
		}
		timerState = TimerState.WAITING_FOR_STOP;
	}

	function stopTimer(emit: boolean = true) {
		timerState = TimerState.STOPPED;
		currentTimer.finish = new Date();
		pomodoroClock = 0; // reset the clock

		if (emit) dispatch('timer', currentTimer);
	}

	function cancelTimer() {
		stopTimer(false); //do not send event and save logs
	}

	function stopTimerFromClock() {
		if (timerState === TimerState.STOPPED) return;

		stopTimer(true);
	}

	onMount(() => {
		document.addEventListener('visibilitychange', function () {
			if (timerState === TimerState.WAITING_FOR_STOP) {
				if (document.visibilityState === 'visible') {
					console.log('visibility change to visible');
					stopTimer(true);
				}
			}
		});

		setInterval(function () {
			if (timerState == TimerState.RUNNING) {
				currentTimer.finish = new Date();
				dispatch('timer', currentTimer);
			}
		}, 5000);
	});
</script>

<Controls active={timerState === TimerState.STOPPED} on:start={startTimer} on:stop={stopTimer}>
	<div class="clock">
		<Clock time={pomodoroClock} on:alarming={alarming} on:stop={stopTimerFromClock} />
		<Tooltip title="Volume">
			<Volume /><br />
		</Tooltip>
		{#if timerState !== TimerState.STOPPED}
			<Tooltip title="stop and don't save logs">
				<button id="stopper" on:click={cancelTimer} hidden={timerState === TimerState.STOPPED}
					>cancel</button
				> <br />
			</Tooltip>
		{/if}
	</div>
</Controls>

<Annoyer active={timerState === TimerState.WAITING_FOR_STOP} {debugFlag} on:off={stopTimer} />

<style>
	@import './../styles/button.css';

	.clock {
		text-align: center;
		padding-top: 32%;
	}

	#stopper {
		background-color: rgba(103, 39, 39, 0.726);
		height: 30px;
		width: 100px;
		margin-top: -10px;
	}
</style>
