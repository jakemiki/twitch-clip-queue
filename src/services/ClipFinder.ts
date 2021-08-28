import { Clip } from "../models";
import TwitchClipProvider from "./providers/twitch-clip";

const providers = [
  TwitchClipProvider
];

const findByUrl = async (url: string): Promise<Clip | undefined> => {
  for (const provider of providers) {
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
