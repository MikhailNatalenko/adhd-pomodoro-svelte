import { Timer } from '$lib/types';
import { TimerList } from './timerlog';

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
		return this;
	}

	remove(start: Date): PomApp {
		this.timerHistory.remove(start);
		return this;
	}

	changeLineType(start: Date): PomApp {
		this.timerHistory.changeLineType(start);
		return this;
	}

	clearLogs(): PomApp {
		this.timerHistory = new TimerList([]);
		return this;
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

