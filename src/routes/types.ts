export interface TimerLog {
    id: number
    name: string;
    start: Date;
    finish: Date;
}


export interface TimerEvent {
    detail: {
        timer: number;
        start: Date;
        finish: Date;
        name: string;
    };
}

export const TimerState = {
    RUNNING: 'RUNNING',
    STOPPED: 'STOPPED',
    WAITING_FOR_STOP: 'WAITING_FOR_STOP',
    ADDING_TIME: 'ADDING_TIME'
};
