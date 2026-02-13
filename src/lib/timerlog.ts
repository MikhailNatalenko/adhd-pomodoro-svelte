import type { CachedLog } from '$lib/types';
import { Timer } from '$lib/types';
import { TIMER_TYPES } from './constants';

let DEFAULT_COLLAPSE_GAP_S = 60;
let DEFAULT_LONG_GAP_S = 5 * 60;
export function hasLongGap(t1: Timer, t2: Timer, gap: number = DEFAULT_COLLAPSE_GAP_S): boolean {
	return (t2.start.getTime() - t1.finish.getTime()) / 1000 > gap;
}

export function collapseTimers(timers: Timer[], gap: number = DEFAULT_COLLAPSE_GAP_S) {
	var collapsedList: Timer[] = [];
	var cur = 0;

	if (timers.length <= 1) return timers;

	// var lastTimer = timers[0]
	collapsedList.push(timers[0]);
	cur = 0;
	for (let i = 1; i < timers.length; i++) {
		const element = timers[i];

		if (collapsedList[cur].name != element.name) {
			collapsedList.push(element);
			cur++;
			continue;
		}

		if (hasLongGap(collapsedList[cur], element, gap)) {
			collapsedList.push(element);
			cur++;
		} else {
			// move finish line
			collapsedList[cur].finish = element.finish;
		}
	}

	return collapsedList;
}

export function fillEmptyGaps(
	timers: Timer[],
	name = TIMER_TYPES.REST,
	gapSizeS: number = DEFAULT_LONG_GAP_S
) {
	var outputList: Timer[] = [];
	var cursor = 0;

	if (timers.length <= 1) return timers;

	// var lastTimer = timers[0]
	outputList.push(timers[0]);
	cursor = 0;
	for (let i = 1; i < timers.length; i++) {
		const element = timers[i];
		if (hasLongGap(outputList[cursor], element, gapSizeS)) {
			var gapTimer = new Timer(0, name, outputList[cursor].finish, element.start);

			outputList.push(gapTimer);
			cursor++;
		}

		outputList.push(element);
		cursor++;
	}

	return outputList;
}

// Validate this value with a custom type guard (extend to your needs)
function validateCachedLogs(arr: any): arr is CachedLog[] {
	arr.forEach((o: any) => {
		if (!('name' in o && 'start' in o && 'finish' in o)) return false;
	});
	return true;
}

export function createTimerFromDuration(dur: number, name: string) {
	//TODO: propably it's possible make cleaner
	let start = new Date(new Date().getTime() - dur * 1000);

	let timer = new Timer(0, name, start, new Date());
	timer.setDuration(dur);
	return timer;
}

export function parseTimerList(str: string): TimerList {
	let list: Timer[] = [];
	try {
		const parsed = JSON.parse(str);

		let cached: Timer[] = [];
		if (validateCachedLogs(parsed)) {
			// do something with now correctly typed object
			parsed.forEach((element) => {
				cached.push(
					new Timer(
						0,
						element.name,
						new Date(element.start * 1000),
						new Date(element.finish * 1000)
					)
				);
			});
		}
		console.log('deserialized logs:', cached);
		list = cached;
	} catch (error) {
		list = [];
	}
	return new TimerList(list);
}

export class TimerList {
	private additionalS = 0;
	public list: Timer[] = [];

	constructor(list: Timer[]) {
		this.list = fillEmptyGaps(list, TIMER_TYPES.REST);
	}

	normalize(collapse: boolean) {
		var timers = fillEmptyGaps(this.list, TIMER_TYPES.REST);
		if (collapse) timers = collapseTimers(timers);

		return timers;
	}

	serialize(): string {
		let cached: CachedLog[] = [];
		this.list.forEach((element) => {
			cached.push({
				name: element.name,
				start: Math.floor(element.start.getTime() / 1000),
				finish: Math.floor(element.finish.getTime() / 1000)
			});
		});

		console.log('Serializing logs:', JSON.stringify(cached));
		return JSON.stringify(cached);
	}

	addTimer(timer: Timer): TimerList {
		if (this.list.length > 0) {
			//TODO: dirty hack. Propably I should fix it later
			if (this.list[this.list.length - 1].start == timer.start) {
				this.list[this.list.length - 1].finish = timer.finish;
				this.list = this.list;
				return this;
			}
		}
		this.list.push(timer);
		return this;
	}

	changeLineType(start: Date): TimerList {
		this.list.forEach((timer) => {
			if (timer.start === start) {
				timer.name = timer.name === TIMER_TYPES.REST ? TIMER_TYPES.WORK : TIMER_TYPES.REST;
			}
		});

		return this;
	}

	remove(start: Date) {
		var i = 0;
		while (i < this.list.length) {
			if (this.list[i].start === start) {
				this.list.splice(i, 1);
			} else {
				++i;
			}
		}
	}

	total() {
		let duration = 0;
		this.list.forEach((element) => {
			if (element.name == TIMER_TYPES.WORK) {
				duration += element.durationS();
			}
		});

		return duration;
	}

	fillGaps(now = new Timer()): TimerList {
		this.list = fillEmptyGaps(this.list);

		if (this.list.length > 0) {
			let lastTimer = this.list[this.list.length - 1];
			if (hasLongGap(lastTimer, now)) {
				this.list.push(new Timer(0, TIMER_TYPES.REST, lastTimer.finish, now.start));
			}
		}

		return this;
	}

	addDursec(addDursecS: number): TimerList {
		this.additionalS += addDursecS;
		return this;
	}

	getAdditional(): number {
		return this.additionalS;
	}
}
