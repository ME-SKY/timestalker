import { get, writable, derived } from 'svelte/store';

const initialSettings: Settings = {
  theme: 'basic-light',
  mainTimezone: 'ru-Ru:Asia/Vladivostok',
  additionalTimezone: 'en-US:America/New_York',
  syncMode: 'local'
};

function settingsStore() {
  const settingsStorage = writable(initialSettings);
  const { subscribe, set, update } = settingsStorage;

  return {
    subscribe,
    update,
    set
  };
}

export const settings = settingsStore();
export const mainTimeCity = derived(settings, $settings => $settings.mainTimezone.split('/')[1].replace('_', '-'));
export const additionalTimeCity = derived(settings, $settings => $settings.additionalTimezone.split('/')[1].replace('_', '-'));

function setTime(mTimezone: string, aTimezone: string) {
  const newDate = new Date();

  const [mainName, mainZone] = mTimezone.split(':');
  const mainTime = newDate.toLocaleTimeString(mainName, { timeZone: mainZone, hour: '2-digit', minute: '2-digit' });

  const [additionalName, additionalZone] = aTimezone.split(':');
  const additionalTime = newDate.toLocaleTimeString(additionalName, { timeZone: additionalZone, hour: '2-digit', minute: '2-digit' });

  return { mainTime, additionalTime };
}

function currentTimeStore(settingsData: any) {
  const currTime = writable({ mainTime: '' as any, additionalTime: '' as any });
  const { subscribe, update, set } = currTime;

  // @ts-ignore
  const mainTimeSetting = get(settingsData).mainTimezone; // not avoidable typescript gymnasctics here
  // @ts-ignore
  const additionalTimeSetting = get(settingsData).additionalTimezone;

  //init values for time:
  set(setTime(mainTimeSetting, additionalTimeSetting));


  setInterval(() => {
    currTime.update(() => {
      // @ts-ignore
      const mainTimeSetting = get(settingsData).mainTimezone; // not avoidable typescript gymnasctics here
      // @ts-ignore
      const additionalTimeSetting = get(settingsData).additionalTimezone;

      // setTime(mainTimeSetting, additionalTimeSetting);
      // const newDate = new Date();

      // const [mainName, mainZone] = mainTimeSetting.split(':');
      // const mainTime = newDate.toLocaleTimeString(mainName, { timeZone: mainZone, hour: '2-digit', minute: '2-digit' });

      // const [additionalName, additionalZone] = additionalTimeSetting.split(':');
      // const additionalTime = newDate.toLocaleTimeString(additionalName, { timeZone: additionalZone, hour: '2-digit', minute: '2-digit' });

      return setTime(mainTimeSetting, additionalTimeSetting);
    });
  }, 5000); //TODO: change to one minute after Settings component will be ready

  return {
    subscribe, update, set
  };
}

export const currentTime = currentTimeStore(settings);