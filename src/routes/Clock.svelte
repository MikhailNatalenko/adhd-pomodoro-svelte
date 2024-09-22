<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { playAlertSound } from './audio/Ringer.svelte';
	import Tooltip from './Tooltip.svelte';

	export let time = 0;
	export let visible = true;
	$: runTimer(time);

	const dispatch = createEventDispatcher();

	let startTs = new Date();
	let currentTimerValue = 0;
	let intervalId = 0;

	function runTimer(timeValue: number) {
		console.log('runTimer', timeValue);
		startTs = new Date();
		clearInterval(intervalId);
		currentTimerValue = timeValue;

		if (time == 0) {
			//stop timer, nothing to run
			return;
		}

		intervalId = setInterval(() => {
			let remainingTime = time - Math.floor((Date.now() - startTs.getTime()) / 1000);
			if (remainingTime <= 0) {
				alarming();
				clearInterval(intervalId);
				return;
			}
			currentTimerValue = remainingTime;
		}, 500);
	}

	function alarming() {
		playAlertSound();
		dispatch('alarming', { startTs: startTs, initTime: time, endTs: new Date() });
	}

	function formatTime(time: number) {
		let minutes = Math.floor(time / 60)
			.toString()
			.padStart(2, '0');
		let seconds = Math.floor(time % 60)
			.toString()
			.padStart(2, '0');
		return `${minutes}:${seconds}`;
	}

	function stop() {
		dispatch('stop');
	}
</script>

<Tooltip title="stop timer">
	{#if visible}
		<button id="watch" on:click={stop}>{formatTime(currentTimerValue)} </button>
	{/if}
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
