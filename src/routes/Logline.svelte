<script lang="ts">
	export let start: Date;
	export let finish: Date;
	export let name: string;

	let duration = (finish.getTime() - start.getTime()) / 1000;

	function formatTime(time: number) {
		let minutes = Math.floor(time / 60);
		let seconds = Math.floor(time % 60)
			.toString()
			.padStart(2, '0');
		return `${minutes} min ${seconds} sec`;
	}

	function formatTs(time: Date) {
		let minutes = time.getHours().toString().padStart(2, '0');
		let seconds = time.getMinutes().toString().padStart(2, '0');
		return `${minutes}:${seconds}`;
	}

	// let logText = `Timer ${formatTime(timer)} started at  and finished at {finish}`
</script>

{#if name == 'work'}
	<snap class="logline">
		<snap class="time work">{formatTs(start)}</snap>
		<snap>Active for</snap>
		<snap class="duration">{formatTime(duration)}</snap>
	</snap><br />
{:else}
	<snap class="logline">
		<snap class="time rest">{formatTs(start)}</snap>
		<snap> Rest for</snap>
		<snap class="duration">{formatTime(duration)}</snap>
	</snap><br />
{/if}

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
		color: #355732;
		/* margin: 0.5em; */
	}
	.duration {
		font-family: 'title_hero_bold';
		font-size: 1em;
		/* margin: 0.5em; */
	}
</style>
