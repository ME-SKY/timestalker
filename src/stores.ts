import { readable, derived, writable, get } from 'svelte/store';
import { loadTimeData, saveTimeData } from './data-service/time-data-service';

type TIMER_STATE = 'running' | 'paused' | 'stopped';
type ProjectName = string;

interface TimeData {
    h: number,
    m: number,
    s: number,
}

interface TimerData extends timeData {
    timerState: TIMER_STATE,
    timerName: string,
}

interface Project {
    name: ProjectName;
    timeSpent: TimeData;
}

function timerStore() {
    const timerStorage = writable({ h: 0, m: 0, s: 0, state: 'stopped' as TIMER_STATE, timerName: '' as ProjectName });
    const { subscribe, set, update } = timerStorage;

    let interval: number | undefined = undefined;

    function start(timerName: string | undefined) {
        // const name = timerName !== undefined ? timerName : '';
        update((time) => ({ ...time, state: 'running', timerName: timerName }));
        interval = setInterval(() => {
            update((time) => {
                console.log('interval running', time.s);
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

                return time;
            })
        }, 1000);
    }

    function pause(): TimeData {
        clearInterval(interval);
        interval = undefined;
        update((time) => ({ ...time, state: 'paused' }));
        // const time = get();
        const { h, m, s } = get(timerStorage);
        return { h, m, s };
    }

    function reset() {
        clearInterval(interval);
        interval = undefined;
        set({ h: 0, m: 0, s: 0 });
        update((time) => ({ ...time, state: 'stopped' }));
    }

    function initialize() {
        // const time = await loadTime();
        // or
        // loadTime().then((time) => {
        //     console.log(time);
        // })
    }

    // function reset() {
    //     set({ h: 0, m: 0, s: 0 });

    return {
        subscribe,
        start,
        pause,
        reset
    };
    // const start = setInterval(() => {}
}

function projectsStore(timer) {
    const projectsStorage = writable<Map<ProjectName, TimeData>>(new Map());

    const { subscribe, set, update } = projectsStorage;

    function createProject(name: string) {
        update(projects => {
            projects.set(name, { h: 0, m: 0, s: 0 });
            return projects;
        });
        timer.reset();
        timer.start(name);
    }

    function removeProject(id: number) {
        update(projects => {
            projects.delete(name);
            return projects;
        });
    }

    function updateProject(name: ProjectName, timeSpent: TimeData) {
        update(projects => {
            projects.set(name, timeSpent);
            return projects;
        });

        saveTimeData(Object.fromEntries(get(projectsStorage)));
    }

    return {
        subscribe,
        createProject,
        removeProject,
        updateProject
    };
}


export const timer = timerStore();
export const projects = projectsStore(timer);