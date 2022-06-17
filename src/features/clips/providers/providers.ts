import { createLogger } from '../../../common/logging';
import { Clip } from '../clipQueueSlice';
import streamableProvider from './streamable/streamableProvider';
import twitchClipProvider from './twitchClip/twitchClipProvider';
import twitchVodProvider from './twitchVod/twitchVodProvider';
import youtubeProvider from './youtube/youtubeProvider';

const logger = createLogger('CombinedClipProvider');

export interface ClipProvider {
  name: string;
  getIdFromUrl(url: string): string | undefined;
  getClipById(id: string): Promise<Clip | undefined>;
  getUrl(id: string): string | undefined;
  getEmbedUrl(id: string): string | undefined;
  getAutoplayUrl(id: string, clip: Clip): string | undefined;
}

class CombinedClipProvider implements ClipProvider {
  name = 'combined';
  providers = {
    [twitchClipProvider.name]: twitchClipProvider,
    [twitchVodProvider.name]: twitchVodProvider,
    [youtubeProvider.name]: youtubeProvider,
    [streamableProvider.name]: streamableProvider,
  };
  enabledProviders: string[] = [];

  getIdFromUrl(url: string): string | undefined {
    for (const providerName of this.enabledProviders) {
      const provider = this.providers[providerName];
      if (provider) {
        const id = provider.getIdFromUrl(url);
        if (id) {
          return `${provider.name}:${id}`;
        }
      }
    }
    return undefined;
  }

  async getClipById(id: string): Promise<Clip | undefined> {
    const [provider, idPart] = this.getProviderAndId(id);
    const clip = await provider?.getClipById(idPart);

    if (clip) {
      clip.id = id;
    }

    return clip;
  }

  getUrl(id: string): string | undefined {
    const [provider, idPart] = this.getProviderAndId(id);
    return provider?.getUrl(idPart);
  }
  getEmbedUrl(id: string): string | undefined {
    const [provider, idPart] = this.getProviderAndId(id);
    return provider?.getEmbedUrl(idPart);
  }
  getAutoplayUrl(id: string, clip: Clip): string | undefined {
    const [provider, idPart] = this.getProviderAndId(id);
    return provider?.getAutoplayUrl(idPart, clip);
  }

  setProviders(providers: string[]) {
    logger.info('setProviders', providers);
    this.enabledProviders = providers;
  }

  private getProviderAndId(id: string): [ClipProvider | undefined, string] {
    const [providerName, idPart] = id.split(':');
    const provider = this.providers[providerName];

    return [provider, idPart];
  }
}

const clipProvider = new CombinedClipProvider();

export default clipProvider;
