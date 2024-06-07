export const getDateString = (date: Date): string => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const localeDateArr = date.toLocaleDateString(undefined, options).replace(/\//g, '-').split('-');
  const localeDateString = `${localeDateArr[2]}-${localeDateArr[1]}-${localeDateArr[0]}`;
  return localeDateString;
}


/**
 * Merges two time data objects by adding the seconds, minutes, and hours together.
 * If the resulting seconds exceed 60, it subtracts 60 from the seconds and increments the minutes.
 * If the resulting minutes exceed 60, it subtracts 60 from the minutes and increments the hours.
 *
 * m,s in timeData params can't be greater than 59, othervise it woulnt work!
 * 
 * @param {TimeData} timeData1 - The first time data object to merge.
 * @param {TimeData} timeData2 - The second time data object to merge.
 * @return {TimeData} The merged time data object.
 */
export const mergeTimeData = (timeData1: TimeData, timeData2: TimeData): TimeData => {
  const h, m, s = 0;

  h = timeData1.h + timeData2.h;
  m = timeData1.m + timeData2.m;
  s = timeData1.s + timeData2.s;
  
  if (s >= 60) {
    s = s - 60;
    m += 1;
  }

  if (m >= 60) {
    m = m - 60;
    h += 1;
  }

  return { h, m, s };
}