type TimerState =  = 'running' | 'paused' | 'stopped';
type ProjectName = string;

type Year = `${number}${number}${number}${number}`;
type Month = `${number}${number}`;
type Day = `${number}${number}`;
type DateSpan = `${Year}-${Month}-${Day}`;

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

type Period = Record<DateSpan, TimeData>

interface ProjectData extends TimeData {
    periodsByDate: Map<Period>,
    name?: string,
    lastUpdateDate?: string,
    lastUpdateWeekDay?: WeekDay
}

type Project = Record<ProjectName, ProjectData>