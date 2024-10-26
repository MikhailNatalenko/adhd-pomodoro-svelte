import { collapseTimers, fillEmptyGaps, TimerList } from './timerlog';
import { describe, it, expect } from 'vitest';
import { Timer } from '$lib/types';

describe('collapse timers test', () => {
	it('one timer with work', () => {
		var case1 = new Timer();

		case1.start = new Date(100);
		case1.finish = new Date(1000);
		case1.name = 'work';
		let input = [case1];

		let output = collapseTimers(input);
		expect(output).toBe(input);
	});

	it('one timer with rest', () => {
		var case1 = new Timer();

		case1.start = new Date(100);
		case1.finish = new Date(1000);
		case1.name = 'rest';
		let input = [case1];

		let output = collapseTimers(input);
		expect(output).toBe(input);
	});

	var timer1 = new Timer();

	timer1.start = new Date(Date.parse('01 Jan 1970 00:00:00 GMT'));
	timer1.finish = new Date(Date.parse('01 Jan 1970 00:20:00 GMT'));
	timer1.name = 'work';

	var timer2work = new Timer();
	timer2work.start = new Date(Date.parse('01 Jan 1970 00:20:00 GMT'));
	timer2work.finish = new Date(Date.parse('01 Jan 1970 00:40:00 GMT'));
	timer2work.name = timer1.name;

	var timer2rest = new Timer();
	timer2rest.start = new Date(Date.parse('01 Jan 1970 00:20:00 GMT'));
	timer2rest.finish = new Date(Date.parse('01 Jan 1970 00:40:00 GMT'));
	timer2rest.name = 'rest';

	var timer3work = new Timer();
	timer3work.start = new Date(Date.parse('01 Jan 1970 00:40:00 GMT'));
	timer3work.finish = new Date(Date.parse('01 Jan 1970 00:45:00 GMT'));
	timer3work.name = 'work';

	var timer3rest = new Timer();
	timer3rest.start = timer3work.start;
	timer3rest.finish = timer3work.finish;
	timer3rest.name = 'rest';

	it('two timers that collapse', () => {
		let input = [timer1, timer2work];

		var outputTimer = new Timer();
		outputTimer.start = timer1.start;
		outputTimer.finish = timer2work.finish;
		outputTimer.name = timer1.name;

		let expected = [outputTimer];

		let output = collapseTimers(input);
		expect(output).toStrictEqual(expected);
	});

	it('two different timers', () => {
		let input = [timer1, timer2rest];

		let expected = [timer1, timer2rest];

		let output = collapseTimers(input);
		expect(output).toStrictEqual(expected);
	});

	it('w + w + w', () => {
		let input = [timer1, timer2work, timer3work];

		var outTimer = new Timer();
		outTimer.start = timer1.start;
		outTimer.finish = timer3work.finish;
		outTimer.name = 'work';

		let output = collapseTimers(input);
		expect(output).toStrictEqual([outTimer]);
	});

	it('w + r + w', () => {
		let input = [timer1, timer2rest, timer3work];

		let output = collapseTimers(input);
		expect(output).toStrictEqual(input);
	});

	it('w + r + r', () => {
		let input = [timer1, timer2rest, timer3rest];

		var outTimer = new Timer();
		outTimer.start = timer2rest.start;
		outTimer.finish = timer3rest.finish;
		outTimer.name = 'rest';

		let output = collapseTimers(input);
		expect(output).toStrictEqual([timer1, outTimer]);
	});

	it('w + r + r + douplicat r', () => {
		let input = [timer1, timer2rest, timer3rest, timer3rest];

		var outTimer = new Timer();
		outTimer.start = timer2rest.start;
		outTimer.finish = timer3rest.finish;
		outTimer.name = 'rest';

		let output = collapseTimers(input);
		expect(output).toStrictEqual([timer1, outTimer]);
	});
});

describe('collapse timers test check intervals gaps', () => {
	var timer1 = new Timer();

	timer1.start = new Date(Date.parse('01 Jan 1970 00:00:00 GMT'));
	timer1.finish = new Date(Date.parse('01 Jan 1970 00:20:00 GMT'));
	timer1.name = 'work';

	var timer2work = new Timer();
	timer2work.start = new Date(Date.parse('01 Jan 1970 00:20:00 GMT'));
	timer2work.finish = new Date(Date.parse('01 Jan 1970 00:45:00 GMT'));
	timer2work.name = timer1.name;

	var timer3workGapped = new Timer();
	timer3workGapped.start = new Date(Date.parse('01 Jan 1970 00:46:01 GMT'));
	timer3workGapped.finish = new Date(Date.parse('01 Jan 1970 01:00:00 GMT'));
	timer3workGapped.name = 'work';

	it('w + w + gap + w', () => {
		let input = [timer1, timer2work, timer3workGapped];

		var outTimer = new Timer();
		outTimer.start = timer1.start;
		outTimer.finish = timer2work.finish;
		outTimer.name = 'work';

		let output = collapseTimers(input);
		expect(output).toStrictEqual([outTimer, timer3workGapped]);
	});
});

describe('fill gaps', () => {
	var timer1 = new Timer();

	timer1.start = new Date(Date.parse('01 Jan 1970 00:00:00 GMT'));
	timer1.finish = new Date(Date.parse('01 Jan 1970 00:20:00 GMT'));
	timer1.name = 'work';

	var timer2work = new Timer();
	timer2work.start = new Date(Date.parse('01 Jan 1970 00:20:00 GMT'));
	timer2work.finish = new Date(Date.parse('01 Jan 1970 00:45:00 GMT'));
	timer2work.name = timer1.name;

	var timer3workGapped = new Timer();
	timer3workGapped.start = new Date(Date.parse('01 Jan 1970 00:50:01 GMT'));
	timer3workGapped.finish = new Date(Date.parse('01 Jan 1970 01:00:00 GMT'));
	timer3workGapped.name = 'work';

	it('w + w + gap + w', () => {
		let input = [timer1, timer2work, timer3workGapped];

		var gapTimer = new Timer();
		gapTimer.start = timer2work.finish;
		gapTimer.finish = timer3workGapped.start;
		gapTimer.name = 'rest';

		let output = fillEmptyGaps(input);
		expect(output).toStrictEqual([timer1, timer2work, gapTimer, timer3workGapped]);
	});
});

describe('check durationS', () => {
	var timer1 = new Timer();

	timer1.start = new Date(Date.parse('01 Jan 1970 00:00:00 GMT'));
	timer1.finish = new Date(Date.parse('01 Jan 1970 00:00:10 GMT'));
	timer1.name = 'work';

	var timer2work = new Timer();
	timer2work.start = new Date(Date.parse('01 Jan 1970 00:20:00 GMT'));
	timer2work.finish = new Date(Date.parse('01 Jan 1970 00:21:00 GMT'));
	timer2work.name = timer1.name;

	var timer2rest = new Timer();
	timer2rest.start = new Date(Date.parse('01 Jan 1970 00:20:00 GMT'));
	timer2rest.finish = new Date(Date.parse('01 Jan 1970 00:21:00 GMT'));
	timer2rest.name = 'rest';

	var timer3work = new Timer();
	timer3work.start = new Date(Date.parse('01 Jan 1970 00:40:00 GMT'));
	timer3work.finish = new Date(Date.parse('01 Jan 1970 00:40:10 GMT'));
	timer3work.name = 'work';

	var timer3rest = new Timer();
	timer3rest.start = new Date(Date.parse('01 Jan 1970 00:40:00 GMT'));
	timer3rest.finish = new Date(Date.parse('01 Jan 1970 00:40:10 GMT'));
	timer3rest.name = 'rest';

	// it ()
	it('w + w + w', () => {
		let list = new TimerList([timer1, timer2work, timer3work]);

		let output = list.total();
		expect(output).toEqual(80);
	});

	it('w + w + aw', () => {
		let list = new TimerList([timer1, timer2work], timer3work);

		let output = list.total();
		expect(output).toEqual(80);
	});

	it('w + r + aw', () => {
		let list = new TimerList([timer1, timer2rest], timer3work);

		let output = list.total();
		expect(output).toEqual(20);
	});

	it('w + r + ar', () => {
		let list = new TimerList([timer1, timer2rest], timer3rest);

		let output = list.total();
		expect(output).toEqual(10);
	});

	it('w add + 5 sec', () => {
		let list = new TimerList([timer1]);

		list = list.addDursec(5);

		let output = list.total();
		expect(output).toEqual(15);
	});

	it('w add + 5 sec + 5 sec', () => {
		let list = new TimerList([timer1]);

		list = list.addDursec(5);
		list = list.addDursec(5);

		let output = list.total();
		expect(output).toEqual(20);
	});

	it('w add - 5 sec', () => {
		let list = new TimerList([timer1]);

		list = list.addDursec(-5);

		let output = list.total();
		expect(output).toEqual(5);
	});
});

describe('check setDuration', () => {
	var timer1 = new Timer();

	timer1.start = new Date(Date.parse('01 Jan 1970 00:00:00 GMT'));
	timer1.finish = new Date(Date.parse('01 Jan 1970 00:00:01 GMT'));
	timer1.name = 'work';

	// it ()
	it('set 10 sec', () => {
		timer1.setDuration(10);

		expect(timer1.finish).toEqual(new Date(Date.parse('01 Jan 1970 00:00:10 GMT')));
	});
});
