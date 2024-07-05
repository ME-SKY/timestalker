type TimerState = 'running' | 'paused' | 'stopped';
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
  state: TimerState,
  timerName?: string | undefined,
}

const listOfAvailableTimezones = Intl.supportedValuesOf('timeZone');

type Period = MapRecord<[DateSpan, TimeData]>

// interface Period MapRecord<K, V> {
//   [key: K]: V;
// }

interface MapRecord<K, V> {
  [key: K]: V;
}

// type Period<, V> = MapRecord<K, V>;


// interface MapRecord<K, V> {
//   [key: K]: V;
// }

type MapType<K, V> = MapRecord<K, V>;

interface ProjectData extends TimeData {
  periodsByDate: Period [],
  name?: string,
  lastUpdateDate?: string,
  lastUpdateWeekDay?: WeekDay
}

type Project = Record<ProjectName, ProjectData>

interface DayHistory {
  date: string,
  score: TimeData,
  projects: Project [],
}

type TimezoneSetting = `${Locale}:${typeof listOfAvailableTimezones[number]}`;

interface Settings {
  theme: string,
  mainTimezone: TimezoneSetting,
  additionalTimezone: TimezoneSetting,
  syncMode: 'local' | 'google-sync'
}