export const getDateString = (date: Date): string => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const localeDateArr = date.toLocaleDateString(undefined, options).replace(/\//g, '-').split('-');
  const localeDateString = `${localeDateArr[2]}-${localeDateArr[1]}-${localeDateArr[0]}`;
  return localeDateString;
}