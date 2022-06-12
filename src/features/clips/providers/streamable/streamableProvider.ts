import streamableApi from '../../../../common/apis/streamableApi';
import type { Clip } from '../../clipQueueSlice';
import type { ClipProvider } from '../providers';

class StreamableProvider implements ClipProvider {
  name = 'streamable';

  getIdFromUrl(url: string): string | undefined {
    let uri: URL;
    try {
      uri = new URL(url);
    } catch {
      return undefined;
    }

    if (uri.hostname.endsWith('streamable.com')) {
      const idStart = uri.pathname.lastIndexOf('/') + 1;
      const id = uri.pathname.slice(idStart).split('?')[0];

      if (!id) {
        return undefined;
      }

      return id;
    }

    return undefined;
  }

  async getClipById(id: string): Promise<Clip | undefined> {
    const clipInfo = await streamableApi.getClip(id);

    return {
      id,
      title: clipInfo?.title ?? id,
      author: clipInfo?.author_name ?? 'Streamable',
      thumbnailUrl: clipInfo?.thumbnail_url,
      submitters: [],
    };
  }

  getUrl(id: string): string | undefined {
    return `https://streamable.com/${id}`;
  }

  getEmbedUrl(id: string): string | undefined {
    return `https://streamable.com/o/${id}`;
  }

  getAutoplayUrl(id: string, clip: Clip): string | undefined {
    return this.getUrl(id);
  }
}

const streamableProvider = new StreamableProvider();

export default streamableProvider;
