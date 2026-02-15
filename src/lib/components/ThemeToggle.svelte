<script lang="ts">
	import { darkMode } from '$lib/stores/pomodoroStore';
	import { fly } from 'svelte/transition';
	import Sun from '$lib/icons/Sun.svelte';
	import Moon from '$lib/icons/Moon.svelte';

	function toggle() {
		darkMode.update((d) => !d);
	}
</script>

<button
	class="theme-toggle"
	on:click={toggle}
	aria-label="Toggle dark mode"
	title={$darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
>
	<div class="icon-container">
		{#if $darkMode}
			<div in:fly={{ y: 20, duration: 400 }} out:fly={{ y: -20, duration: 400 }} class="icon moon">
				<Moon />
			</div>
		{:else}
			<div in:fly={{ y: 20, duration: 400 }} out:fly={{ y: -20, duration: 400 }} class="icon sun">
				<Sun />
			</div>
		{/if}
	</div>
</button>

<style>
	.theme-toggle {
		background: none;
		border: 1px solid var(--logs-border-color);
		border-radius: 50%;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: var(--text-color);
		transition: all 0.3s ease;
		background-color: var(--logs-background-color);
		overflow: hidden;
		position: relative;
		padding: 0;
	}

	.theme-toggle:hover {
		transform: scale(1.1);
		border-color: var(--text-color);
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}

	.icon-container {
		position: relative;
		width: 24px;
		height: 24px;
	}

	.icon {
		position: absolute;
		top: 0;
		left: 0;
		width: 24px;
		height: 24px;
	}

	.moon {
		color: #93bfd1;
	}

	.sun {
		color: #e8be7b;
	}

	:global(.dark) .theme-toggle {
		box-shadow: 0 0 15px rgba(241, 196, 15, 0.2);
	}
</style>
