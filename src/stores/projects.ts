import { readable, derived, writable, get } from 'svelte/store';
import { loadTimeData, saveTimeData } from '../data-service/time-data-service';
import { timer } from '../stores/timer';

function projectsStore(timer) {
    const projectsStorage = writable<Map<Project>>(new Map());
    const { subscribe, set, update } = projectsStorage;

    loadTimeData().then((timeData) => {
        console.log('loaded time data', timeData);
        const loadedProjectsTimeData = new Map(Object.entries(timeData));
        set(loadedProjectsTimeData);
    });

    function createProject(name: string) {
        update(projects => {
            projects.set(name, { h: 0, m: 0, s: 0, stringRepresentation: '00:00:00' });
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

    function setProjectToTimer(name: ProjectName) {
        const project = get(projectsStorage).get(name);
        if (project) {
            timer.set({
                h: project.h,
                m: project.m,
                s: project.s,
                stringRepresentation: project.stringRepresentation,
                state: 'paused',
                timerName: name
            });
        }
    }

    function resumeProject(name: ProjectName) {
        console.log('resume Project starts')
        const projectToResume = get(projectsStorage).get(name);
        timer.resume({ timerName: name, ...projectToResume });
    }

    function updateProject(name: ProjectName, timeSpent: TimeData) {
        const currentDate = new Date();
        const isoString = currentDate.toISOString();
        console.log('iso string on save:', isoString);
        const weekDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(currentDate);

        console.log('weekday on save:', weekDay);
        const projectData = { ...timeSpent, 
            stringRepresentation: `${timeSpent.h.toString().padStart(2, '0')}:${timeSpent.m.toString().padStart(2, '0')}:${timeSpent.s.toString().padStart(2, '0')}`, 
            lastUpdateDate: isoString, 
            lastUpdateWeekDay: weekDay
        };

        update(projects => {
            projects.set(name, projectData);
            return projects;
        });

        saveTimeData(Object.fromEntries(get(projectsStorage)));
    }



    return {
        subscribe,
        createProject,
        removeProject,
        updateProject,
        resumeProject,
        setProjectToTimer
    };
}

export const projects = projectsStore(timer);