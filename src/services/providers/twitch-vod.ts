import { createLogger } from '../../common/logging';
import { Clip, ClipInfo, Provider } from '../../models';
import { getMemorizedClip } from '../../store/queue';
import TwitchApi from '../TwitchApi';

const providerName = 'twitch-vod';
const logger = createLogger(`${providerName} provider`);

const canHandle = (url: string): boolean => {
  const uri = new URL(url);
  if (uri.hostname.endsWith('twitch.tv')) {
    if (uri.pathname.includes('/videos/')) {
      return true;
    }
    if (uri.pathname.includes('/video/')) {
      return true;
    }
  }

  return false;
};

const tryGetClip = async (url: string): Promise<Clip | undefined> => {
  try {
    const { id, startTime } = getInfo(url) ?? {};

    if (!id) {
      return;
    }

    const fromMemory = getMemorizedClip({
      provider: providerName,
      id,
    });

    if (fromMemory) {
      return { ...fromMemory };
    }

    const clipInfo = await TwitchApi.getVideo(id);

    if (clipInfo) {
      return {
        id,
        channel: clipInfo.user_name,
        provider: providerName,
        thumbnailUrl: clipInfo.thumbnail_url.replace('%{width}x%{height}', '480x272'),
        title: clipInfo.title,
        startTime: startTime,
        timestamp: clipInfo.created_at,
      };
    }
  } catch(e) {
    logger.error('tryGetClip', e);
  }
};

const getInfo = (url: string): ClipInfo | undefined => {
  try {
    const uri = new URL(url);
    if (!canHandle(url)) {
      return undefined;
    }

    const idStart = uri.pathname.lastIndexOf('/');
    const id = uri.pathname.slice(idStart).split('?')[0].slice(1);
    const startTime = uri.searchParams.get('t');

    if (!startTime) {
      return undefined;
    }

    return {
      id,
      provider: providerName,
      startTime,
    }
  } catch(e) {
    logger.error('getInfo', e);
  }
};

const TwitchVodProvider: Provider = {
  canHandle,
  tryGetClip,
  getInfo,
};

export default TwitchVodProvider;
