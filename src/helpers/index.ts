const MONTHS_BY_NUMBER: { [key: number]: { long: string, short: string } } = {
  1: { long: 'January', short: 'Jan' },
  2: { long: 'February', short: 'Feb' },
  3: { long: 'March', short: 'Mar' },
  4: { long: 'April', short: 'Apr' },
  5: { long: 'May', short: 'May' },
  6: { long: 'June', short: 'Jun' },
  7: { long: 'July', short: 'Jul' },
  8: { long: 'August', short: 'Aug' },
  9: { long: 'September', short: 'Sep' },
  10: { long: 'October', short: 'Oct' },
  11: { long: 'November', short: 'Nov' },
  12: { long: 'December', short: 'Dec' },
};

export const getDateString = (date: Date): string => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const localeDateArr = date.toLocaleDateString(undefined, options as any).replace(/\//g, '-').split('-'); //any here cause i dont wanna do a typescipt jymnastics
  const localeDateString = `${localeDateArr[2]}-${localeDateArr[1]}-${localeDateArr[0]}`;
  return localeDateString;
}

export const dayWithMonth = (dateString: string): string => { 
  const month = dateString.split('-')[1];
  const day = dateString.split('-')[2];
  return `${day} ${MONTHS_BY_NUMBER[Number(month)].short}`;
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
  let h = 0, m = 0, s = 0;

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

export const subtractTimeData = (subtractTimeData: TimeData, fromTimeData: TimeData): TimeData => {
  let h = 0, m = 0, s = 0;

  h = fromTimeData.h - subtractTimeData.h;
  m = fromTimeData.m - subtractTimeData.m;
  s = fromTimeData.s - subtractTimeData.s;


  // 1 - 0, 20 - 59, 30 - 59

  if ( m < 0 ) {
    h -= 1;
    m = 60 + m;
  }

  if ( s < 0 ) {
    m -= 1;
    s = 60 + s;
  }

  return { h, m, s };
}