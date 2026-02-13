import { writable, derived } from 'svelte/store';
import { TimerState, Timer, type TimerStateType } from '$lib/types';
import { getParam } from '$lib/constants';

interface TimerData {
	state: TimerStateType;
	currentTimer: Timer;
	clockDuration: number; // in seconds for Clock component
}

function createTimerStore() {
	const { subscribe, set, update } = writable<TimerData>({
		state: TimerState.STOPPED,
		currentTimer: new Timer(),
		clockDuration: 0
	});

	return {
		subscribe,

		/**
		 * Start new timer
		 */
		start: (minutes: number, name: string, debugFlag: boolean) => {
			const multiplier = getParam(debugFlag).timersMultiplier;
			update((data) => ({
				state: TimerState.RUNNING,
				currentTimer: new Timer(minutes, name),
				clockDuration: minutes * multiplier
			}));
		},

		/**
		 * Handle alarm signal
		 */
		alarm: (isPageVisible: boolean) => {
			update((data) => {
				if (isPageVisible) {
					// If page is visible, stop immediately
					return {
						...data,
						state: TimerState.STOPPED,
						clockDuration: 0,
						currentTimer: { ...data.currentTimer, finish: new Date() }
					};
				} else {
					// Otherwise wait for user to return
					return {
						...data,
						state: TimerState.WAITING_FOR_STOP
					};
				}
			});
		},

		/**
		 * Stop timer with completion
		 */
		stop: () => {
			update((data) => ({
				...data,
				state: TimerState.STOPPED,
				clockDuration: 0,
				currentTimer: { ...data.currentTimer, finish: new Date() }
			}));
		},

		/**
		 * Reset timer without saving
		 */
		reset: () => {
			set({
				state: TimerState.STOPPED,
				currentTimer: new Timer(),
				clockDuration: 0
			});
		}
	};
}

export const timer = createTimerStore();

// Derived stores for convenient access to individual fields
export const timerState = derived(timer, ($timer) => $timer.state);
export const currentTimer = derived(timer, ($timer) => $timer.currentTimer);
export const clockDuration = derived(timer, ($timer) => $timer.clockDuration);
