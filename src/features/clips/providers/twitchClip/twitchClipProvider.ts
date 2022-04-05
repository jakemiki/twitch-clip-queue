import twitchApi from '../../../../common/apis/twitchApi';
import type { Clip } from '../../clipQueueSlice';
import type { ClipProvider } from '../providers';

class TwitchClipProvider implements ClipProvider {
  name = 'twitch-clip';
  getIdFromUrl(url: string): string | undefined {
    let uri: URL;
    try {
      uri = new URL(url);
    } catch {
      return undefined;
    }

    if (uri.hostname === 'clips.twitch.tv') {
      return this.extractIdFromPathname(uri.pathname);
    }

    if (uri.hostname.endsWith('twitch.tv')) {
      if (uri.pathname.includes('/clip/')) {
        return this.extractIdFromPathname(uri.pathname);
      }
    }

    return undefined;
  }

  async getClipById(id: string): Promise<Clip | undefined> {
    if (!id) {
      return undefined;
    }

    const clipInfo = await twitchApi.getClip(id);

    if (!clipInfo) {
      return undefined;
    }

    return {
      id,
      author: clipInfo.broadcaster_name,
      title: clipInfo.title,
      submitters: [],
      thumbnailUrl: clipInfo.thumbnail_url?.replace('%{width}x%{height}', '480x272'),
      createdAt: clipInfo.created_at,
    };
  }

  getUrl(id: string): string | undefined {
    return `https://clips.twitch.tv/${id}`;
  }

  getEmbedUrl(id: string): string | undefined {
    return `https://clips.twitch.tv/embed?clip=${id}&autoplay=true&parent=${window.location.hostname}`;
  }

  getAutoplayUrl(id: string, clip: Clip): string | undefined {
    if (clip.thumbnailUrl) {
      return clip.thumbnailUrl.split('-preview-')[0] + '.mp4';
    } else {
      return this.getUrl(id);
    }
  }

  private extractIdFromPathname(pathname: string): string | undefined {
    const idStart = pathname.lastIndexOf('/');
    const id = pathname.slice(idStart).split('?')[0].slice(1);

    return id;
  }
}

const twitchClipProvider = new TwitchClipProvider();
export default twitchClipProvider;
