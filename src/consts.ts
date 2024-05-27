export const TIMER_ACTIONS_BASED_ON_STATE: { [key in TimerState]: string } = {
  running: 'pause',
  paused: 'resume',
  stopped: 'start'
}