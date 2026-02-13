<script lang="ts">
	import { setVolume } from '$lib/components/audio/Ringer.svelte';
	import { volume } from '$lib/stores/pomodoroStore';
	import { base } from '$app/paths';

	let volumeBar = $volume;

	// Update audio volume when store changes
	$: {
		console.log('volume', $volume);
		setVolume($volume / 100, true);
		volumeBar = $volume;
	}

	function handleMouseUp(event: any) {
		$volume = parseInt(event.target.value, 10);
	}

	function mute() {
		$volume = 0;
	}

	function volumemax() {
		$volume = 100;
	}
</script>

<label>
	<div class="container">
		<button on:click={mute} class="leftbutton"
			><img src="{base}/volume_mute.svg" alt="Mute icon" />
		</button>
		<input
			class="slider bar"
			type="range"
			bind:value={volumeBar}
			min="0"
			max="100"
			on:mouseup={handleMouseUp}
		/>
		<button on:click={volumemax}><img src="{base}/volume_up.svg" alt="Volume max icon" /></button>
	</div>
</label>

<style>
	/* .bar {
        width: 115px;
        padding: 4px;

    } */

	button {
		border: none;
		background: none;
		cursor: pointer;
	}

	.slider {
		-webkit-appearance: none;
		appearance: none;
		width: 120px;
		height: 8px;
		border-radius: 4px;
		background: var(--slider-color);
		outline: none;
		opacity: 0.7;
		-webkit-transition: 0.2s;
		transition: opacity 0.2s;
		margin-bottom: 5px;
		opacity: 0.4;
	}

	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 15px;
		height: 25px;
		border-radius: 8px;
		background: #467057;
		cursor: pointer;
	}

	.slider::-moz-range-thumb {
		width: 15px;
		height: 15px;
		border-radius: 50%;
		background: #467057;
		cursor: pointer;
	}
	.container {
		display: flex;
		justify-content: center; /* Выровнять элементы по центру */
		align-items: center; /* Выровнять элементы по вертикали */
	}
	.leftbutton {
		margin-right: -3px;
	}

	button {
		opacity: 0.4;
	}
</style>
