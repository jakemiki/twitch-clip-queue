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
    };
  }

  getUrl(id: string): string | undefined {
    const [idPart, startTime = ''] = id.split(';');
    return `https://twitch.tv/videos/${idPart}?t=${startTime}`;
  }
  getEmbedUrl(id: string): string | undefined {
    const [idPart, startTime = ''] = id.split(';');

    return `https://player.twitch.tv/?video=${idPart}&autoplay=true&parent=${window.location.hostname}&time=${startTime}`;
  }
  getAutoplayUrl(id: string, clip: Clip): string | undefined {
    return this.getUrl(id);
  }

  private extractId(pathname: string, searchParams: URLSearchParams): string | undefined {
    const idStart = pathname.lastIndexOf('/');
    const id = pathname.slice(idStart).split('?')[0].slice(1);
    const startTime = searchParams.get('t');

    if (!startTime) {
      return undefined;
    }

    return `${id};${startTime}`;
  }
}

const twitchVodProvider = new TwitchVodProvider();
export default twitchVodProvider;
