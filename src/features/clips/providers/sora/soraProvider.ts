import soraApi from '../../../../common/apis/soraApi';
import type { Clip } from '../../clipQueueSlice';
import type { ClipProvider } from '../providers';

class SoraProvider implements ClipProvider {
  name = 'sora';

  getIdFromUrl(url: string): string | undefined {
    let uri: URL;
    try {
      uri = new URL(url);
    } catch {
      return undefined;
    }

    // Match sora.chatgpt.com/p/s_XXXXXXXX...
    if (uri.hostname === 'sora.chatgpt.com' && uri.pathname.startsWith('/p/')) {
      const idStart = uri.pathname.lastIndexOf('/') + 1;
      const id = uri.pathname.slice(idStart).split('?')[0];

      if (id && id.startsWith('s_')) {
        return id;
      }
    }

    return undefined;
  }

  async getClipById(id: string): Promise<Clip | undefined> {
    if (!id) {
      return undefined;
    }

    const response = await soraApi.getPost(id);

    if (!response || !response.post) {
      return undefined;
    }

    const { post, profile } = response;

    return {
      id,
      title: post.text || 'Sora Video',
      author: profile?.display_name || profile?.username,
      thumbnailUrl: post.attachments?.[0]?.encodings?.thumbnail?.path,
      submitters: [],
      Platform: 'Sora',
    };
  }

  getUrl(id: string): string | undefined {
    return `https://sora.chatgpt.com/p/${id}`;
  }

  getEmbedUrl(id: string): string | undefined {
    // Sora doesn't have iframe embeds, return share URL
    return this.getUrl(id);
  }

  async getAutoplayUrl(id: string): Promise<string | undefined> {
    return await soraApi.getVideoUrl(id);
  }
}

const soraProvider = new SoraProvider();
export default soraProvider;
