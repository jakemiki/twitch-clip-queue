import { createLogger } from '../../common/logging';
import { Clip, ClipInfo, Provider } from '../../models';
import { getMemorizedClip } from '../../store/queue';
import YoutubeApi from '../YoutubeApi';

const providerName = 'youtube';
const logger = createLogger(`${providerName} provider`);

const canHandle = (url: string): boolean => {
  const uri = new URL(url);
  if (uri.hostname === 'youtu.be') {
    return true;
  }

  if (uri.hostname.endsWith('youtube.com')) {
    return true;
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

    const clipInfo = await YoutubeApi.getClip(id);

    return {
      id,
      channel: clipInfo?.author_name ?? 'YouTube',
      thumbnailUrl: clipInfo?.thumbnail_url ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      provider: 'youtube',
      title: clipInfo?.title ?? id,
      startTime,
    };
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

    let id: string | undefined = undefined;
    if (uri.hostname === 'youtu.be' || uri.pathname.includes('shorts')) {
      const idStart = uri.pathname.lastIndexOf('/') + 1;
      id = uri.pathname.slice(idStart).split('?')[0];
    } else if (uri.hostname.endsWith('youtube.com')) {
      id = uri.searchParams.get('v') ?? undefined;
    }

    if (!id) {
      return undefined;
    }


    const startTime = uri.searchParams.get('t') ?? undefined;

    return {
      id,
      provider: providerName,
      startTime
    }
  } catch(e) {
    logger.error('getInfo', e);
  }
};

const YouTubeProvider: Provider = {
  canHandle,
  tryGetClip,
  getInfo,
};

export default YouTubeProvider;
