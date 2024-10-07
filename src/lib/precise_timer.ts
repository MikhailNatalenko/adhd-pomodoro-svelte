export class PreciseTimer {
	intervalId = 0;
	duration = 0;
	start = new Date();
	remain = 0;

	onSec = (n: number) => {};
	onAlarm = () => {};

	constructor(
		duration: number,
		onSec: (n: number) => void,
		onAlarm: () => void,
		smallIntervalMs = 500
	) {
		this.duration = duration;
		this.remain = duration;
		if (duration > 0) {
			this.onSec = onSec;
			this.onAlarm = onAlarm;
			this.start = new Date();

			this.intervalId = setInterval(() => {
				let remainingTime = this.duration - Math.floor((Date.now() - this.start.getTime()) / 1000);
				console.log(
					'interval id {}, duration {}, remaining',
					this.intervalId,
					this.duration,
					remainingTime
				);
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
