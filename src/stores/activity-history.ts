import { readable, derived, writable, get } from 'svelte/store';
// import { loadTimeData, saveTimeData } from '../data-service/time-data-service';
import { projects } from '../stores/projects';

interface ActivityHistory {
  date?: string | undefined;
  dayScore: TimeData ;
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
            dayScore: undefined,
            weekScore: undefined,
            weekDay: undefined,
            weekDayShort: undefined
        };

        let latestDate = '';
        const dateGroups = Array.from($projects.entries()).reduce((acc, [name, projectData]) => {
            const date = projectData.lastUpdateDate;
            const existingGroup = acc.get(date);
            if (existingGroup) {
                existingGroup.push(projectData);
            } else {
                acc.set(date, [projectData]);
            }

            if(latestDate.length) {
              latestDate = new Date(date) > new Date(latestDate) ? date : latestDate;
            } else {
              latestDate = date;
            }


            return acc;
        }, new Map<string, Project[]>());

        // const latestDate = Array.from(dateGroups.keys()).reduce<string>((acc, date) => {
        //     return new Date(date) > new Date(acc) ? date : acc;
        // }, dateGroups.keys().next().value);

        const latestGroup = dateGroups.get(latestDate);
        console.log('latestDate', latestDate);
        console.log('latestGroup', latestGroup);

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
            return acc;
        })

        historyObject.dayScore = calculatedDayScore;


        // const latestProject = latestGroup && latestGroup.length > 0 ? latestGroup[0] : undefined;

        // if (latestProject) {
        //     historyObject.lastUpdateDate = latestProject.lastUpdateDate;
        // }

        return historyObject;
      });

    const { subscribe, set, update } = activityHistoryStorage;

    return {
        subscribe,
    }
}

export const activityHistory = activityHistoryStore();

