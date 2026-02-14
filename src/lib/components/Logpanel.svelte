<script lang="ts">
	import LogLine from '$lib/components/LogLine.svelte';
	import TimelineGraph from '$lib/components/TimelineGraph.svelte';
	import TimerEditor from '$lib/components/TimerEditor.svelte';
	import ToggleSwitch from '$lib/components/ToggleSwitch.svelte';
	import type { Timer } from '$lib/types';
	import { formatTimeHHMMSS } from '$lib/utils';
	import { pomApp, rawView, totalTime } from '$lib/stores/pomodoroStore';

	var normalized: Timer[] = [];
	let showGraph = true; // Default to graph view

	function normalize(app: typeof $pomApp, raw: boolean) {
		if (!app?.timerHistory) return [];
		return app.timerHistory.normalize(!raw);
	}

	$: normalized = normalize($pomApp, $rawView);
</script>

<TimerEditor />

<div class="header">
	<div class="header-left">
		<button on:click={() => pomApp.update((app) => app.clearLogs())} class="clear"> Clear logs </button>
		<span>Active time: </span><span> {formatTimeHHMMSS($totalTime)}</span>
		<input type="checkbox" id="edit" name="edit" bind:checked={$rawView} />
		<label for="edit">Edit</label>
	</div>

	<div class="header-right">
		<ToggleSwitch bind:checked={showGraph} leftLabel="Logs" rightLabel="Graph" />
	</div>
</div>

{#if showGraph}
	<TimelineGraph timers={normalized} activeTimer={$pomApp.active} />
{:else}
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
{/if}

<style>
	@import '../../styles/button.css';
	@import '../../styles/fonts.css';

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 5px;
		flex-wrap: wrap;
	}

	.header-right {
		margin-left: auto;
	}

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
