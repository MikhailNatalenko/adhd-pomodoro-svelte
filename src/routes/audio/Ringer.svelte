<script context="module">
	// @ts-nocheck

	//TODO: configurable story is better
	// Loading the sound file
	import { base } from '$app/paths';
	const pathToSound = base + '/ring2.wav';

	let innerPlayer = function () {};

	/**
	 * @type {{ decodeAudioData: (arg0: ArrayBuffer) => any; createBufferSource: () => any; createGain: () => any; destination: any; }}
	 */
	let audioContext;

	// /**
	//  * @type {AudioBuffer | null}
	//  */
	let alertSoundBuffer;

	let volume = 0.5; // Initial volume level

	let source;

	if (typeof window !== 'undefined') {
		let AudioContext = window.AudioContext || window.webkitAudioContext;
		audioContext = new AudioContext();
		fetch(pathToSound)
			.then((response) => response.arrayBuffer())
			.then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
			.then((audioBuffer) => {
				alertSoundBuffer = audioBuffer;
			})
			.catch((error) => console.error('Error loading sound file:', error));

		innerPlayer = function () {
			if (!alertSoundBuffer) return;

			source = audioContext.createBufferSource();
			source.buffer = alertSoundBuffer;

			// Apply volume level
			let gainNode = audioContext.createGain();
			gainNode.gain.value = volume;
			source.connect(gainNode);
			gainNode.connect(audioContext.destination);

			source.start(0);
		};
	}

	// Function to save volume level to cookie
	/**
	 * @param {number} volume
	 */
	function saveVolumeToCookie(volume) {
		document.cookie = `volume=${volume};expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/`;
	}

	// Function to play the alert sound
	export function playAlertSound() {
		innerPlayer();
	}

	/**
	 * @param {number} value
	 * @param {any} doSoundCheck
	 */
	export function setVolume(value, doSoundCheck) {
		volume = value;
		// Play sound for volume check
		if (doSoundCheck) {
			playAlertSound();
		}

		// Save volume level to cookie
		// saveVolumeToCookie(value);
	}
</script>
