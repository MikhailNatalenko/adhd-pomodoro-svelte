import { writable } from 'svelte/store';
import type { Timer } from '$lib/types';

/**
 * Store for the currently selected timer for editing
 */
export const selectedTimer = writable<Timer | null>(null);

/**
 * Open the timer editor with a specific timer
 */
export function selectTimer(timer: Timer | null) {
    selectedTimer.set(timer);
}

/**
 * Close the timer editor
 */
export function deselectTimer() {
    selectedTimer.set(null);
}
