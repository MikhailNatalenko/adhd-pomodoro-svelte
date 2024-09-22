<script lang="ts" context="module">
	import { TimerState } from './types';
	import { base } from '$app/paths';
	let timerState = TimerState.STOPPED;

	const faviconStoped = base + '/tea.png';
	const faviconRunning = base + '/clock_red.png';
	const faviconWaitingForStop = base + '/clock_yellow.png';

	export function changeFavicon(icon: TimerState) {
		console.log('changeFavicon', icon);
		if (typeof document === 'undefined' || document === null) return;

		const faviconElement = document.getElementById('favicon') as HTMLLinkElement;
		if (faviconElement !== null) {
			switch (icon) {
				case TimerState.STOPPED:
					faviconElement.href = faviconStoped;
					break;
				case TimerState.RUNNING:
					faviconElement.href = faviconRunning;
					break;
				case TimerState.WAITING_FOR_STOP:
					faviconElement.href = faviconWaitingForStop;
					break;
				default:
					faviconElement.href = faviconStoped;
			}
		}
	}
</script>
