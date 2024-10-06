import { Timer } from '$lib/types';

/// seconds -> 00:00
export function formatTimeClock(time: number) {
	let minutes = Math.floor(time / 60)
		.toString()
		.padStart(2, '0');
	let seconds = Math.floor(time % 60)
		.toString()
		.padStart(2, '0');
	return `${minutes}:${seconds}`;
}

/// seconds -> 00 min 00 sec
export function formatTimeLogline(time: number) {
	let minutes = Math.floor(time / 60);
	let seconds = Math.floor(time % 60);

	if (minutes > 60) {
		let hour = Math.floor(minutes / 60);
		minutes = Math.floor(minutes % 60);
		return `${hour}h ${minutes} min`;
	} else if (minutes > 0) {
		return `${minutes} min`;
	} else {
		return `${seconds} sec`;
	}
}

/// seconds -> H hours
export function formatTimeHHMMSS(time: number) {
	let hours = Math.floor(time / 3600);
	if (hours > 0) {
		time = time - hours * 3600;
	}
	let minutes = Math.floor(time / 60);
	let seconds = Math.floor(time % 60);

	if (hours == 1) return `${hours} hour ${minutes} min`;
	if (hours > 0) return `${hours} hours ${minutes} min`;

	if (minutes > 10) return `${minutes} min`;
	if (minutes > 1) return `${minutes} min ${seconds} sec`;
	return `${seconds} sec`;
}

/// Date -> 00:00
export function formatTs(time: Date) {
	let minutes = time.getHours().toString().padStart(2, '0');
	let seconds = time.getMinutes().toString().padStart(2, '0');
	return `${minutes}:${seconds}`;
}

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

export function normalizeTimers(timers: Timer[]): Timer[] {
	let gapped = fillGaps(timers, 'rest');
	return collapseTimers(gapped);
}
