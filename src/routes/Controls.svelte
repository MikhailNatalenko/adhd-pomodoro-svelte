<script lang="ts">
	import TimerStarter from './TimerStarter.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let childComponents: TimerStarter[] = [];

	let timers = [5, 10, 15, 20, 25, 120];

	// @ts-ignore
	function handleTimerStart(event) {
		dispatch('start', { timer: event.detail.val, name: event.detail.name });
		console.log('handleTimerStart');
	}

	export let active = true;

	export function clear() {
		childComponents.forEach((element) => {
			if (element) element.reset();
		});
	}
</script>

<div>
	<div class="grid-container">
		<div class="item">
			<span class="label">Active</span><br />
			{#each timers as timer, i}
				<TimerStarter
					value={timer}
					name={'work'}
					on:start={handleTimerStart}
					bind:this={childComponents[i]}
				/>
				<br />
			{/each}
		</div>
		<slot class="item"></slot>
		<div class="item">
			<span class="label">Rest</span><br />
			{#each timers as timer, i}
				<TimerStarter
					value={timer}
					name={'rest'}
					on:start={handleTimerStart}
					bind:this={childComponents[i + childComponents.length]}
				/>
				<br />
			{/each}
		</div>
	</div>
</div>

<style>
	@import './../styles/fonts.css';
	.grid-container {
		display: grid;
		grid-template-columns: 1fr 3fr 1fr;
		column-gap: 50px;
		height: 35%;
	}

	.item {
		/* background-color: antiquewhite; */
		/* padding: 20px; */
		text-align: center;
	}
	.label {
		font-family: 'Roboto-Regular';
		padding: 10px;
		color: #554242;
	}
</style>
