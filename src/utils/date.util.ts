import moment from 'moment-timezone';

export const getZonedDateTime = (date: Date): Date => {
  return moment.tz(date, 'Asia/Jakarta').toDate();
};
