import { readable, derived, writable, get } from 'svelte/store';
import { projects } from '../stores/projects';

interface ActivityHistory { //fix types later
  date?: any;
  score: any;
  weekScore?: string | undefined;
  weekDay?: string | undefined;
}

function activityHistoryStore() {
  const activityHistoryStorage = derived(projects, $projects => {

    const historyObject: ActivityHistory = {
      date: undefined,
      score: { h: 0, m: 0, s: 0 },
      weekScore: undefined, //TODO: add
      weekDay: undefined, //TODO: add
    };

    if ($projects.size === 0) { return historyObject; }

    let latestDate = '';
    let latestWeekDay = '';
    const projs = Array.from($projects.entries());

    const dateGroups = projs.reduce((acc, [name, projectData]) => {
      const date = projectData.lastUpdateDate.split('T')[0];
      const existingGroup = acc.get(date);

      if (existingGroup) {
        existingGroup.push({ ...projectData, name: name });
      } else {
        acc.set(date, [{ ...projectData, name: name }]);
      }

      if (latestDate.length) {
        latestDate = new Date(date) > new Date(latestDate) ? date : latestDate;
        latestWeekDay = projectData.lastUpdateWeekDay > latestWeekDay ? projectData.lastUpdateWeekDay : latestWeekDay;
      } else {
        latestWeekDay = projectData.lastUpdateWeekDay;
        latestDate = date;
      }

      return acc;
    }, new Map<string, Project[]>());

    const latestGroup = dateGroups.get(latestDate);

    const calculatedScore = latestGroup.reduce((acc, project) => {
      acc.s += project.s;
      acc.m += project.m;

      if (acc.s >= 60) {
        acc.s = acc.s - 60;
        acc.m += 1;
      }

      if (acc.m >= 60) {
        acc.m = acc.m - 60;
        acc.h += 1;
      }

      return { h: acc.h, m: acc.m, s: acc.s };
    })

    const latestDateParts = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).formatToParts(new Date(latestDate));
    const formattedDate = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' }).format(new Date(latestDate));

    historyObject.score = {
      ...calculatedScore
    };
    historyObject.date = {
      itselfString: latestDate,
      short: `${latestDateParts[2].value} ${latestDateParts[0].value}`
    };
    historyObject.weekDay = latestWeekDay;

    return historyObject;
  });

  const { subscribe } = activityHistoryStorage;

  return {
    subscribe
  }
}

export const activityHistory = activityHistoryStore();

