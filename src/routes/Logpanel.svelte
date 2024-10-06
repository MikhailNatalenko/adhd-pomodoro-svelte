<script lang="ts">
	import Logline from './Logline.svelte';
	import Cookies from 'js-cookie';
	import { onMount } from 'svelte';
	import type { Timer } from '$lib/types';
	import { formatTimeHHMMSS, normalizeTimers } from '$lib/utils';

	export let timerLogs: Timer[] = [];
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

	function testCrr(norm: Timer[]) {
		normalized = normalizeTimers(norm);
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
		Cookies.set('normalized logs', serializeLogs(logs), { expires: 31 });
	}

	$: updateLogs(timerLogs);
	$: testCrr(timerLogs);

	onMount(() => {
		let logs = Cookies.get('logs');
		console.log('cookies for logs contain', logs);
		mounted = true;
		if (logs == undefined) return;

		timerLogs = deserializeLogs(logs);
	});
</script>

<button on:click={() => (timerLogs = [])} class="clear">Clear logs</button>
<span>Active time: </span><span> {formatTimeHHMMSS(totalWorkTime(timerLogs))}</span><br />

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
