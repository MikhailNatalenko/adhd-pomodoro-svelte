<script lang="ts">
	import { formatTimeLogline } from './utils';

	export let start: Date;
	export let finish: Date;
	export let name: string;

	function formatTs(time: Date) {
		let minutes = time.getHours().toString().padStart(2, '0');
		let seconds = time.getMinutes().toString().padStart(2, '0');
		return `${minutes}:${seconds}`;
	}

	let duration = (finish.getTime() - start.getTime()) / 1000;
	let startClock = formatTs(start);
	let rest = name === 'rest';
	$: console.log('logline', start, finish, name, duration, startClock, rest);
</script>

<snap class="logline" class:rest>
	<snap class="time work">{startClock}</snap>
	<snap>
		{#if rest}
			Rest for
		{:else}
			Active for
		{/if}
	</snap>
	<snap class="duration">{formatTimeLogline(duration)}</snap>
</snap><br />

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
</style>
