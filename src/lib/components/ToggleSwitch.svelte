<script lang="ts">
	export let checked: boolean = false;
	export let leftLabel: string = '';
	export let rightLabel: string = '';
</script>

<div class="tabs-container">
	<button class="tab {!checked ? 'active' : ''}" on:click={() => (checked = false)}>
		{leftLabel}
	</button>
	<button class="tab {checked ? 'active' : ''}" on:click={() => (checked = true)}>
		{rightLabel}
	</button>
</div>

<style>
	@import '../../styles/fonts.css';

	.tabs-container {
		display: inline-flex;
		gap: 0;
		border-radius: 6px;
		overflow: hidden;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.tab {
		font-family: 'title_roboto', sans-serif;
		font-size: 14px;
		padding: 8px 20px;
		border: none;
		background-color: var(--logs-background-color, #f5f5f5);
		color: var(--logs-text-color, #666);
		cursor: pointer;
		transition:
			background-color 0.3s,
			color 0.3s,
			font-weight 0.3s;
		user-select: none;
		font-weight: 500;
		border-right: 1px solid rgba(0, 0, 0, 0.1);
	}

	.tab:last-child {
		border-right: none;
	}

	.tab:hover:not(.active) {
		background-color: rgba(76, 175, 80, 0.1);
		color: var(--work-buttons, #4caf50);
	}

	.tab.active {
		background-color: var(--work-buttons, #4caf50);
		color: white;
		font-weight: 600;
		box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
	}
</style>
