<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { playAlertSound } from './audio/Ringer.svelte';

	const dispatch = createEventDispatcher();

	export let intervalS: number = 0;
	export let timeoutS: number = 0;

	export let active: boolean = true;

	$: runTimer(active);

	let intervalId = 0;
	let timeoutId = 0;

	function runTimer(act: boolean) {
		console.log('run annoyer', act);

		clearInterval(intervalId);
		clearTimeout(timeoutId);

		if (!act) {
			return;
		}

		intervalId = setInterval(() => {
			playAlertSound();
			//just in case. sometimes it does not stop.
			if (!active) {
				clearInterval(intervalId);
			}
		}, intervalS * 1000);

		timeoutId = setTimeout(() => {
			active = false;
			clearInterval(intervalId)
			off();
		}, timeoutS * 1000);
	}

	function off() {
		dispatch('off');
	}
</script>
