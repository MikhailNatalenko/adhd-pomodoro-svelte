<script lang="ts">
	import Logline from './Logline.svelte';
	import Cookies from 'js-cookie';
	import { onMount } from 'svelte';
	import type { Timer } from '$lib/types';
	import { formatTimeHHMMSS, fillGaps, collapseTimers } from '$lib/utils';

	////// props /////////////
	export let timerLogs: Timer[] = [];

	var collapsed = true;
	var fill_gaps = true;
	var normalized: Timer[] = [];

	type CachedLog = {
		name: string;
		start: number;
		finish: number;
	};

	let mounted = false;

	function totalWorkTime(timers: Timer[]) {
		let duration = 0;
		timers.forEach((element) => {
			if (element.name == 'work') {
				duration += (element.finish.getTime() - element.start.getTime()) / 1000;
			}
		});
		return duration;
	}
	// Validate this value with a custom type guard (extend to your needs)
	function validateCachedLogs(arr: any): arr is CachedLog[] {
		arr.forEach((o: any) => {
			if (!('name' in o && 'start' in o && 'finish' in o)) return false;
		});
		return true;
	}

	function serializeLogs(timerLogs: Timer[]) {
		let cached: CachedLog[] = [];
		timerLogs.forEach((element) => {
			cached.push({
				name: element.name,
				start: Math.floor(element.start.getTime() / 1000),
				finish: Math.floor(element.finish.getTime() / 1000)
			});
		});

		console.log('Serializing logs:', JSON.stringify(cached));
		return JSON.stringify(cached);
	}

	function normalizeTimers(norm: Timer[], collapse: boolean, fill: boolean) {
		let timers = norm;
		if (fill) timers = fillGaps(timers, 'rest');
		if (collapse) timers = collapseTimers(timers);

		normalized = timers;
		console.log(normalized);
	}

	function deserializeLogs(str: string): Timer[] {
		const parsed = JSON.parse(str);
		let cached: Timer[] = [];
		if (validateCachedLogs(parsed)) {
			// do something with now correctly typed object
			parsed.forEach((element) => {
				cached.push({
					value: 0,
					name: element.name,
					finish: new Date(element.finish * 1000),
					start: new Date(element.start * 1000)
				});
			});
			console.log('deserialized logs:', cached);
			return cached;
		} else {
			return [];
		}
	}
	function updateLogs(logs: Timer[]) {
		if (logs == undefined) return;
		if (!mounted) return;
		Cookies.set('logs', serializeLogs(logs), { expires: 31 });
	}

	function updateParam(param: boolean, name: string) {
		if (!mounted) return;
		Cookies.set(name, param ? 'true' : 'false', { expires: 31 });
	}

	$: updateParam(collapsed, 'collapsed');
	$: updateParam(fill_gaps, 'fill_gaps');
	$: updateLogs(timerLogs);
	$: normalizeTimers(timerLogs, collapsed, fill_gaps);

	onMount(() => {
		let logs = Cookies.get('logs');
		console.log('cookies for logs contain', logs);
		if (logs == undefined) return;

		collapsed = Cookies.get('collapsed') === 'true';
		fill_gaps = Cookies.get('fill_gaps') === 'true';

		timerLogs = deserializeLogs(logs);
		mounted = true;
	});
</script>

<button on:click={() => (timerLogs = [])} class="clear">Clear logs</button>
<span>Active time: </span><span> {formatTimeHHMMSS(totalWorkTime(timerLogs))}</span>
<input type="checkbox" id="collapse" name="collapse" bind:checked={collapsed} />
<label for="collapse">Collapse</label>
<input type="checkbox" id="fillRests" name="fill rests gaps" bind:checked={fill_gaps} /><label
	for="fillRests">Fill gaps</label
>
<br />

<div class="logs">
	{#each normalized as log (log.start)}
		<Logline {...log} />
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

	label {
		font-family: 'title_roboto', sans-serif;
		font-size: 14px;
		color: #775252;
	}
	.logs {
		max-height: calc(1.2em * 23); /* Height for 20 lines */
		min-height: calc(1.2em * 23); /* Height for 20 lines */
		overflow-y: auto; /* Enable vertical scrolling if content exceeds max height */
		background-color: #fbfffd; /* Background color */
		border: 1px solid #f9f9f9; /* Border */
		padding: 10px; /* Padding */
		border-radius: 8px;
	}
</style>
