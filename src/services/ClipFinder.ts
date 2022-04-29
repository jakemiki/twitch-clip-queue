import { Clip, ClipInfo } from '../models';
import TwitchClipProvider from './providers/twitch-clip';
import TwitchVodProvider from './providers/twitch-vod';
import YouTubeProvider from './providers/youtube';
import StreamableProvider from './providers/streamable';
import { enabledClipProviders } from '../store/user';

const providers = {
  [TwitchClipProvider.name]: TwitchClipProvider,
  [TwitchVodProvider.name]: TwitchVodProvider,
  [YouTubeProvider.name]: YouTubeProvider,
  [StreamableProvider.name]: StreamableProvider,
};

const getEnabledProviders = () => {
  return enabledClipProviders.value.split(',').map(p => p.trim());
}


const findByUrl = async (url: string): Promise<Clip | undefined> => {
  const enabledProviders = getEnabledProviders();
  for (const providerName of enabledProviders) {
    const provider = providers[providerName];
    if (!provider) {
      continue;
    }

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
  const enabledProviders = getEnabledProviders();
  for (const providerName of enabledProviders) {
    const provider = providers[providerName];
    if (!provider) {
      continue;
    }

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
