<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let value: number;
	export let name: string;
	export let pressed = false;

	function startWork(name: string, value: number) {
		dispatch('start', {
			name: name,
			val: value
		});
		pressed = true;
	}

	export function reset() {
		pressed = false;
	}
</script>

<button
	class={name}
	on:click={function () {
		startWork(name, value);
	}}
	class:pressed>{value} min</button
>

<style>
	@import '../../styles/button.css';
	.active {
		background-color: var(--work-buttons);
	}

	.rest {
		/* background-color: #467057; */
		background-color: var(--rest-buttons);
	}

	@keyframes example {
		from {
			background-color: var(--hover-button-bg-color);
		}
		to {
			background-color: var(--chosen-bg-color);
		}
	}

	.pressed {
		background-color: var(--chosen-bg-color);
		animation-name: example;
		animation-duration: 0.4s;
	}
</style>
