export function timestampUtcToDate(timestamp: any) {
  return new Date(new Date(timestamp).toUTCString().replace(/GMT.*/g, ""));
}
