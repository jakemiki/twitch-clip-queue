import { Clip, ClipInfo } from '../models';
import TwitchClipProvider from './providers/twitch-clip';
import TwitchVodProvider from './providers/twitch-vod';
import YouTubeProvider from './providers/youtube';
import StreamableProvider from './providers/streamable';
import { createLogger } from '../common/logging';

const logger = createLogger('Clip Finder');

const enabledProviders = process.env.REACT_APP_CLIP_PROVIDERS?.split(',');
const providers = [TwitchClipProvider, TwitchVodProvider, YouTubeProvider, StreamableProvider].filter((provider) =>
  enabledProviders?.includes(provider.name)
);

logger.debug('Enabled providers:', enabledProviders);

const findByUrl = async (url: string): Promise<Clip | undefined> => {
  for (const provider of providers) {
    if (!provider.canHandle(url)) {
      continue;
    }

    const clip = await provider.tryGetClip(url);

    if (clip) {
      clip.hash = Date.now().toString();
      return clip;
    }
  }

  return undefined;
};

const getInfoByUrl = (url: string): ClipInfo | undefined => {
  for (const provider of providers) {
    const clipInfo = provider.getInfo(url);

    if (clipInfo) {
      return clipInfo;
    }
  }

  return undefined;
};

const ClipFinder = {
  findByUrl,
  getInfoByUrl,
};

export default ClipFinder;
