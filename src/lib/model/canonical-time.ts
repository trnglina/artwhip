import * as chrono from 'chrono-node';
import { format, parse } from 'date-fns';

export const formatCanonicalTime = (date: Date): string => format(date, 'HH:mm:ss');
export const parseCanonicalTime = (time: string, reference: Date): Date => parse(time, 'HH:mm:ss', reference);

export const makeCanonicalTime = (time: string | null, reference: Date): string => {
  const fallback = formatCanonicalTime(reference);
  if (time === null || time === '') return fallback;

  const parsed = chrono.parseDate(time, reference);
  if (parsed === null) return fallback;

  return formatCanonicalTime(parsed);
};
