type TimerState =  = 'running' | 'paused' | 'stopped';
type ProjectName = string;

type WeekDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

interface TimeData {
    h: number,
    m: number,
    s: number,
    stringRepresentation?: string
}

interface TimerData extends TimeData {
    timerState: TimerState,
    timerName?: string,
}

interface ProjectData extends TimeData {
    name?: string;
    lastUpdateDate?: string;
    lastUpdateWeekDay?: WeekDay;
}

type Project = Record<ProjectName, ProjectData>