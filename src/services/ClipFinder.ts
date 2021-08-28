import { Clip } from '../models';
import { addClip } from '../store/queue';
import TwitchClipProvider from './providers/twitch-clip';
import YouTubeProvider from './providers/youtube';

const providers = [TwitchClipProvider, YouTubeProvider];

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

(window as any).clip = async (s: string, u: string) => {
  const clip = await findByUrl(u);
  if (clip) {
    console.log('adding clip', clip);
    clip.submitter = s;
    addClip(clip);
  }
};

const ClipFinder = {
  findByUrl,
};

export default ClipFinder;
