/// seconds -> 00:00
export function formatTimeClock(time: number) {
	let minutes = Math.floor(time / 60);
	let seconds = Math.floor(time % 60)
		.toString()
		.padStart(2, '0');
	let minStr = minutes.toString().padStart(2, '0');
	if (minutes > 60) {
		let hour = Math.floor(minutes / 60);
		minStr = Math.floor(minutes % 60)
			.toString()
			.padStart(2, '0');
		return `${hour}:${minStr}:${seconds}`;
	}
	return `${minStr}:${seconds}`;
}

/// seconds -> 00 min 00 sec
export function formatTimeLogLine(time: number) {
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

	if (minutes >= 5) return `${minutes} min`;
	if (minutes > 1) return `${minutes} min ${seconds} sec`;
	return `${seconds} sec`;
}

/// Date -> 00:00
export function formatTs(time: Date) {
	let minutes = time.getHours().toString().padStart(2, '0');
	let seconds = time.getMinutes().toString().padStart(2, '0');
	return `${minutes}:${seconds}`;
}
