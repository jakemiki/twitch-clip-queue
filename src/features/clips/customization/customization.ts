import { formatISO, isFriday } from 'date-fns';
import type { AppMiddlewareAPI } from '../../../app/store';
import { currentClipForceReplaced } from '../clipQueueSlice';

export function applyCustomizations(storeApi: AppMiddlewareAPI) {
  const {
    settings: { channel },
  } = storeApi.getState();

  const now = new Date();

  switch (channel?.toLowerCase()) {
    case 'wolfabelle': {
      if (isFriday(now)) {
        storeApi.dispatch(
          currentClipForceReplaced({
            title: 'ITS FRIDAY THEN, ITS SATURDAY, SUNDAY! GO MUFASA!',
            author: 'MUFASA',
            id: 'youtube:1TewCPi92ro',
            thumbnailUrl: 'https://i.ytimg.com/vi/1TewCPi92ro/hqdefault.jpg',
            submitters: ['TriPls'],
            timestamp: formatISO(now),
            status: 'watched',
          })
        );
      }
    }
  }
}
