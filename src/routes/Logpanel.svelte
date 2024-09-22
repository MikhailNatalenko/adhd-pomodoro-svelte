<script lang="ts">
	import type { TimerLog } from './types.ts';
	import Logline from './Logline.svelte';
	import Cookies from 'js-cookie';
	import { onMount } from 'svelte';

	export let timerLogs: TimerLog[] = [];

	type CachedLog = {
		id: number;
		name: string;
		start: number;
		finish: number;
	};

	let mounted = false;

	// Validate this value with a custom type guard (extend to your needs)
	function validateCachedLogs(arr: any): arr is CachedLog[] {
		arr.forEach((o: any) => {
			if (!('id' in o && 'name' in o && 'start' in o && 'finish' in o)) return false;
		});
		return true;
	}

	function serializeLogs(timerLogs: TimerLog[]) {
		let cached: CachedLog[] = [];
		timerLogs.forEach((element) => {
			cached.push({
				id: element.id,
				name: element.name,
				start: Math.floor(element.start.getTime() / 1000),
				finish: Math.floor(element.finish.getTime() / 1000)
			});
		});

		console.log('Serializing logs:', JSON.stringify(cached));
		return JSON.stringify(cached);
	}

	function deserializeLogs(str: string): TimerLog[] {
		const parsed = JSON.parse(str);
		let cached: TimerLog[] = [];
		if (validateCachedLogs(parsed)) {
			// do something with now correctly typed object
			parsed.forEach((element) => {
				cached.push({
					id: element.id,
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
	function updateLogs(logs: TimerLog[]) {
		if (timerLogs == undefined) return;
		if (!mounted) return;
		Cookies.set('logs', serializeLogs(logs));
	}

	$: updateLogs(timerLogs);

	onMount(() => {
		let logs = Cookies.get('logs');
		console.log('coockies for logs contain', logs);
		mounted = true;
		if (logs == undefined) return;

		timerLogs = deserializeLogs(logs);
	});
</script>

{#each timerLogs as log}
	<Logline {...log} />
{/each}
