<script lang="ts">
	import { formatTimeLogLine } from '$lib/utils';
	import { TIMER_TYPES } from '$lib/constants';

	export let start: Date;
	export let finish: Date;
	export let name: string;
	export let topLog: boolean = false;

	function formatTs(time: Date) {
		let minutes = time.getHours().toString().padStart(2, '0');
		let seconds = time.getMinutes().toString().padStart(2, '0');
		return `${minutes}:${seconds}`;
	}

	$: duration = (finish.getTime() - start.getTime()) / 1000;

	let startClock = formatTs(start);
	$: rest = name === TIMER_TYPES.REST;
</script>

<snap class:topLog class="logline" class:rest>
	<snap class="time work">{startClock}</snap>
	<snap>
		{#if rest}
			Rest for
		{:else}
			Active for
		{/if}
	</snap>
	<snap class="duration">{formatTimeLogLine(duration)}</snap>
</snap>

<style>
	@import '../../styles/fonts.css';

	.logline {
		font-family: 'title_hero_regular';
		font-size: 1.2em;
		margin: 0.5em;
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

	.mini {
		border: none;
		color: rgb(220, 220, 220);
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 12px;
		margin: 0px;
		cursor: pointer;
		font-family: 'Roboto-Regular';
		height: 15px;
		width: 50px;
		border-radius: 5px;
		background-color: rgb(19, 88, 108);
	}

	.cross {
		width: 15px;
		background-color: rgb(158, 44, 44);
	}

	.mini:hover {
		background-color: rgb(58, 140, 163);
	}
</style>
