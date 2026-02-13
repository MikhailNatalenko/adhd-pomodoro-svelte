/**
 * Timer type constants
 */
export const TIMER_TYPES = {
	WORK: 'work',
	REST: 'rest'
} as const;

export type TimerType = (typeof TIMER_TYPES)[keyof typeof TIMER_TYPES];

/**
 * Debug and production parameters
 */
export const dbgParams = {
	afterClockIntervalS: 3,
	afterClockTimeoutS: 10,
	timersMultiplier: 1 // second
};

export const prodParams = {
	afterClockIntervalS: 10, //45 seconds
	afterClockTimeoutS: 60 * 15, //15 minutes
	timersMultiplier: 1 * 60 // minute
};

export function getParam(debug: boolean) {
	return debug ? dbgParams : prodParams;
}
