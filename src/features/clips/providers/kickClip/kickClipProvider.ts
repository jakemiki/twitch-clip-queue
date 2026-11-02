import kickApi from '../../../../common/apis/kickApi';
import type { Clip } from '../../clipQueueSlice';
import type { ClipProvider } from '../providers';

class KickClipProvider implements ClipProvider {
  name = 'kick-clip';
  private clipCache = new Map<string, { source: string; playback: string }>();

  getIdFromUrl(url: string): string | undefined {
    try {
      const uri = new URL(url);

      if (
        !['https:', 'http:'].includes(uri.protocol) ||
        !['kick.com', 'www.kick.com', 'clkick.com', 'www.clkick.com'].includes(uri.hostname)
      )
        return;

      const match = uri.pathname.match(/^\/(?:[^/]+\/)?clips\/(clip_[a-zA-Z0-9]+)\/?$/);
      const id = match?.[1] ?? uri.searchParams.get('clip');

      return id && /^clip_[a-zA-Z0-9]+$/.test(id) ? id : undefined;
    } catch {
      return undefined;
    }
  }

  async getClipById(id: string): Promise<Clip | undefined> {
    if (!/^clip_[a-zA-Z0-9]+$/.test(id)) return;

    const clipInfo = await kickApi.getClip(id);
    const playback = clipInfo?.video_url || clipInfo?.clip_url;

    if (!clipInfo || !playback) return;

    const source = this.getClipUrl(id, clipInfo.channel.slug || clipInfo.channel.username.toLowerCase());

    this.clipCache.set(id, { source, playback });

    if (this.clipCache.size > 100) this.clipCache.delete(this.clipCache.keys().next().value);

    return {
      id,
      title: clipInfo.title,
      author: clipInfo.channel.username,
      category: clipInfo.category?.name,
      url: playback,
      sourceUrl: source,
      createdAt: clipInfo.created_at,
      thumbnailUrl: clipInfo.thumbnail_url?.replace('%{width}x%{height}', '480x272'),
      submitters: [],
      Platform: 'Kick',
    };
  }

  getUrl(id: string): string | undefined {
    return this.clipCache.get(id)?.source;
  }

  getChannelUrl(id: string, clipInfo: Clip): string | undefined {
    return clipInfo.sourceUrl ?? (clipInfo.author ? this.getClipUrl(id, clipInfo.author.toLowerCase()) : undefined);
  }

  getEmbedUrl(id: string): string | undefined {
    return this.clipCache.get(id)?.playback;
  }

  async getAutoplayUrl(id: string): Promise<string | undefined> {
    const clip = await this.getClipById(id);
    return clip?.url;
  }

  private getClipUrl(id: string, channel: string): string {
    return `https://kick.com/${encodeURIComponent(channel)}/clips/${id}`;
  }
}

const kickClipProvider = new KickClipProvider();
export default kickClipProvider;
