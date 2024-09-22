<script lang="ts">
	// @ts-nocheck

	import Clock from './Clock.svelte';
	import Controls from './Controls.svelte';
	import { onMount } from 'svelte';
	import { playAlertSound } from './audio/Ringer.svelte';
	import Volume from './audio/Volume.svelte';
	import { createEventDispatcher } from 'svelte';
	import Annoyer from './Annoyer.svelte';
	import Tooltip from './Tooltip.svelte';
	import { TimerState } from './types';
	import { changeFavicon } from './Favicon.svelte';

	const dispatch = createEventDispatcher();

	export let timersMultiplier: number;
	export let afterClockIntervaltS: number;
	export let afterClockTimeoutS: number;
	export let addingTimeTimeout: number;

	let timerState = TimerState.STOPPED;

	$: changeFavicon(timerState);

	let controlsActive = true;
	let pomodoroClock = 0;
	let addingClock = 0;

	let mainTimerBegin: Date = new Date();
	let pomName = '';

	$: console.log('pomodoroClock', pomodoroClock);
	$: console.log('timerFor', pomodoroClock);

	function resetPomodoroClock() {
		pomodoroClock = 0;
	}

	function setPomodoroClock(num) {
		pomodoroClock = num * timersMultiplier;
	}

	function startTimer(event: Any) {
		timerState = TimerState.RUNNING;
		setPomodoroClock(event.detail.timer);
		pomName = event.detail.name;
		mainTimerBegin = new Date();
		dispatch('new', { timer: pomodoroClock });
	}

	function continueRun(event: Any) {
		timerState = TimerState.RUNNING;
		setPomodoroClock(event.detail.timer);
	}

	function alarming() {
		if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
			stopTimer(); // Change timer state to STOPPED if page is visible
			return;
		}
		timerState = TimerState.WAITING_FOR_STOP;
	}

	function addingTime() {
		timerState = TimerState.ADDING_TIME;
		resetPomodoroClock();
		// //TODO: отправлять начало и конец, видимо, правильно
		// dispatch('timer', {finish: Date.now()});
		addingClock = addingTimeTimeout;
	}

	function stopTimer(emit: boolean = true) {
		console.log('stopTimer');
		timerState = TimerState.STOPPED;
		resetPomodoroClock();

		//TODO: отправлять начало и конец, видимо, правильно
		if (!emit) return;

		dispatch('timer', {
			start: mainTimerBegin,
			finish: new Date(),
			timer: pomodoroClock,
			name: pomName
		});
	}

	function cancelTimer() {
		stopTimer(false);
	}

	function stopTimerFromClock() {
		if (timerState === TimerState.STOPPED) return;

		stopTimer(true);
	}

	onMount(() => {
		// const cookies = document.cookie.split(';');

		// for (let i = 0; i < cookies.length; i++) {
		//     const cookie = cookies[i].trim();
		//     if (cookie.startsWith('volume=')) {
		//         volume = Number(cookie.substring('volume='.length, cookie.length));
		//     }
		// }
		// Event listener for visibility change
		document.addEventListener('visibilitychange', function () {
			if (timerState === TimerState.WAITING_FOR_STOP) {
				if (document.visibilityState === 'visible') {
					console.log('visibility change to visible');
					stopTimer(true);
				}
			}
		});
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

<Annoyer
	active={timerState === TimerState.WAITING_FOR_STOP}
	intervalS={afterClockIntervaltS}
	timeoutS={afterClockTimeoutS}
	on:off={stopTimer}
/>

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
