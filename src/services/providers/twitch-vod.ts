import { Clip, Provider } from '../../models';
import { getMemorizedClip } from '../../store/queue';
import TwitchApi from '../TwitchApi';

const canHandle = (url: string): boolean => {
  const uri = new URL(url);
  if (uri.hostname.endsWith('twitch.tv')) {
    if (uri.pathname.includes('/videos/')) {
      return true;
    }
  }

  return false;
};

const tryGetClip = async (url: string): Promise<Clip | undefined> => {
  try {
    const uri = new URL(url);
    if (!canHandle(url)) {
      return;
    }

    const idStart = uri.pathname.lastIndexOf('/');
    const id = uri.pathname.slice(idStart).split('?')[0].slice(1);

    const fromMemory = getMemorizedClip({
      provider: 'twitch-vod',
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
        provider: 'twitch-vod',
        thumbnailUrl: clipInfo.thumbnail_url.replace('%{width}x%{height}', '480x272'),
        title: clipInfo.title,
        startTime: uri.searchParams.get('t') ?? undefined,
      };
    }
  } catch {}
};

const TwitchVodProvider: Provider = {
  canHandle,
  tryGetClip,
};

export default TwitchVodProvider;
