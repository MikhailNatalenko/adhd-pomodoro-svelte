<script lang="ts">
	import Clock from './Clock.svelte';
	import Controls from './Controls.svelte';
	import Volume from './audio/Volume.svelte';
	import Annoyer from './Annoyer.svelte';
	import Tooltip from './Tooltip.svelte';

	import { onMount } from 'svelte';
	import { playAlertSound } from './audio/Ringer.svelte';
	import { createEventDispatcher } from 'svelte';
	import { TimerState, Timer, EmitTimer, type TimerStateType } from '$lib/types';
	import { changeFavicon } from './Favicon.svelte';
	import { getParam } from '$lib/constants';

	const dispatch = createEventDispatcher();

	// decrease timings or not
	export let debugFlag: boolean;
	// state of pomodoro
	let timerState: TimerStateType = TimerState.STOPPED;
	// object of Timer to send on finish
	let currentTimer = new Timer();
	// limit for visual clock
	let pomodoroClock = 0;
	// time for visual clock
	export let remainedSeconds: number;

	let controlsComponent: Controls;

	$: changeFavicon(timerState);

	function startTimer(num: number) {
		pomodoroClock = num * getParam(debugFlag).timersMultiplier;
	}

	interface TimerStartEvent {
		detail: {
			timer: number;
			name: string;
		};
	}

	function onStartTimer(event: TimerStartEvent) {
		if (timerState === TimerState.RUNNING) {
			onStopTimer(EmitTimer.EMIT);
		}
		timerState = TimerState.RUNNING;
		startTimer(event.detail.timer);

		currentTimer = new Timer(event.detail.timer, event.detail.name);
		dispatch('current', currentTimer);
	}

	function onAlarm() {
		if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
			onStopTimer(EmitTimer.EMIT); // Change timer state to STOPPED if page is visible
			return;
		}
		timerState = TimerState.WAITING_FOR_STOP;
	}

	function onStopTimer(emit: EmitTimer = EmitTimer.EMIT) {
		timerState = TimerState.STOPPED;
		if (controlsComponent) controlsComponent.clear();
		currentTimer.finish = new Date();
		pomodoroClock = 0; // reset the clock

		if (emit === EmitTimer.EMIT) dispatch('timer', currentTimer);
	}

	function cancelTimer() {
		onStopTimer(EmitTimer.DO_NOT_EMIT); //do not send event and save logs
		dispatch('cancel');
	}

	function onStopFromClock() {
		if (timerState === TimerState.STOPPED) return;

		onStopTimer(EmitTimer.EMIT);
	}

	onMount(() => {
		document.addEventListener('visibilitychange', function () {
			if (timerState === TimerState.WAITING_FOR_STOP) {
				if (document.visibilityState === 'visible') {
					console.log('visibility change to visible');
					onStopTimer(EmitTimer.EMIT);
				}
			}
		});
	});
</script>

<Controls
	bind:this={controlsComponent}
	active={timerState === TimerState.STOPPED}
	on:start={onStartTimer}
	on:stop={() => onStopTimer(EmitTimer.DO_NOT_EMIT)}
>
	<div class="clock">
		<Clock
			time={pomodoroClock}
			bind:remainedSeconds
			on:alarming={onAlarm}
			on:stop={onStopFromClock}
		/>
		<Tooltip title="Volume">
			<Volume /><br />
		</Tooltip>
		{#if timerState !== TimerState.STOPPED}
			<Tooltip title="stop and don't save logs">
				<button id="stopper" on:click={cancelTimer}>cancel</button> <br />
			</Tooltip>
		{/if}
	</div>
</Controls>

<Annoyer
	active={timerState === TimerState.WAITING_FOR_STOP}
	{debugFlag}
	on:off={() => onStopTimer(EmitTimer.DO_NOT_EMIT)}
/>

<style>
	@import './../styles/button.css';

	.clock {
		text-align: center;
		padding-top: 32%;
	}

	#stopper {
		background-color: var(--delete-background-color);
		height: 30px;
		width: 100px;
		margin-top: -10px;
	}
</style>
