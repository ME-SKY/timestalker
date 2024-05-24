import { readable, derived, writable, get } from 'svelte/store';
import { loadTimeData, saveTimeData } from '../data-service/time-data-service';
import { timer } from '../stores/timer';

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
      const projectToResume = get(projectsStorage).get(name);
      timer.resume({ timerName: name, ...projectToResume });
  }

  function updateProject(name: ProjectName, timeSpent: TimeData) {
      const newTimeSpent = { ...timeSpent, stringRepresentation: `${timeSpent.h.toString().padStart(2, '0')}:${timeSpent.m.toString().padStart(2, '0')}:${timeSpent.s.toString().padStart(2, '0')}` };
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
      updateProject,
      resumeProject,
      setProjectToTimer
  };
}

export const projects = projectsStore(timer);