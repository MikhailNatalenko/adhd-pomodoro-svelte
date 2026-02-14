import { writable, derived, type Writable } from 'svelte/store';
import { browser } from '$app/environment';
import Cookies from 'js-cookie';
import { PomApp } from '$lib/pom_app';
import { parseTimerList } from '$lib/timerlog';
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
	}

	const store = writable<PomApp>(initialApp);

	// Subscribe to changes and save to cookies
	if (browser) {
		store.subscribe((app) => {
			const serialized = app.timerHistory.serialize();
			Cookies.set('logs', serialized, { expires: 31 });
			console.log('Saved pomApp to cookies');
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
export const darkMode = persistentStore<boolean>('darkmode', false, {
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
