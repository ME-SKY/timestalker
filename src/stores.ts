import { readable, derived, writable, get } from 'svelte/store';
import { loadTimeData, saveTimeData } from './data-service/time-data-service';

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
    timerName: string,
}

function timerStore() {
    const timerStorage = writable({ h: 0, m: 0, s: 0, state: 'stopped' as TIMER_STATE, timerName: '' as ProjectName });
    const { subscribe, set, update } = timerStorage;

    const stringRepresentation = derived(timerStorage, ($timer) => {
        const { h, m, s } = $timer;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    });

    let interval: number | undefined = undefined;


    function start(timerName: string | undefined) {
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
        reset,
        stringRepresentation
    };
    // const start = setInterval(() => {}
}

function projectsStore(timer) {
    const projectsStorage = writable<Map<ProjectName, TimeData>>(new Map());
    const { subscribe, set, update } = projectsStorage;

    loadTimeData().then((timeData) => {
        console.log('loaded time data', timeData);
        const loadedProjectsTimeData = new Map(Object.entries(timeData)); 
        set(loadedProjectsTimeData);
    });

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
        const newTimeSpent = {...timeSpent, stringRepresentation: `${timeSpent.h.toString().padStart(2, '0')}:${timeSpent.m.toString().padStart(2, '0')}:${timeSpent.s.toString().padStart(2, '0')}`};
        update(projects => {
            projects.set(name, newTimeSpent);
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