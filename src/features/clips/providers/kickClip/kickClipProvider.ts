import kickApi from '../../../../common/apis/kickApi';
import type { Clip } from '../../clipQueueSlice';
import type { ClipProvider } from '../providers';

class KickClipProvider implements ClipProvider {
  name = 'kick-clip';
  private clipCache: Map<string, string> = new Map();

  getIdFromUrl(url: string): string | undefined {
    try {
      const uri = new URL(url);
      if (uri.hostname === 'kick.com' || uri.hostname === 'www.kick.com') {
        const id = uri.searchParams.get('clip');
        if (id) {
          return id;
        }
        if (uri.pathname.includes('/clips/')) {
          const idStart = uri.pathname.lastIndexOf('/');
          return uri.pathname.slice(idStart).split('?')[0]?.slice(1);
        }
      }
      return undefined;
    } catch {
      return undefined;
    }
  }

  async getClipById(id: string): Promise<Clip | undefined> {
    if (!id) return undefined;

    const clipInfo = await kickApi.getClip(id);
    const clipCache: Record<string, string> = {};
    if (!clipInfo || !clipInfo.video_url) return undefined;

    clipCache[id] = clipInfo.video_url;

    return {
      id: clipInfo.id,
      title: clipInfo.title,
      author: clipInfo.channel.username,
      category: clipInfo.category.name,
      url: clipInfo.video_url,
      createdAt: clipInfo.created_at,
      thumbnailUrl: clipInfo.thumbnail_url.replace('%{width}x%{height}', '480x272'),
      submitters: [],
      Platform: 'Kick',
    };
  }

  getUrl(id: string): string | undefined {
    return this.clipCache.get(id);
  }

  getChannelUrl(id: string, clipInfo: Clip): string | undefined {
    return `https://kick.com/${clipInfo.author}/clips/${id}`;
  }

  getEmbedUrl(id: string): string | undefined {
    return this.getUrl(id);
  }
  async getAutoplayUrl(id: string): Promise<string | undefined> {
    return await kickApi.getDirectUrl(id);
  }
}

const kickClipProvider = new KickClipProvider();
export default kickClipProvider;
