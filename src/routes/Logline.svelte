<script lang="ts">
	import { formatTimeLogline } from '$lib/utils';
	import { fade } from 'svelte/transition';

	export let start: Date;
	export let finish: Date;
	export let name: string;
	export let toplog: boolean;
	function formatTs(time: Date) {
		let minutes = time.getHours().toString().padStart(2, '0');
		let seconds = time.getMinutes().toString().padStart(2, '0');
		return `${minutes}:${seconds}`;
	}

	$: duration = (finish.getTime() - start.getTime()) / 1000;

	let startClock = formatTs(start);
	$: rest = name === 'rest';
</script>

<snap transition:fade={{ duration: 450 }} class:toplog class="logline" class:rest>
	<snap class="time work">{startClock}</snap>
	<snap>
		{#if rest}
			Rest for
		{:else}
			Active for
		{/if}
	</snap>
	<snap class="duration">{formatTimeLogline(duration)}</snap>
</snap>

<style>
	@import './../styles/fonts.css';

	.logline {
		font-family: 'title_hero_regular';
		font-size: 1em;
		margin: 0.5em;
	}
	.time {
		font-family: 'title_hero_bold';
		font-size: 1em;
		color: #c0c0c0;
		/* margin: 0.5em; */
	}
	.duration {
		font-family: 'title_hero_bold';
		font-size: 1em;
		/* margin: 0.5em; */
	}

	.rest {
		color: #83b37f;
	}

	/*
	@keyframes greenOne {
		from {color: black;}
		to {color: #83b37f;}
	}

	@keyframes blackOne {
		from {color: #83b37f;}
		to {color: black;}
	}
	.rest.toplog {
		animation: greenOne;
		animation-duration: 1s;
	}

	.toplog {
		animation: blackOne;
		animation-duration: 1s;
	}*/
</style>
