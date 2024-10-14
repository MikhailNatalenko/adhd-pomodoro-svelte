export class Timer {
	start: Date;
	finish: Date;
	name: string;
	value: number;

	constructor(value = 0, name = '', start = new Date(), finish = new Date()) {
		this.start = start;
		this.finish = finish;
		this.name = name;
		this.value = value;
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
