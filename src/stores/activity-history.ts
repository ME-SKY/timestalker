import { readable, derived, writable, get } from 'svelte/store';
import { projects } from '../stores/projects';
import { getDateString, mergeTimeData } from '@/helpers';

interface ActivityHistory { //fix types later
  lastDate?: any;
  // date?: any;
  totalScore: any;
  histories: DayHistory[];
  // weekScore?: string | undefined;
  // weekDay?: string | undefined;
  // lastProjects: any [];
}



function activityHistoryStore() {
  const activityHistoryStorage = derived(projects, $projects => {

    console.log('projects', $projects);

    const historyObject: ActivityHistory = {
      lastDate: undefined,
      totalScore: { h: 0, m: 0, s: 0 },
      histories: []
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

    // const latestGroup = dateGroups.get(latestDate);

    const dateGroupsArray = Array.from(dateGroups.entries()).map(([date, projects]) => {

      console.log('date', date);
      const score = projects.reduce((acc, project) => {
        // @ts-ignore
        const periodTime = project.periodsByDate?.get(date);//TODO: what is wrong here?
        return periodTime ? mergeTimeData(acc, { h: periodTime.h, m: periodTime.m, s: periodTime.s }) : acc;
      }, { h: 0, m: 0, s: 0 });

      return { date, projects, score };
    });

    console.log('latestdate', latestDate);

    const latestDateParts = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).formatToParts(new Date(latestDate));

    historyObject.lastDate = {
      itselfString: latestDate,
      short: `${latestDateParts[2].value} ${latestDateParts[0].value}`
    };
   
    historyObject.histories = dateGroupsArray.slice(-6); //6 - is standart short quantity of histories

    return historyObject;
  });

  const { subscribe } = activityHistoryStorage;

  return {
    subscribe
  }
}

export const activityHistory = activityHistoryStore();

