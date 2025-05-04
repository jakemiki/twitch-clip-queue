import twitchApi from '../../../../common/apis/twitchApi';
import type { Clip } from '../../clipQueueSlice';
import type { ClipProvider } from '../providers';

class TwitchVodProvider implements ClipProvider {
  name = 'twitch-vod';
  getIdFromUrl(url: string): string | undefined {
    let uri: URL;
    try {
      uri = new URL(url);
    } catch {
      return undefined;
    }

    if (uri.hostname.endsWith('twitch.tv')) {
      if (uri.pathname.includes('/videos/') || uri.pathname.includes('/video/')) {
        return this.extractId(uri.pathname, uri.searchParams);
      }
    }
    return undefined;
  }

  async getClipById(id: string): Promise<Clip | undefined> {
    if (!id) {
      return undefined;
    }

    const [idPart] = id.split(';');

    const clipInfo = await twitchApi.getVideo(idPart);

    if (!clipInfo) {
      return undefined;
    }

    return {
      id: id,
      author: clipInfo.user_name,
      title: clipInfo.title,
      submitters: [],
      thumbnailUrl: clipInfo.thumbnail_url?.replace('%{width}x%{height}', '480x272'),
      createdAt: clipInfo.created_at,
      Platform: 'Twitch',
      url: `https://twitch.tv/videos/${idPart}`,
    };
  }

  getUrl(id: string): string | undefined {
    const [idPart, startTime = ''] = id.split(';');
    return `https://twitch.tv/videos/${idPart}${startTime ? `?t=${startTime}` : ''}`;
  }

  getEmbedUrl(id: string): string | undefined {
    const [idPart, startTime = ''] = id.split(';');
    return `https://player.twitch.tv/?video=${idPart}&autoplay=true&parent=${window.location.hostname}${
      startTime ? `&time=${startTime}` : ''
    }`;
  }

  async getAutoplayUrl(id: string): Promise<string | undefined> {
    return this.getUrl(id);
  }

  private extractId(pathname: string, searchParams: URLSearchParams): string | undefined {
    const idStart = pathname.lastIndexOf('/');
    const id = pathname.slice(idStart + 1);
    if (!id) return undefined;
    const startTime = searchParams.get('t');
    return `${id};${startTime || '0s'}`;
  }
}

const twitchVodProvider = new TwitchVodProvider();
export default twitchVodProvider;
