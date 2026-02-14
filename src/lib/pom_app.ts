import { Timer } from '$lib/types';
import { TimerList } from './timerlog';
import { TIMER_TYPES } from './constants';

export class PomApp {
	public timerHistory: TimerList;
	public active?: Timer;

	constructor() {
		this.timerHistory = new TimerList([]);
	}

	////
	//  timer list modification
	///
	addTimer(timer: Timer): PomApp {
		this.active = undefined;
		this.timerHistory.addTimer(timer);
		return this;
	}

	remove(start: Date): PomApp {
		this.timerHistory.remove(start);
		return this;
	}

	clearLogs(): PomApp {
		this.timerHistory = new TimerList([]);
		return this;
	}

	////////
	/// current timer modification
	/////

	resetActive(): PomApp {
		this.active = undefined;
		return this;
	}

	updateActiveTimer(): PomApp {
		if (this.active) {
			// Update finish to current time to show active timer progress on timeline
			this.active.finish = new Date();
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
			if (this.active.name == TIMER_TYPES.WORK) {
				duration += this.active.durationS();
			}
		}
		return duration;
	}
}

