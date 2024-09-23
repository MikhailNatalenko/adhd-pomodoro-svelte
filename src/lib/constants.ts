export const dbgParams = {
	afterClockIntervaltS: 3,
	afterClockTimeoutS: 10,
	timersMultiplier: 1 // second
};

export const prodParams = {
	afterClockIntervaltS: 10, //45 seconds
	afterClockTimeoutS: 60 * 15, //15 minutes
	timersMultiplier: 1 * 60 // minute
};
