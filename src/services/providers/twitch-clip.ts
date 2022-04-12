import { createLogger } from '../../common/logging';
import { Clip, ClipInfo, Provider } from '../../models';
import { getGameName } from '../../store/dictionaries';
import { getMemorizedClip } from '../../store/queue';
import TwitchApi from '../TwitchApi';

const providerName = 'twitch-clip';
const logger = createLogger(`${providerName} provider`);

const canHandle = (url: string): boolean => {
  const uri = new URL(url);
  if (uri.hostname === 'clips.twitch.tv') {
    return true;
  }

  if (uri.hostname.endsWith('twitch.tv')) {
    if (uri.pathname.includes('/clip/')) {
      return true;
    }
  }

  return false;
};

const tryGetClip = async (url: string): Promise<Clip | undefined> => {
  try {
    const { id } = getInfo(url) ?? {};

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

    const clipInfo = await TwitchApi.getClip(id);

    if (clipInfo) {
      return {
        id,
        channel: clipInfo.broadcaster_name,
        game: await getGameName(clipInfo.game_id),
        provider: providerName,
        thumbnailUrl: clipInfo.thumbnail_url,
        videoUrl: clipInfo.thumbnail_url.split('-preview-')[0] + '.mp4',
        title: clipInfo.title,
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

    return {
      id,
      provider: providerName,
    }
  } catch(e) {
    logger.error('getInfo', e);
  }
};

const TwitchClipProvider: Provider = {
  canHandle,
  tryGetClip,
  getInfo,
  name: providerName,
};

export default TwitchClipProvider;
