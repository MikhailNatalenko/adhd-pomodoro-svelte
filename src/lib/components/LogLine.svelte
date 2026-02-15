<script lang="ts">
	import { formatTimeLogLine } from '$lib/utils';
	import { TIMER_TYPES } from '$lib/constants';

	export let start: Date;
	export let finish: Date;
	export let name: string;
	export let value: number = 0;
	export let topLog: boolean = false;
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	function formatTs(time: Date) {
		let minutes = time.getHours().toString().padStart(2, '0');
		let seconds = time.getMinutes().toString().padStart(2, '0');
		return `${minutes}:${seconds}`;
	}

	$: duration = (finish.getTime() - start.getTime()) / 1000;

	let startClock = formatTs(start);
	$: rest = name === TIMER_TYPES.REST;

	function handleClick() {
		if (!topLog) {
			dispatch('click');
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="logline" class:topLog class:rest class:clickable={!topLog} on:click={handleClick}>
	<snap class="time work">{startClock}</snap>
	<snap>
		{#if rest}
			Rest for
		{:else}
			Active for
		{/if}
	</snap>
	<snap class="duration">{formatTimeLogLine(duration)}</snap>
	{#if topLog}
		<span class="active-badge">running</span>
	{/if}
</div>

<style>
	@import '../../styles/fonts.css';

	.logline {
		font-family: 'title_hero_regular';
		font-size: 1.2em;
		padding: 0px 8px;
		border-radius: 4px;
		transition: background-color 0.2s;
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 2px 0;
		width: fit-content;
	}

	.logline.topLog {
		opacity: 0.8;
		border-left: 3px solid var(--text-color);
		padding-left: 8px;
	}

	.logline.clickable {
		cursor: pointer;
	}

	.logline.clickable:hover {
		background-color: rgba(128, 128, 128, 0.1);
	}

	.time {
		font-family: 'title_hero_bold';
		font-size: 1em;
		color: var(--logline-time-color);
		display: inline-block;
		text-align: left;
		width: 45px;
		/* margin: 0.5em; */
	}
	.duration {
		font-family: 'title_hero_bold';
		font-size: 1em;
		/* margin: 0.5em; */
	}

	.rest {
		color: var(--rest-light1);
	}

	/* .rest.{
		font-weight: bold;
	} */

	.active-badge {
		font-family: 'title_roboto', sans-serif;
		font-size: 0.6em;
		background-color: var(--text-color);
		color: var(--logs-background-color);
		padding: 1px 4px;
		border-radius: 3px;
		vertical-align: middle;
		margin-left: 8px;
		text-transform: uppercase;
		font-weight: bold;
		opacity: 0.8;
	}

	@keyframes greenOne {
		from {
			color: black;
		}
		to {
			color: #183d3d;
		}
	}

	@keyframes blackOne {
		from {
			color: #83b37f;
		}
		to {
			color: black;
		}
	}
</style>
