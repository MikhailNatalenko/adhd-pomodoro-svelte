import type { TimerType } from './constants';

export class Timer {
	start: Date;
	finish: Date;
	name: TimerType | string;
	value: number;

	constructor(value = 0, name: TimerType | string = '', start = new Date(), finish = new Date()) {
		this.start = start;
		this.finish = finish;
		this.name = name;
		this.value = value;
	}

	setDuration(dur: number) {
		this.finish = new Date(this.start.getTime() + dur * 1000);
	}
	durationS() {
		return (this.finish.getTime() - this.start.getTime()) / 1000;
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

export enum EmitTimer {
	EMIT = 1,
	DO_NOT_EMIT
}
