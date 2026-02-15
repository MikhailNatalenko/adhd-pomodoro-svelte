import { writable, derived, type Writable } from 'svelte/store';
import { browser } from '$app/environment';
import Cookies from 'js-cookie';
import { PomApp } from '$lib/pom_app';
import { parseTimerList } from '$lib/timerlog';
import { Timer } from '$lib/types';
import { persistentStore } from './persistentStore';

/**
 * Custom persistent store for PomApp with special serialization
 */
function createPomAppStore(): Writable<PomApp> {
	// Load initial value from cookies
	let initialApp = new PomApp();
	if (browser) {
		const logs = Cookies.get('logs');
		console.log('Loading pomApp from cookies:', logs);
		if (logs) {
			initialApp.timerHistory = parseTimerList(logs);
		}

		// Load active timer if exists
		const activeTimer = Cookies.get('activeTimer');
		if (activeTimer) {
			try {
				const parsed = JSON.parse(activeTimer);
				const startTime = new Date(parsed.start);
				const now = new Date();

				// Only restore if timer was started recently (within last hour)
				// This prevents restoring very old timers
				const hoursSinceStart = (now.getTime() - startTime.getTime()) / (1000 * 60 * 60);
				if (hoursSinceStart < 1) {
					initialApp.active = new Timer(
						parsed.value,
						parsed.name,
						startTime,
						now // Set finish to current time for active timer
					);
					console.log('Loaded active timer from cookies:', initialApp.active);
				} else {
					console.log('Active timer too old, not restoring');
					Cookies.remove('activeTimer');
				}
			} catch (e) {
				console.error('Failed to parse active timer:', e);
			}
		}
	}

	const store = writable<PomApp>(initialApp);

	// Subscribe to changes and save to cookies
	if (browser) {
		store.subscribe((app) => {
			const serialized = app.timerHistory.serialize();
			Cookies.set('logs', serialized, { expires: 31 });

			// Save active timer
			if (app.active) {
				const activeData = {
					name: app.active.name,
					start: app.active.start.getTime(),
					finish: app.active.finish.getTime(),
					value: app.active.value
				};
				Cookies.set('activeTimer', JSON.stringify(activeData), { expires: 31 });
			} else {
				Cookies.remove('activeTimer');
			}
		});
	}

	return store;
}

/**
 * Main application state store
 */
export const pomApp = createPomAppStore();

/**
 * Dark mode preference
 */
function getInitialDarkMode(): boolean {
	if (browser) {
		const stored = Cookies.get('darkmode');
		if (stored !== undefined) {
			return stored === 'true';
		}
		// If no cookie, use OS preference
		return window.matchMedia('(prefers-color-scheme: dark)').matches;
	}
	return false;
}

export const darkMode = persistentStore<boolean>('darkmode', getInitialDarkMode(), {
	storage: 'cookies',
	serialize: (value) => value.toString(),
	deserialize: (value) => value === 'true'
});


/**
 * Derived store for total active time
 */
export const totalTime = derived(pomApp, ($pomApp) => $pomApp.totalTime());

/**
 * Volume setting (0-100)
 */
export const volume = persistentStore<number>('volume', 10, {
	storage: 'cookies',
	serialize: (value) => value.toString(),
	deserialize: (value) => parseInt(value, 10)
});
