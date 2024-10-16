<script lang="ts">
	import Logline from './Logline.svelte';
	import Cookies from 'js-cookie';
	import { onMount } from 'svelte';
	import type { Timer } from '$lib/types';
	import { formatTimeHHMMSS } from '$lib/utils';
	import { TimerList, parseTimerList } from '$lib/timerlog';

	////// props /////////////
	export let timerLogs: TimerList = new TimerList([]);

	var normalized: Timer[] = [];
	let mounted = false;
	let rawView = false;

	function updateLogs(logs: TimerList) {
		if (logs == undefined) return;
		if (!mounted) return;
		Cookies.set('logs', logs.serialize(), { expires: 31 });
	}

	function updateParam(param: boolean, name: string) {
		if (!mounted) return;
		Cookies.set(name, param ? 'true' : 'false', { expires: 31 });
		normalized = normalize(timerLogs);
	}

	function changeLineType(start: Date) {
		timerLogs = timerLogs.changeLineType(start);
	}

	function deleteLine(start: Date) {
		timerLogs.remove(start);
		timerLogs = timerLogs;
	}

	function normalize(timers: TimerList) {
		if (timers == undefined) return [];

		return timers.normalize(!rawView);
	}

	$: updateParam(rawView, 'raw_view');
	$: updateLogs(timerLogs);
	$: normalized = normalize(timerLogs);

	onMount(() => {
		let logs = Cookies.get('logs');
		console.log('cookies for logs contain', logs);
		rawView = Cookies.get('raw_view') === 'true';

		timerLogs = parseTimerList(logs == undefined ? '' : logs);
		mounted = true;
	});
</script>

<div>
	<button on:click={() => (timerLogs = new TimerList([]))} class="clear">Clear logs</button>
	<span>Active time: </span><span> {formatTimeHHMMSS(timerLogs.total())}</span>
	<input type="checkbox" id="edit" name="edit" bind:checked={rawView} />
	<label for="edit">Edit</label>

	<!-- <button on:click={() => (timerLogs = timerLogs.glueGaps())} class="save">Save gaps</button> -->
</div>

<div class="logs">
	{#if timerLogs.active}
		<Logline {...timerLogs.active} {rawView} toplog={true} /><br />
		<!-- on:change={(event)=>changeLineType(event.detail)}  -->
		<!-- on:remove={(event)=>deleteLine(event.detail)}/> -->
	{/if}

	{#each [...normalized].reverse() as log (log.start)}
		<Logline
			{...log}
			{rawView}
			toplog={false}
			on:change={(event) => changeLineType(event.detail)}
			on:remove={(event) => deleteLine(event.detail)}
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
