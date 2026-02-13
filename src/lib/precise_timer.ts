export class PreciseTimer {
	intervalId = 0;
	duration = 0;
	start = 0;
	remain = 0;

	onSec = (n: number) => {};
	onAlarm = () => {};

	constructor(duration: number, onSec: (n: number) => void, onAlarm: () => void, smallIntervalMs = 300) {
		this.duration = duration;
		this.remain = duration;

		if (duration > 0) {
			this.onSec = onSec;
			this.onAlarm = onAlarm;
			this.start = Date.now();

			this.intervalId = setInterval(() => {
				const elapsed = Math.ceil((Date.now() - this.start) / 1000);
				let remainingTime = this.duration - elapsed;

				if (remainingTime != this.remain) {
					onSec(this.remain);
					this.remain = remainingTime;
					if (this.remain <= 0) {
						this.onAlarm();
						clearInterval(this.intervalId);
					}
				}
			}, smallIntervalMs);
		}
	}

	stop() {
		clearInterval(this.intervalId);
	}
}
