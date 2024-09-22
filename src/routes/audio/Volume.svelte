<script lang="ts">
	import { setVolume } from './Ringer.svelte';
	import Cookies from 'js-cookie';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	let initialVolume: number;

	$: volume = initialVolume;
	$: volumeBar = volume;

	let mounted = false;

	$: if (mounted) {
		console.log('volume', volume);
		setVolume(volume / 100, true);

		Cookies.set('volume', volume.toString());
	}

	function handleMouseUp(event: any) {
		volume = event.target.value;
	}

	function mute() {
		volume = 0;
	}

	function volumemax() {
		volume = 100;
		volumeBar = 100;
	}

	onMount(() => {
		const vol = Cookies.get('volume');
		console.log('vol', vol);
		mounted = true;
		if (vol == undefined) {
			initialVolume = 10;
			return;
		}
		initialVolume = parseInt(vol);
	});
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
		<button on:click={volumemax}><img src="../volume_up.svg" alt="Volume max icon" /></button>
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
		width: 120px;
		height: 8px;
		border-radius: 4px;
		background: #d3d3d3;
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
