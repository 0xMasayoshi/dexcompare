export function sum(array: any[]) {
  if (!array) return undefined;
  return array.reduce((sum, cur) => (sum += cur === Infinity ? 0 : cur), 0);
}

export function average(array: any[]) {
  if (!array) return undefined;
  return (
    array.reduce((sum, cur) => (sum += cur === Infinity ? 0 : cur), 0) /
    array.length
  );
}

export function median(array: any[]) {
  if (!array) return undefined;
  const mid = array.length / 2;
  const sortedArray = [...array].sort((a, b) => a - b);

  return sortedArray.length % 2 !== 0 ? sortedArray[mid] : sortedArray[mid - 1];
}
