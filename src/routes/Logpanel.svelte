<script lang="ts">
	import Logline from './Logline.svelte';
	import Cookies from 'js-cookie';
	import { onMount } from 'svelte';
	import type { Timer, CachedLog } from '$lib/types';
	import { formatTimeHHMMSS } from '$lib/utils';
	import { TimerList } from '$lib/timerlog';
	import { fade } from 'svelte/transition';

	////// props /////////////
	export let timerLogs: TimerList = new TimerList('');

	var collapsed = true;
	var fill_gaps = true;
	var normalized: Timer[] = [];
	let mounted = false;

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
		timerLogs.changeLineType(start);
		timerLogs = timerLogs;
	}

	function deleteLine(start: Date) {
		timerLogs.remove(start);
		timerLogs = timerLogs;
	}

	function normalize(timers: TimerList) {
		if (timers == undefined) return [];

		return timers.normalize(collapsed, fill_gaps);
	}
	$: updateParam(collapsed, 'collapsed');
	$: updateParam(fill_gaps, 'fill_gaps');
	$: updateLogs(timerLogs);
	$: normalized = normalize(timerLogs);

	$: rawView = !(collapsed || fill_gaps);

	onMount(() => {
		let logs = Cookies.get('logs');
		console.log('cookies for logs contain', logs);
		collapsed = Cookies.get('collapsed') === 'true';
		fill_gaps = Cookies.get('fill_gaps') === 'true';

		timerLogs = new TimerList(logs == undefined ? '' : logs);
		mounted = true;
	});
</script>

<div>
	<button on:click={() => (timerLogs = new TimerList(''))} class="clear">Clear logs</button>
	<span>Active time: </span><span> {formatTimeHHMMSS(timerLogs.total())}</span>
	<input type="checkbox" id="collapse" name="collapse" bind:checked={collapsed} />
	<label for="collapse">Collapse</label>
	<input type="checkbox" id="fillRests" name="fill rests gaps" bind:checked={fill_gaps} /><label
		for="fillRests">Fill gaps</label
	>
	{#if fill_gaps}
		<button on:click={() => (timerLogs = timerLogs.glueGaps())} class="save">Save gaps</button>
	{/if}
</div>

<div class="logs">
	{#each [...normalized].reverse() as log (log.start)}
		<Logline {...log} />
		{#if rawView}
			<button
				transition:fade={{ duration: 100 }}
				class="mini"
				hidden={rawView}
				on:click={() => changeLineType(log.start)}>ch</button
			>
			<button
				transition:fade={{ duration: 100 }}
				class="mini cross"
				hidden={rawView}
				on:click={() => deleteLine(log.start)}>x</button
			>
		{/if}
		<br />
	{/each}
</div>

<style>
	@import './../styles/button.css';
	@import './../styles/fonts.css';
	.clear {
		margin: 10px;
		background-color: rgb(88, 18, 39);
	}
	span {
		font-family: 'title_roboto', sans-serif;
		font-size: 20px;
		color: #482a2a;
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
	label {
		font-family: 'title_roboto', sans-serif;
		font-size: 14px;
		color: #775252;
	}
	.logs {
		overflow-y: auto;
		background-color: #f4f8f6; /* Background color */
		border: 1px solid #f9f9f9; /* Border */
		padding: 10px; /* Padding */
		border-radius: 8px;
	}
</style>
