<script lang="ts">
	export let checked: boolean = false;
	export let leftLabel: string = '';
	export let rightLabel: string = '';
</script>

<div class="toggle-container">
	<span class="toggle-label {!checked ? 'active' : ''}">{leftLabel}</span>
	<label class="toggle-switch">
		<input type="checkbox" bind:checked />
		<span class="slider"></span>
	</label>
	<span class="toggle-label {checked ? 'active' : ''}">{rightLabel}</span>
</div>

<style>
	@import '../../styles/fonts.css';

	.toggle-container {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		margin-left: 15px;
		vertical-align: middle;
	}

	.toggle-label {
		font-family: 'title_roboto', sans-serif;
		font-size: 14px;
		opacity: 0.5;
		transition:
			opacity 0.3s,
			font-weight 0.3s;
		min-width: 45px;
		text-align: center;
	}

	.toggle-label.active {
		opacity: 1;
		font-weight: 600;
	}

	.toggle-switch {
		position: relative;
		display: inline-block;
		width: 50px;
		height: 24px;
		cursor: pointer;
	}

	.toggle-switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.slider {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: var(--work-buttons);
		opacity: 0.6;
		border-radius: 24px;
		transition: 0.3s;
	}

	.slider:before {
		position: absolute;
		content: '';
		height: 18px;
		width: 18px;
		left: 3px;
		bottom: 3px;
		background-color: white;
		border-radius: 50%;
		transition: 0.3s;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.toggle-switch input:checked + .slider {
		background-color: var(--work-buttons);
		opacity: 1;
	}

	.toggle-switch input:checked + .slider:before {
		transform: translateX(26px);
	}

	.toggle-switch:hover .slider {
		opacity: 0.85;
	}
</style>
