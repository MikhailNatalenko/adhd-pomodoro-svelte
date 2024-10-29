import { Timer } from '$lib/types';
import { TimerList, hasLongGap } from './timerlog';
import Cookies from 'js-cookie';
import { parseTimerList } from './timerlog';

export class PomApp {
	public timerHistory: TimerList;
	public active?: Timer;

	//TODO: Refactor these names somehow. Use enum or smth
	work_name = 'work';

	constructor() {
		this.timerHistory = new TimerList([]);
	}

	////
	//  history modification
	///
	addTimer(timer: Timer): PomApp {
		this.active = undefined;

		this.timerHistory.addTimer(timer);
		this.serializeList();
		return this;
	}

	remove(start: Date): PomApp {
		this.timerHistory.remove(start);
		this.serializeList();
		return this;
	}

	changeLineType(start: Date): PomApp {
		this.timerHistory.changeLineType(start);
		this.serializeList();
		return this;
	}

	clearLogs(): PomApp {
		this.timerHistory = new TimerList([]);
		this.serializeList();
		return this;
	}

	//TODO: do we actually need it?
	serializeList() {
		Cookies.set('logs', this.timerHistory.serialize(), { expires: 31 });
	}

	////////
	/// current time modification
	/////

	resetActive(): PomApp {
		this.active = undefined;
		return this;
	}

	setActiveDur(_duration: number): PomApp {
		if (this.active) {
			this.active.finish = new Date();
			return this;
		}
		return this;
	}

	setActive(active: Timer): PomApp {
		this.active = active;
		this.timerHistory.fillGaps();
		return this;
	}

	totalTime(): number {
		let duration = this.timerHistory.total();

		if (this.active) {
			if (this.active.name == this.work_name) {
				duration += this.active.durationS();
			}
		}
		return duration;
	}
}

export function loadPomAppFromCookies(): PomApp {
	let logs = Cookies.get('logs');
	console.log('cookies for logs contain', logs);

	let ret = new PomApp();
	ret.timerHistory = parseTimerList(logs == undefined ? '' : logs);
	return ret;
}
