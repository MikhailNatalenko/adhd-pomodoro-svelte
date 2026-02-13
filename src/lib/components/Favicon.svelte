<script lang="ts" context="module">
	import type { TimerStateType } from '$lib/types';
	import { TimerState } from '$lib/types';
	import { base } from '$app/paths';

	const faviconStopped = base + '/tea.png';
	const faviconRunning = base + '/clock_red.png';
	const faviconWaitingForStop = base + '/clock_yellow.png';

	export function changeFavicon(icon: TimerStateType) {
		console.log('changeFavicon', icon);
		if (typeof document === 'undefined' || document === null) return;

		const faviconElement = document.getElementById('favicon') as HTMLLinkElement;
		if (faviconElement !== null) {
			switch (icon) {
				case TimerState.STOPPED:
					faviconElement.href = faviconStopped;
					break;
				case TimerState.RUNNING:
					faviconElement.href = faviconRunning;
					break;
				case TimerState.WAITING_FOR_STOP:
					faviconElement.href = faviconWaitingForStop;
					break;
				default:
					faviconElement.href = faviconStopped;
			}
		}
	}
</script>
