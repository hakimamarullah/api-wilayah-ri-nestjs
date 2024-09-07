import { SetMetadata } from '@nestjs/common';

export const NO_THROTTLE = 'no-throttle';
export const NoThrottle = () => SetMetadata(NO_THROTTLE, true);
