type TIMER_STATE = 'running' | 'paused' | 'stopped';
type ProjectName = string;

interface TimeData {
    h: number,
    m: number,
    s: number,
    stringRepresentation?: string
}

interface TimerData extends TimeData {
    timerState: TIMER_STATE,
    timerName?: string,
}