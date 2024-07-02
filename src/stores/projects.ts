import { readable, derived, writable, get, type Stores } from 'svelte/store';
import { loadTimeData, saveTimeData } from '../data-service/time-data-service';
import { timer } from '../stores/timer';
import { getDateString, mergeTimeData, subtractTimeData } from '@/helpers';


function projectsStore(timer: Stores) {
  const projectsStorage = writable(new Map());
  const { subscribe, set, update } = projectsStorage;

  loadTimeData().then((timeData) => {
    const loadedProjectsTimeData = new Map(Object.entries(timeData));
    loadedProjectsTimeData.forEach((project, name) => {
      // @ts-ignore TODO: figure out later
      project.periodsByDate = new Map(Object.entries(project.periodsByDate));
    })
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
        // lastUpdateWeekDay: currentDate.toLocaleDateString('en-US', { weekday: 'long' }),
        periodsByDate: new Map()
      }
      projects.set(name, newProject);

      return projects;
    });
    // @ts-ignore TODO: figure out later
    timer.reset();
    // @ts-ignore TODO: figure out later
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
    const periodToResume = projectToResume.periodsByDate?.get(getDateString(new Date()));

    if (periodToResume) {
      timer.resume({ ...periodToResume, timerName: name });
    } else {
      timer.resume({ timerName: name, h: 0, m: 0, s: 0, stringRepresentation: '00:00:00' });
    }
  }

  function updateProject(name: ProjectName, timeSpent: TimeData) {
    //TODO: add case when timer started in one date and then stopped in another - laaaaaater
    const existedProject = get(projectsStorage).get(name);

    const currentDate = new Date();
    const dateStringForPeriod = getDateString(currentDate);
    const isoString = currentDate.toISOString();

    const weekDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(currentDate);
    let newPeriods = new Map<Period>();
    let totalTimespent = { h: 0, m: 0, s: 0 };
    let periodTimeSpent = timeSpent;

    if (existedProject) {
      newPeriods = existedProject.periodsByDate;
      const existedPeriod = newPeriods.get(dateStringForPeriod);
      totalTimespent.h = existedProject.h;
      totalTimespent.m = existedProject.m;
      totalTimespent.s = existedProject.s;

      if (existedPeriod) {
        if (existedPeriod.h < timeSpent.h || existedPeriod.m < timeSpent.m || existedPeriod.s < timeSpent.s) {
          const difference = subtractTimeData(existedPeriod, timeSpent);
          totalTimespent = mergeTimeData(totalTimespent, difference);
        }
      } else {
        console.log('totalTimespent before:', totalTimespent);
        totalTimespent = mergeTimeData(totalTimespent, timeSpent);
        console.log('totalTimespent after:', totalTimespent);
      }
    }

    newPeriods.set(dateStringForPeriod, periodTimeSpent);
    periodTimeSpent.stringRepresentation = `${periodTimeSpent.h.toString().padStart(2, '0')}:${periodTimeSpent.m.toString().padStart(2, '0')}:${periodTimeSpent.s.toString().padStart(2, '0')}`

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

    const data = Object.fromEntries(get(projectsStorage))

    saveTimeData(data);
  }

  function recalculateTimeSpent(periods: Map<Period>): TimeData {
    return periods.entries().reduce((acc, [_, period]) => mergeTimeData(acc, period), { h: 0, m: 0, s: 0 });
  }

  function toggleProject(projectName: ProjectName) {
    console.log(timer.timerName);
    const timerName = get(timer).timerName;
    const timerState = get(timer).state;
    const projects = get(projectsStorage);

    console.log('timerName', timerName, 'timerState', timerState, 'projectName', projectName);
    
    if (timerName === projectName) {
      console.log('timerName === projectName');
      
      if (timerState === 'running') {
        console.log('timerName === running');
        updateProject(timerName, timer.pause());
      } else {
        console.log('timerName !== running');
        resumeProject(timerName);
      }
    } else {
      console.log('timerName !== projectName');
      if (timerName !== '') {
        if (projects.has(timerName)) {
          updateProject(timerName, timer.pause());
        }
      }
      console.log('resume');

      resumeProject(projectName);
    }
  }


  return {
    subscribe,
    createProject,
    removeProject,
    updateProject,
    resumeProject,
    setProjectToTimer,
    toggleProject
  };
}

export const projects = projectsStore(timer);

export const projectsArray = derived(projects, $projects => {
  const projectsArr: ProjectData[] = Array.from($projects.entries()).map(([name, project]) => ({ name, ...project }));
  return projectsArr.reverse();
});