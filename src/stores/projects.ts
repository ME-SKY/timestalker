import { readable, derived, writable, get } from 'svelte/store';
import { loadTimeData, saveTimeData } from '../data-service/time-data-service';
import { timer } from '../stores/timer';
import { getDateString } from '@/helpers';


function projectsStore(timer) {
    const projectsStorage = writable<Map<Project>>(new Map());
    const { subscribe, set, update } = projectsStorage;

    loadTimeData().then((timeData) => {
        const loadedProjectsTimeData = new Map(Object.entries(timeData));
        set(loadedProjectsTimeData);
    });

    function createProject(name: string) {
        update(projects => {
            const currentDate = new Date();
            console.log('currentDate:', currentDate);
            const newProject: ProjectData = {
                h: 0,
                m: 0,
                s: 0,
                stringRepresentation: '00:00:00',
                lastUpdateDate: currentDate.toISOString(),
                lastUpdateWeekDay: currentDate.toLocaleDateString('en-US', { weekday: 'long' }),
                periodsByDate: new Map()
            }
            projects.set(name, newProject);

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
        const projectToResume = get(projectsStorage).get(name);
        timer.resume({ timerName: name, ...projectToResume });
    }

    function updateProject(name: ProjectName, timeSpent: TimeData) {
        const existedProject = get(projectsStorage).get(name);

        const currentDate = new Date();
        const dateStringForPeriod = getDateString(currentDate);
        const isoString = currentDate.toISOString();

        const weekDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(currentDate);
        let newPeriods = new Map<Period>();
        const totalTimespent = { h: 0, m: 0, s: 0 };

        if (existedProject) {
            newPeriods = existedProject.periodsByDate;
            const existedPeriod = newPeriods.get(dateStringForPeriod);
            
            totalTimespent.h = existedProject.h;
            totalTimespent.m = existedProject.m;
            totalTimespent.s = existedProject.s;

            if (existedPeriod) {
                existedPeriod.h += timeSpent.h;
                existedPeriod.m += timeSpent.m;
                existedPeriod.s += timeSpent.s;

                if (existedPeriod.s >= 60) {
                    existedPeriod.s = existedPeriod.s - 60;
                    existedPeriod.m += 1;
                }

                if (existedPeriod.m >= 60) {
                    existedPeriod.m = existedPeriod.m - 60;
                    existedPeriod.h += 1;
                }


            } else {
                newPeriods.set(dateStringForPeriod, timeSpent);
            }
        } else {
            newPeriods = new Map([[dateStringForPeriod, timeSpent]]);
        }

        totalTimespent.h += timeSpent.h;
        totalTimespent.m += timeSpent.m;
        totalTimespent.s += timeSpent.s;

        if (totalTimespent.s >= 60) {
            totalTimespent.s = totalTimespent.s - 60;
            totalTimespent.m += 1;
        }

        if (totalTimespent.m >= 60) {
            totalTimespent.m = totalTimespent.m - 60;
            totalTimespent.h += 1;
        }

        const projectData = {
            ...totalTimespent,
            stringRepresentation: `${totalTimespent.h.toString().padStart(2, '0')}:${totalTimespent.m.toString().padStart(2, '0')}:${totalTimespent.s.toString().padStart(2, '0')}`,
            lastUpdateDate: isoString,
            lastUpdateWeekDay: weekDay,
            periodsByDate: newPeriods,
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

export const projectsArray = derived(projects, $projects => {
    console.log($projects.entries());
    const projectsArr: ProjectData[] = Array.from($projects.entries()).map(([name, project]) => ({ name, ...project }));
    return projectsArr.reverse();
});