<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let value: number;
	export let name: string;
	export let disabled = false;
	export let pressed = false;

	function startWork(name: string, value: number) {
		dispatch('start', {
			name: name,
			val: value
		});
		pressed = true;
	}

	function checkDisabled(val: boolean) {
		if (!val) {
			pressed = false;
		}
	}

	$: checkDisabled(disabled);
</script>

<button
	class={name}
	on:click={function () {
		startWork(name, value);
	}}
	class:pressed
	{disabled}>{value} min</button
>

<!-- <button on:click={function(){startWork("work")}} >Работа</button>
<input type="number" min="1" max="9999" value={value} disabled={disabled}/>
<button on:click={function(){startWork("rest")}} disabled={disabled}>Отдых</button> -->

<style>
	@import './../styles/button.css';
	.active {
		background-color: rgb(31, 30, 30);
	}

	.rest {
		background-color: #467057;
	}

	button:disabled.pressed {
		background-color: burlywood;
	}
</style>
