<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { playAlertSound } from '$lib/components/audio/Ringer.svelte';
	import { getParam } from '$lib/constants';

	const dispatch = createEventDispatcher();

	export let debugFlag: boolean;

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

		intervalId = setInterval(
			() => {
				playAlertSound();
				//just in case. sometimes it does not stop.
				if (!active) {
					clearInterval(intervalId);
				}
			},
			getParam(debugFlag).afterClockIntervalS * 1000
		);

		timeoutId = setTimeout(
			() => {
				active = false;
				clearInterval(intervalId);
				off();
			},
			getParam(debugFlag).afterClockTimeoutS * 1000
		);
	}

	function off() {
		dispatch('off');
	}
</script>
