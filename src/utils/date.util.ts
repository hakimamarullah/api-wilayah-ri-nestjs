import * as moment from 'moment-timezone';

export const getZonedDateTime = (): Date => {
  moment.tz.setDefault('Asia/Jakarta');
  return new Date(moment.now().valueOf());
};
