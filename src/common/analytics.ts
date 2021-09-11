import { createLogger } from "./logging";

const logger = createLogger('Umami Event');

const umami = (window as any).umami;
const eventQueue: { type: string; value: string; }[] = [];

export function trace(value: string, type = 'custom') {
  logger.debug(`${type}: ${value}`);

  eventQueue.push({ type, value });

  if (umami) {
    let e;

    // eslint-disable-next-line
    while (e = eventQueue.shift()) {
      umami.trackEvent(e.value, e.type);
    }
  }
}
