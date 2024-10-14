<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { playAlertSound } from './audio/Ringer.svelte';
	import Tooltip from './Tooltip.svelte';
	import { formatTimeClock } from '$lib/utils';
	import { PreciseTimer } from '$lib/precise_timer';

	export let time = 0;
	export var remainedSeconds = 0;
	
	var timer: PreciseTimer;
	const dispatch = createEventDispatcher();

	$: runTimer(time);

	function runTimer(duration: number) {
		if (timer != undefined) timer.stop();
		console.log('RUUN!');
		timer = new PreciseTimer(duration, tick, alarming);
		remainedSeconds = duration;
	}

	function tick(remain: number) {
		remainedSeconds = remain;
	}
	function alarming() {
		playAlertSound();
		dispatch('alarming');
	}

	function stop() {
		dispatch('stop');
	}
</script>

<Tooltip title="stop timer">
	<button id="watch" on:click={stop}>{formatTimeClock(remainedSeconds)} </button>
</Tooltip>

<style>
	@import './../styles/fonts.css';

	#watch {
		border: none;
		background: none;
		cursor: pointer;
		font-family: 'Roboto-Regular';
		font-size: 5em;
		/* margin: 0em; */
		text-align: center;
		font-weight: bold;
		font-stretch: ultra-condensed;
		cursor: pointer;
	}

	#watch:hover {
		color: dimgrey;
	}
</style>
