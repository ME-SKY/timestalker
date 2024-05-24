// import { readable, derived, writable, get } from 'svelte/store';
// import { loadTimeData, saveTimeData } from '../data-service/time-data-service';

// function timerStore() {
//     const timerStorage = writable({ h: 0, m: 0, s: 0, stringRepresentation: '00:00:00', state: 'stopped' as TIMER_STATE, timerName: '' as ProjectName });
//     const { subscribe, set, update } = timerStorage;

//     let interval: number | undefined = undefined;

//     function start(timerName: string | undefined) {
//         update((time) => ({ ...time, state: 'running', timerName: timerName }));

//         startInterval();
//     }

//     function pause(): TimeData {
//         clearInterval(interval);
//         interval = undefined;

//         update((time) => ({ ...time, state: 'paused' }));

//         const { h, m, s } = get(timerStorage);
//         return { h, m, s };
//     }

//     function resume(timerData?: TimerData | undefined) {
//         if(timerData !== undefined) {
//             reset();
//             update((time) => ({ ...time, state: 'running', h: timerData.h, m: timerData.m, s: timerData.s, stringRepresentation: timerData.stringRepresentation, timerName: timerData.timerName }));
//         } else {
//             update((time) => ({ ...time, state: 'running' }));
//         }

//         startInterval();
//     }

//     function reset() {
//         if (interval) {
//             clearInterval(interval);
//             interval = undefined;
//         }

//         update((time) => ({ ...time, state: 'stopped', h: 0, m: 0, s: 0, stringRepresentation: '00:00:00', timerName: '' as ProjectName }));
//     }

//     function startInterval() {
//         interval = setInterval(() => {
//             update((time) => {
//                 console.log('interval running', time.s);
//                 if (time.s === 59) {
//                     time.s = 0;
//                     if (time.m === 59) {
//                         time.m = 0;
//                         time.h++;
//                     } else {
//                         time.m++;
//                     }
//                 } else {
//                     time.s++;
//                 }
//                 time.stringRepresentation = `${time.h.toString().padStart(2, '0')}:${time.m.toString().padStart(2, '0')}:${time.s.toString().padStart(2, '0')}`;
//                 return time;
//             })
//         }, 1000);
//     }

//     return {
//         subscribe,
//         start,
//         pause,
//         resume,
//         reset,
//         update,
//         set
//     };
//     // const start = setInterval(() => {}
// }

// function projectsStore(timer) {
//     const projectsStorage = writable<Map<ProjectName, TimeData>>(new Map());
//     const { subscribe, set, update } = projectsStorage;

//     loadTimeData().then((timeData) => {
//         console.log('loaded time data', timeData);
//         const loadedProjectsTimeData = new Map(Object.entries(timeData));
//         set(loadedProjectsTimeData);
//     });

//     function createProject(name: string) {
//         update(projects => {
//             projects.set(name, { h: 0, m: 0, s: 0, stringRepresentation: '00:00:00' });
//             return projects;
//         });
//         timer.reset();
//         timer.start(name);
//     }

//     function removeProject(id: number) {
//         update(projects => {
//             projects.delete(name);
//             return projects;
//         });
//     }

//     function setProjectToTimer(name: ProjectName) {
//         const project = get(projectsStorage).get(name);
//         if (project) {
//             timer.set({
//                 h: project.h,
//                 m: project.m,
//                 s: project.s,
//                 stringRepresentation: project.stringRepresentation,
//                 state: 'paused',
//                 timerName: name
//             });
//         }
//     }

//     function resumeProject(name: ProjectName) {
//         const projectToResume = get(projectsStorage).get(name);
//         timer.resume({ timerName: name, ...projectToResume });
//     }

//     function updateProject(name: ProjectName, timeSpent: TimeData) {
//         const newTimeSpent = { ...timeSpent, stringRepresentation: `${timeSpent.h.toString().padStart(2, '0')}:${timeSpent.m.toString().padStart(2, '0')}:${timeSpent.s.toString().padStart(2, '0')}` };
//         update(projects => {
//             projects.set(name, newTimeSpent);
//             return projects;
//         });

//         saveTimeData(Object.fromEntries(get(projectsStorage)));
//     }



//     return {
//         subscribe,
//         createProject,
//         removeProject,
//         updateProject,
//         resumeProject,
//         setProjectToTimer
//     };
// }


// export const timer = timerStore();
// export const projects = projectsStore(timer);