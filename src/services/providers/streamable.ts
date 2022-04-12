import { createLogger } from '../../common/logging';
import { Clip, ClipInfo, Provider } from '../../models';
import { getMemorizedClip } from '../../store/queue';
import StreamableApi from '../StreamableApi';

const providerName = 'streamable';
const logger = createLogger(`${providerName} provider`);

const canHandle = (url: string): boolean => {
  const uri = new URL(url);
  if (uri.hostname.endsWith('streamable.com')) {
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

    const clipInfo = await StreamableApi.getClip(id);

    return {
      id,
      channel: clipInfo?.author_name ?? 'Streamable',
      thumbnailUrl: clipInfo?.thumbnail_url,
      provider: providerName,
      title: clipInfo?.title ?? id,
      startTime,
    };
  } catch (e) {
    logger.error('tryGetClip', e);
  }
};

const getInfo = (url: string): ClipInfo | undefined => {
  try {
    const uri = new URL(url);
    if (!canHandle(url)) {
      return undefined;
    }

    const idStart = uri.pathname.lastIndexOf('/') + 1;
    let id = uri.pathname.slice(idStart).split('?')[0];

    if (!id) {
      return undefined;
    }

    return {
      id,
      provider: providerName,
    };
  } catch (e) {
    logger.error('getInfo', e);
  }
};

const StreamableProvider: Provider = {
  canHandle,
  tryGetClip,
  getInfo,
  name: providerName,
};

export default StreamableProvider;
