import { Clip } from '../models';
import TwitchClipProvider from './providers/twitch-clip';
import TwitchVodProvider from './providers/twitch-vod';
import YouTubeProvider from './providers/youtube';

const providers = [TwitchClipProvider, TwitchVodProvider, YouTubeProvider];

const findByUrl = async (url: string): Promise<Clip | undefined> => {
  for (const provider of providers) {
    if (!provider.canHandle(url)) {
      continue;
    }

    const clip = await provider.tryGetClip(url);

    if (clip) {
      return clip;
    }
  }

  return undefined;
};

const ClipFinder = {
  findByUrl,
};

export default ClipFinder;
