import { readable, derived, writable, get } from 'svelte/store';



function settingsStore() {
  const settingsStorage: Settings = writable({
    afsdf: 234,
    theme: 'basic-light',
    mainTimezone: 'ru-Ru:Asia/Vladivostok',
    additionalTimezone: 'en-US:America/New_York',
    syncMode: 'local'
  });
  const { subscribe, set, update } = settingsStorage;

  

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


export const settings: Settings = settingsStore();


export const currentTime = derived(settings, ($settings) => {
  const options = { hour: '2-digit', minute: '2-digit', timeZone: $settings.mainTimezone };
  const date = new Date();
  date.toLocaleTimeString('en-US', options);
  return date.toLocaleTimeString('en-US', options);
});

setInterval(() => {
  currentTime.update((time) => {
    const options = { hour: '2-digit', minute: '2-digit', timeZone: $settings.mainTimezone };
    const date = new Date();
    date.toLocaleTimeString('en-US', options);
    return date.toLocaleTimeString('en-US', options);
  });
}, 60000);

