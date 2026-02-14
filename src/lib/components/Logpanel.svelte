<script lang="ts">
	import LogLine from '$lib/components/LogLine.svelte';
	import TimelineGraph from '$lib/components/TimelineGraph.svelte';
	import TimerEditor from '$lib/components/TimerEditor.svelte';
	import ToggleSwitch from '$lib/components/ToggleSwitch.svelte';
	import type { Timer } from '$lib/types';
	import { formatTimeHHMMSS } from '$lib/utils';
	import { pomApp, totalTime } from '$lib/stores/pomodoroStore';

	var normalized: Timer[] = [];
	let showGraph = true; // Default to graph view

	// List is already normalized in addTimer, so just use it directly
	$: normalized = $pomApp?.timerHistory?.list || [];
</script>

<TimerEditor />

<div class="header">
	<button on:click={() => pomApp.update((app) => app.clearLogs())} class="clear"> Clear logs </button>
	<span>Active time: </span><span> {formatTimeHHMMSS($totalTime)}</span>
</div>

<div class="content-section">
	<div class="tabs-header">
		<ToggleSwitch bind:checked={showGraph} leftLabel="Logs" rightLabel="Graph" />
	</div>

	<div class="content-wrapper">
		{#if showGraph}
			<TimelineGraph timers={normalized} activeTimer={$pomApp.active} />
		{:else}
			<div class="logs">
				{#if $pomApp.active}
					<LogLine {...$pomApp.active} topLog={true} /><br />
				{/if}

				{#each [...normalized].reverse() as log (log.start)}
					<LogLine {...log} topLog={false} on:remove={(event) => pomApp.update((app) => app.remove(event.detail))} />
					<br />
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	@import '../../styles/button.css';
	@import '../../styles/fonts.css';

	.header {
		display: flex;
		align-items: center;
		gap: 5px;
		flex-wrap: wrap;
		margin-bottom: 5px;
	}

	.content-section {
		position: relative;
		padding-top: 0px; /* Space for tabs */
	}

	.tabs-header {
		position: absolute;
		top: -35px;
		right: 0;
		z-index: 1;
	}

	.content-wrapper {
		min-height: 400px;
		transition: min-height 0.3s ease;
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
		margin: 10px 0;
		overflow-y: auto;
		background-color: var(--logs-background-color);
		border: 1px solid var(--logs-border-color);
		padding: 10px; /* Padding */
		border-radius: 8px;
	}
</style>
