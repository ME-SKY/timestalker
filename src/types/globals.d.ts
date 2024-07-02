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

const listOfAvailableTimezones = Intl.supportedValuesOf('timeZone');

type Period = Record<DateSpan, TimeData>

interface ProjectData extends TimeData {
  periodsByDate: Map<Period>,
  name?: string,
  lastUpdateDate?: string,
  lastUpdateWeekDay?: WeekDay
}

type Project = Record<ProjectName, ProjectData>

interface DayHistory {
  date: string,
  score: TimeData,
  projects: ProjectData [],
}

type TimezoneSetting = `${Locale}:${typeof listOfAvailableTimezones[number]}`;

interface Settings {
  theme: string,
  mainTimezone: TimezoneSetting,
  additionalTimezone: TimezoneSetting,
  syncMode: 'local' | 'google-sync'
}