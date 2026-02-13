<script lang="ts">
	import Clock from '$lib/components/Clock.svelte';
	import Controls from '$lib/components/Controls.svelte';
	import Volume from '$lib/components/audio/Volume.svelte';
	import Annoyer from '$lib/components/Annoyer.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';

	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import { TimerState, EmitTimer } from '$lib/types';
	import { changeFavicon } from '$lib/components/Favicon.svelte';
	import { timer, timerState, currentTimer, clockDuration } from '$lib/stores/timerStore';

	const dispatch = createEventDispatcher();

	export let debugFlag: boolean;
	export let remainedSeconds: number;

	let controlsComponent: Controls;

	// Automatically update favicon when state changes
	$: changeFavicon($timerState);

	interface TimerStartEvent {
		detail: {
			timer: number;
			name: string;
		};
	}

	function onStartTimer(event: TimerStartEvent) {
		if ($timerState === TimerState.RUNNING) {
			handleStop(EmitTimer.EMIT);
		}

		timer.start(event.detail.timer, event.detail.name, debugFlag);
		dispatch('current', $currentTimer);
	}

	function onAlarm() {
		const isVisible = typeof document !== 'undefined' && document.visibilityState === 'visible';
		timer.alarm(isVisible);

		if (isVisible) {
			if (controlsComponent) controlsComponent.clear();
			dispatch('timer', $currentTimer);
		}
	}

	function handleStop(emit: EmitTimer = EmitTimer.EMIT) {
		timer.stop();
		if (controlsComponent) controlsComponent.clear();

		if (emit === EmitTimer.EMIT) {
			dispatch('timer', $currentTimer);
		}
	}

	function cancelTimer() {
		timer.reset();
		if (controlsComponent) controlsComponent.clear();
		dispatch('cancel');
	}

	function onStopFromClock() {
		if ($timerState === TimerState.STOPPED) return;
		handleStop(EmitTimer.EMIT);
	}

	onMount(() => {
		document.addEventListener('visibilitychange', function () {
			if ($timerState === TimerState.WAITING_FOR_STOP) {
				if (document.visibilityState === 'visible') {
					console.log('visibility change to visible');
					handleStop(EmitTimer.EMIT);
				}
			}
		});
	});
</script>

<Controls
	bind:this={controlsComponent}
	on:start={onStartTimer}
	on:stop={() => handleStop(EmitTimer.DO_NOT_EMIT)}
>
	<div class="clock">
		<Clock
			time={$clockDuration}
			bind:remainedSeconds
			on:alarming={onAlarm}
			on:stop={onStopFromClock}
		/>
		<Tooltip title="Volume">
			<Volume /><br />
		</Tooltip>
		{#if $timerState !== TimerState.STOPPED}
			<Tooltip title="stop and don't save logs">
				<button id="stopper" on:click={cancelTimer}>cancel</button> <br />
			</Tooltip>
		{/if}
	</div>
</Controls>

<Annoyer
	active={$timerState === TimerState.WAITING_FOR_STOP}
	{debugFlag}
	on:off={() => handleStop(EmitTimer.DO_NOT_EMIT)}
/>

<style>
	@import '../../styles/button.css';

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
