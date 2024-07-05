import { readable, derived, writable, get } from 'svelte/store';

function timerStore() {
  const timerStorage = writable({ h: 0, m: 0, s: 0, stringRepresentation: '00:00:00', state: 'stopped' as TimerState, timerName: ''} as TimerData);
  const { subscribe, set, update } = timerStorage;

  let interval: number | undefined = undefined;

  function start(timerName: string | undefined) {
    update((time) => ({ ...time, state: 'running', timerName: timerName }));

    startInterval();
  }

  function pause(): TimeData {
    clearInterval(interval);
    interval = undefined;

    update((time) => ({ ...time, state: 'paused' }));

    const { h, m, s } = get(timerStorage);
    return { h, m, s };
  }

  function resume(timerData?: TimerData | undefined) {
    if (timerData !== undefined) {
      reset();
      update((time) => ({ ...time, state: 'running', h: timerData.h, m: timerData.m, s: timerData.s, stringRepresentation: timerData.stringRepresentation, timerName: timerData.timerName }));
    } else {
      update((time) => ({ ...time, state: 'running' }));
    }

    startInterval();
  }

  function reset(triggerName: boolean = true) {
    if (interval) {
      clearInterval(interval);
      interval = undefined;
    }

    const defaultTimerSetting: TimerData = { state: 'stopped', h: 0, m: 0, s: 0, stringRepresentation: '00:00:00' };

    if (triggerName) {
      defaultTimerSetting.timerName = '';
    }

    update((time) => ({ ...time, ...defaultTimerSetting }));
  }

  function startInterval() {
    interval = setInterval(() => {
      update((time) => {
        if (time.s === 59) {
          time.s = 0;
          if (time.m === 59) {
            time.m = 0;
            time.h++;
          } else {
            time.m++;
          }
        } else {
          time.s++;
        }
        time.stringRepresentation = `${time.h.toString().padStart(2, '0')}:${time.m.toString().padStart(2, '0')}:${time.s.toString().padStart(2, '0')}`;
        return time;
      })
    }, 1000);
  }

  return {
    subscribe,
    start,
    pause,
    resume,
    reset,
    update,
    set
  };
}


export const timer = timerStore();

export const timerName = derived(timer, $timer => $timer.timerName);
