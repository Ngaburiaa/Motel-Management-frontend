export const getDaysBetween = (start: string | Date, end: string | Date): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
};
