import { createLogger } from '../../common/logging';

const logger = createLogger('Umami Event');

export function trace(value: string, type = 'custom') {
  const umami = (window as any).umami;
  logger.debug(`${type}: ${value}`);

  try {
    if (umami) {
      if (type === 'view') {
        umami.trackView(`${process.env.REACT_APP_BASEPATH}${value}`);
      } else {
        umami.trackEvent(value, type);
      }
    }
  } catch {}
}
