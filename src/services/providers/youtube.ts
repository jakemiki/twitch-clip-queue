import { Clip, Provider } from '../../models';
import { getMemorizedClip } from '../../store/queue';
import YoutubeApi from '../YoutubeApi';

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
    const uri = new URL(url);
    if (!canHandle(url)) {
      return;
    }

    let id: string | undefined = undefined;
    if (uri.hostname === 'youtu.be' || uri.pathname.includes('shorts')) {
      const idStart = uri.pathname.lastIndexOf('/') + 1;
      id = uri.pathname.slice(idStart).split('?')[0];
    } else if (uri.hostname.endsWith('youtube.com')) {
      id = uri.searchParams.get('v') ?? undefined;
    }

    if (!id) {
      return;
    }

    const startTime = uri.searchParams.get('t') ?? undefined;

    const fromMemory = getMemorizedClip({
      provider: 'youtube',
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
      startTime: startTime?.replace(/[^0-9]/g, ''),
    };
  } catch {}
};

const YouTubeProvider: Provider = {
  canHandle,
  tryGetClip,
};

export default YouTubeProvider;
