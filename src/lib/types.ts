export class Timer {
	start: Date;
	finish: Date;
	name: string;
	value: number;
	toplog: boolean = false;

	constructor(value = 0, name = '') {
		this.start = new Date();
		this.finish = new Date();
		this.name = name;
		this.value = value;
		this.toplog = false;
	}
}

export type CachedLog = {
	name: string;
	start: number;
	finish: number;
};

export interface TimerEvent {
	detail: Timer;
}

export const TimerState = {
	RUNNING: 'RUNNING',
	STOPPED: 'STOPPED',
	WAITING_FOR_STOP: 'WAITING_FOR_STOP'
} as const;

export type TimerStateType = (typeof TimerState)[keyof typeof TimerState];
