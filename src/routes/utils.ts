export function formatTimeClock(time: number) {
    let minutes = Math.floor(time / 60)
        .toString()
        .padStart(2, '0');
    let seconds = Math.floor(time % 60)
        .toString()
        .padStart(2, '0');
    return `${minutes}:${seconds}`;
}

export function formatTimeLogline(time: number) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60)
        .toString()
        .padStart(2, '0');
    return `${minutes} min ${seconds} sec`;
}

export function formatTs(time: Date) {
    let minutes = time.getHours().toString().padStart(2, '0');
    let seconds = time.getMinutes().toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}
