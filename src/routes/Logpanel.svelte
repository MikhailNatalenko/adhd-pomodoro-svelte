<script lang="ts">
	import Logline from './Logline.svelte';
	import Cookies from 'js-cookie';
	import { onMount } from 'svelte';
	import type { Timer } from '$lib/types';
	import { formatTimeHHMMSS } from '$lib/utils';
	import { TimerList, parseTimerList } from '$lib/timerlog';
	import { PomApp } from '$lib/pom_app';

	////// props /////////////
	export let pomApp: PomApp;
	let timerLogs = new TimerList([]);

	var normalized: Timer[] = [];
	let mounted = false;
	let rawView = false;

	function updateParam(param: boolean, name: string) {
		if (!mounted) return;
		Cookies.set(name, param ? 'true' : 'false', { expires: 31 });
		normalized = normalize(timerLogs);
	}

	function normalize(timers: TimerList) {
		if (timers == undefined) return [];

		return timers.normalize(!rawView);
	}

	$: updateParam(rawView, 'raw_view');
	$: timerLogs = pomApp?.timerHistory;
	$: normalized = normalize(timerLogs);

	onMount(() => {
		rawView = Cookies.get('raw_view') === 'true';
		mounted = true;
	});
</script>

<div>
	<button on:click={() => (pomApp = pomApp.clearLogs())} class="clear">Clear logs</button>
	<span>Active time: </span><span> {formatTimeHHMMSS(pomApp.totalTime())}</span>
	<input type="checkbox" id="edit" name="edit" bind:checked={rawView} />
	<label for="edit">Edit</label>
	<button on:click={() => (timerLogs = timerLogs.addDursec(5 * 60))}> +5 min </button>
	<button on:click={() => (timerLogs = timerLogs.addDursec(-5 * 60))}> -5 min </button>
	<!-- <button on:click={() => (timerLogs = timerLogs.glueGaps())} class="save">Save gaps</button> -->
</div>

<div class="logs">
	{#if pomApp.active}
		<Logline {...pomApp.active} {rawView} toplog={true} /><br />
		<!-- on:change={(event)=>changeLineType(event.detail)}  -->
		<!-- on:remove={(event)=>deleteLine(event.detail)}/> -->
	{/if}

	{#each [...normalized].reverse() as log (log.start)}
		<Logline
			{...log}
			{rawView}
			toplog={false}
			on:change={(event) => (pomApp = pomApp.changeLineType(event.detail))}
			on:remove={(event) => (pomApp = pomApp.remove(event.detail))}
		/>
		<br />
	{/each}
</div>

<style>
	@import './../styles/button.css';
	@import './../styles/fonts.css';
	.clear {
		margin: 10px;
		/* background-color: rgb(88, 18, 39); */
		background-color: var(--delete-background-color);
	}
	span {
		font-family: 'title_roboto', sans-serif;
		font-size: 20px;
		/* color: #482a2a; */
	}
	label {
		font-family: 'title_roboto', sans-serif;
		font-size: 14px;
		/* color: #775252; */
	}
	.logs {
		overflow-y: auto;
		background-color: var(--logs-background-color);
		border: 1px solid var(--logs-border-color);
		padding: 10px; /* Padding */
		border-radius: 8px;
	}
</style>
