import type { CachedLog } from '$lib/types';
import { Timer } from '$lib/types';

function farTimers(t1: Timer, t2: Timer, gap: number): boolean {
	return (t2.start.getTime() - t1.finish.getTime()) / 1000 > gap;
}

export function collapseTimers(timers: Timer[], gap: number = 60) {
	var output: Timer[] = [];
	var cur = 0;

	if (timers.length <= 1) return timers;

	// var lastTimer = timers[0]
	output.push(timers[0]);
	cur = 0;
	for (let i = 1; i < timers.length; i++) {
		const element = timers[i];

		if (output[cur].name == element.name) {
			if (farTimers(output[cur], element, gap)) {
				output.push(element);
				cur++;
			} else {
				output[cur].finish = element.finish;
			}
		} else {
			output.push(element);
			cur++;
		}
	}

	return output;
}

export function fillGaps(timers: Timer[], name = 'rest', gapMin: number = 60 * 5) {
	var output: Timer[] = [];
	var cur = 0;

	if (timers.length <= 1) return timers;

	// var lastTimer = timers[0]
	output.push(timers[0]);
	cur = 0;
	for (let i = 1; i < timers.length; i++) {
		const element = timers[i];
		if (farTimers(output[cur], element, gapMin)) {
			var gapTimer = new Timer();
			gapTimer.start = output[cur].finish;
			gapTimer.finish = element.start;
			gapTimer.name = name;

			output.push(gapTimer);
			cur++;
		}

		output.push(element);
		cur++;
	}

	return output;
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
	public list: Timer[] = [];
	public active?: Timer;

	rest_name: string = 'rest';
	work_name: string = 'work';

	constructor(list: Timer[], active?: Timer) {
		this.list = fillGaps(list, this.rest_name);
		this.active = active;
	}

	normalize(collapse: boolean) {
		var timers = fillGaps(this.list, 'rest');
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

	setActive(active: Timer): TimerList {
		this.active = active;
		return this.glueGaps();
	}

	setActiveDur(_duration: number): TimerList {
		if (this.active) {
			this.active.finish = new Date();
			return this;
		}
		return this;
	}

	push(timer: Timer): TimerList {
		this.active = undefined;

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
				timer.name = timer.name === this.rest_name ? this.work_name : this.rest_name;
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
			if (element.name == this.work_name) {
				duration += element.durationS();
			}
		});

		if (this.active) {
			if (this.active.name == this.work_name) {
				duration += this.active.durationS();
			}
		}
		return duration;
	}

	glueGaps(): TimerList {
		this.list = fillGaps(this.list, this.rest_name);
		return this;
	}
}
