import { Clip, Provider } from '../../models';
import { getGameName } from '../../store/dictionaries';
import { getMemorizedClip } from '../../store/queue';
import TwitchApi from '../TwitchApi';

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
    const uri = new URL(url);
    if (!canHandle(url)) {
      return;
    }

    const idStart = uri.pathname.lastIndexOf('/');
    const id = uri.pathname.slice(idStart).split('?')[0].slice(1);

    const fromMemory = getMemorizedClip({
      provider: 'twitch-clip',
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
        provider: 'twitch-clip',
        thumbnailUrl: clipInfo.thumbnail_url,
        title: clipInfo.title,
      };
    }
  } catch {}
};

const TwitchClipProvider: Provider = {
  canHandle,
  tryGetClip,
};

export default TwitchClipProvider;
