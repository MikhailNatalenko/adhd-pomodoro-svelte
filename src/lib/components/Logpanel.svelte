<script lang="ts">
	import LogLine from '$lib/components/LogLine.svelte';
	import TimelineGraph from '$lib/components/TimelineGraph.svelte';
	import type { Timer } from '$lib/types';
	import { formatTimeHHMMSS } from '$lib/utils';
	import { pomApp, rawView, totalTime } from '$lib/stores/pomodoroStore';

	var normalized: Timer[] = [];

	function normalize(app: typeof $pomApp, raw: boolean) {
		if (!app?.timerHistory) return [];
		return app.timerHistory.normalize(!raw);
	}

	$: normalized = normalize($pomApp, $rawView);
</script>

<div>
	<button on:click={() => pomApp.update((app) => app.clearLogs())} class="clear"> Clear logs </button>
	<span>Active time: </span><span> {formatTimeHHMMSS($totalTime)}</span>
	<input type="checkbox" id="edit" name="edit" bind:checked={$rawView} />
	<label for="edit">Edit</label>
	<button
		on:click={() =>
			pomApp.update((app) => {
				app.timerHistory.addDurSec(5 * 60);
				return app;
			})}
	>
		+5 min
	</button>
	<button
		on:click={() =>
			pomApp.update((app) => {
				app.timerHistory.addDurSec(-5 * 60);
				return app;
			})}
	>
		-5 min
	</button>
</div>

<TimelineGraph timers={normalized} activeTimer={$pomApp.active} />

<div class="logs">
	{#if $pomApp.active}
		<LogLine {...$pomApp.active} rawView={$rawView} topLog={true} /><br />
		<!-- on:change={(event)=>changeLineType(event.detail)}  -->
		<!-- on:remove={(event)=>deleteLine(event.detail)}/> -->
	{/if}

	{#each [...normalized].reverse() as log (log.start)}
		<LogLine
			{...log}
			rawView={$rawView}
			topLog={false}
			on:change={(event) => pomApp.update((app) => app.changeLineType(event.detail))}
			on:remove={(event) => pomApp.update((app) => app.remove(event.detail))}
		/>
		<br />
	{/each}
</div>

<style>
	@import '../../styles/button.css';
	@import '../../styles/fonts.css';
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
