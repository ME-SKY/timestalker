import { readable, derived, writable, get } from 'svelte/store';
import { projects } from '../stores/projects';
import { getDateString } from '@/helpers';

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
      const date = new Date(projectData.lastUpdateDate);
      const localeDateString = getDateString(date);

      const existingGroup = acc.get(localeDateString);

      if (existingGroup) {
        existingGroup.push({ ...projectData, name: name });
      } else {
        acc.set(localeDateString, [{ ...projectData, name: name }]);
      }

      if (latestDate.length) {
        latestDate = new Date(localeDateString) > new Date(latestDate) ? localeDateString : latestDate;
        latestWeekDay = projectData.lastUpdateWeekDay > latestWeekDay ? projectData.lastUpdateWeekDay : latestWeekDay;
      } else {
        latestWeekDay = projectData.lastUpdateWeekDay;
        latestDate = localeDateString;
      }

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
    })

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

    return historyObject;
  });

  const { subscribe } = activityHistoryStorage;

  return {
    subscribe
  }
}

export const activityHistory = activityHistoryStore();

