import { readable, derived, writable, get } from 'svelte/store';
import { projects } from '../stores/projects';
import { getDateString } from '@/helpers';

interface ActivityHistory { //fix types later
  date?: any;
  score: any;
  weekScore?: string | undefined;
  weekDay?: string | undefined;
  lastProjects: any [];
}

interface DayHistory {
  date: string,
  score: TimeData,
  projects: ProjectData [],
}

function activityHistoryStore() {
  const activityHistoryStorage = derived(projects, $projects => {

    const historyObject: ActivityHistory = {
      date: undefined,
      score: { h: 0, m: 0, s: 0 },
      weekScore: undefined, //TODO: add
      weekDay: undefined, //TODO: add
      lastProjects: []
    };

    if ($projects.size === 0) { return historyObject; }

    let latestDate = '';
    let latestWeekDay = '';
    const projs = Array.from($projects.entries());

    const dateGroups = projs.reduce((acc, [name, projectData]) => {
      const date = new Date(projectData.lastUpdateDate);
      const localeDateString = getDateString(date);

      const existingGroup = acc.get(localeDateString);

      console.log('localeDateString:', localeDateString);
      if (existingGroup) {
        console.log('on existingGroup', projectData.s);
        existingGroup.push({ ...projectData, name: name });
      } else {
      // if (!existingGroup) {
        console.log('else: ', projectData.s);
        acc.set(localeDateString, [{ ...projectData, name: name }]);
      }

      if (latestDate.length) {
        latestDate = new Date(localeDateString) > new Date(latestDate) ? localeDateString : latestDate;
        latestWeekDay = projectData.lastUpdateWeekDay > latestWeekDay ? projectData.lastUpdateWeekDay : latestWeekDay;
      } else {
        latestWeekDay = projectData.lastUpdateWeekDay;
        latestDate = localeDateString;
      }

      console.log('acc', acc);
      return acc;
    }, new Map<string, Project[]>());

    const latestGroup = dateGroups.get(latestDate);

    const calculatedScore = latestGroup.reduce((acc, project) => {
      acc.s += project.s;
      acc.m += project.m;
      acc.h += project.h;

      if (acc.s >= 60) {
        acc.s = acc.s - 60;
        acc.m += 1;
      }

      if (acc.m >= 60) {
        acc.m = acc.m - 60;
        acc.h += 1;
      }

      return { h: acc.h, m: acc.m, s: acc.s };
    }, { h: 0, m: 0, s: 0 });

    const latestDateParts = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).formatToParts(new Date(latestDate));
    const formattedDate = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' }).format(new Date(latestDate));

    console.log('formattedDate', formattedDate);
    console.log('latestDate', latestDate);
    console.log('latestGroup', latestGroup);

    historyObject.score = {
      ...calculatedScore
    };
    historyObject.date = {
      itselfString: latestDate,
      short: `${latestDateParts[2].value} ${latestDateParts[0].value}`
    };
    historyObject.weekDay = latestWeekDay;
    console.log('latestGroup', latestGroup);

    historyObject.lastProjects = latestGroup.reverse().slice(0, 6);

    if (historyObject.lastProjects.length > 0) {
      console.log(typeof historyObject.lastProjects);
      console.log('sure its array');
    }

    console.log('historyObject.lastProjects', historyObject.lastProjects);

    return historyObject;
  });

  const { subscribe } = activityHistoryStorage;

  return {
    subscribe
  }
}

export const activityHistory = activityHistoryStore();

