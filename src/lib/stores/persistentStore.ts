import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';
import Cookies from 'js-cookie';

export interface PersistentStoreOptions {
	storage: 'localStorage' | 'cookies';
	serialize?: (value: any) => string;
	deserialize?: (value: string) => any;
	cookieExpireDays?: number;
}

/**
 * Creates a Svelte store that automatically persists to localStorage or cookies
 */
export function persistentStore<T>(
	key: string,
	initialValue: T,
	options: PersistentStoreOptions = { storage: 'cookies', cookieExpireDays: 31 }
): Writable<T> {
	const serialize = options.serialize || JSON.stringify;
	const deserialize = options.deserialize || JSON.parse;

	// Load initial value from storage (only in browser)
	let storedValue = initialValue;
	if (browser) {
		try {
			const stored =
				options.storage === 'cookies'
					? Cookies.get(key)
					: localStorage.getItem(key);

			if (stored) {
				storedValue = deserialize(stored);
			}
		} catch (error) {
			console.warn(`Failed to load ${key} from ${options.storage}:`, error);
		}
	}

	// Create the store
	const store = writable<T>(storedValue);

	// Subscribe to changes and persist
	if (browser) {
		store.subscribe((value) => {
			try {
				const serialized = serialize(value);

				if (options.storage === 'cookies') {
					Cookies.set(key, serialized, { expires: options.cookieExpireDays || 31 });
				} else {
					localStorage.setItem(key, serialized);
				}
			} catch (error) {
				console.warn(`Failed to save ${key} to ${options.storage}:`, error);
			}
		});
	}

	return store;
}
