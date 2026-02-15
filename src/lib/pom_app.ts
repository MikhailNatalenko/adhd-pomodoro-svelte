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

	/**
	 * Updates the active timer finish time.
	 * If it exceeds the overtime cap, it's moved to history.
	 * Returns true if an auto-stop occurred.
	 */
	tick(now: Date, multiplier: number): boolean {
		if (!this.active) return false;

		const plannedS = this.active.value * multiplier;
		const elapsedS = (now.getTime() - this.active.start.getTime()) / 1000;
		const maxOvertimeS = 15 * multiplier;

		if (elapsedS > plannedS + maxOvertimeS) {
			this.active.finish = new Date(this.active.start.getTime() + (plannedS + maxOvertimeS) * 1000);
			this.addTimer(this.active);
			return true;
		}

		this.active.finish = now;
		return false;
	}

	/**
	 * Checks the status of a recovered active timer.
	 */
	getRecoveryStatus(now: Date, multiplier: number): {
		shouldResume: boolean;
		shouldArchive: boolean;
		remainingMinutes: number;
	} {
		if (!this.active) return { shouldResume: false, shouldArchive: false, remainingMinutes: 0 };

		const elapsedS = (now.getTime() - this.active.start.getTime()) / 1000;
		const plannedS = this.active.value * multiplier;
		const maxOvertimeS = 15 * multiplier;

		if (elapsedS >= plannedS + maxOvertimeS) {
			return { shouldResume: false, shouldArchive: true, remainingMinutes: 0 };
		}

		const remainingS = plannedS - elapsedS;
		return {
			shouldResume: remainingS > 0,
			shouldArchive: false,
			remainingMinutes: Math.max(0, remainingS / multiplier)
		};
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

