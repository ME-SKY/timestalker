import { readable, derived, writable, get } from 'svelte/store';
// import { loadTimeData, saveTimeData } from '../data-service/time-data-service';
import { projects } from '../stores/projects';

interface ActivityHistory {
  date?: string | undefined;
  dayScore: TimeData;
  weekScore?: string | undefined;
  weekDay?: string | undefined;
  weekDayShort?: string | undefined;
}

// const activityHistoryStorage = derived(projects, $projects => {
//   const historyObject: ActivityHistory = {
//       date: undefined,
//       dayScore: undefined,
//       weekScore: undefined,
//       weekDay: undefined,
//       weekDayShort: undefined
//   };
//   $projects.forEach((project, name) => {
//       if (new Date(project.lastUpdateDate) > new Date(lastUpdatedObject.lastUpdateDate)) {
//           lastUpdatedObject.lastUpdateDate = project.lastUpdateDate;
//       }
//   });
//   return lastUpdatedObject;
// });

function activityHistoryStore() {
  const activityHistoryStorage = derived(projects, $projects => {
    const historyObject: ActivityHistory = {
      date: undefined,
      dayScore: {h: 0, m: 0, s: 0},
      weekScore: undefined,
      weekDay: undefined,
      weekDayShort: undefined
    };

    if ($projects.size === 0) { return historyObject; }

    let latestDate = '';
    const projs = Array.from($projects.entries());
    console.log('projs', projs);
    const dateGroups = projs.reduce((acc, [name, projectData]) => {
      const date = projectData.lastUpdateDate.split('T')[0];


      const existingGroup = acc.get(date);
      if (existingGroup) {
        existingGroup.push(projectData);
      } else {
        acc.set(date, [projectData]);
      }

      if (latestDate.length) {
        latestDate = new Date(date) > new Date(latestDate) ? date : latestDate;
      } else {
        latestDate = date;
      }


      return acc;
    }, new Map<string, Project[]>());

    // const latestDate = Array.from(dateGroups.keys()).reduce<string>((acc, date) => {
    //     return new Date(date) > new Date(acc) ? date : acc;
    // }, dateGroups.keys().next().value);

    dateGroups.forEach((group, date) => {
      console.log('date from DateGROUPS', date);
    })
    const latestGroup = dateGroups.get(latestDate);

    if (latestGroup) {
      console.log('latestGroup', latestGroup);
      // historyObject.date = latestDate;
      // historyObject.dayScore = latestGroup.reduce((acc, project) => {
      // acc.s += project.s;
      // acc.m += project.m;
    }
    console.log('latestDate', latestDate);
    // 

    const calculatedDayScore = latestGroup.reduce((acc, project) => {
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
        // acc.h += project.h;
        // acc.m += project.m;
        // acc.s += project.s;
        return {h: acc.h, m: acc.m, s: acc.s};
    })

    console.log('calculatedDayScore', calculatedDayScore);

    historyObject.dayScore = calculatedDayScore;


    // const latestProject = latestGroup && latestGroup.length > 0 ? latestGroup[0] : undefined;

    // if (latestProject) {
    //     historyObject.lastUpdateDate = latestProject.lastUpdateDate;
    // }

    return historyObject;
  });

  const { subscribe } = activityHistoryStorage;

  return {
    subscribe
  }
}

export const activityHistory = activityHistoryStore();

