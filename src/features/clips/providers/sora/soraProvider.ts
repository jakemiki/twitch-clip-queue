import soraApi from '../../../../common/apis/soraApi';
import type { Clip } from '../../clipQueueSlice';
import type { ClipProvider } from '../providers';
import type { RootState } from '../../../../app/store';
import { selectSoraCameoUsernames, selectSoraAcceptNoCameos } from '../../../settings/settingsSlice';
import { createLogger } from '../../../../common/logging';

const logger = createLogger('SoraProvider');

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
      cameos: post.cameo_profiles?.map((c) => c.display_name || c.username) || [],
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

  async shouldAcceptClip(id: string, state: RootState): Promise<boolean> {
    const allowedCameos = selectSoraCameoUsernames(state);
    const acceptNoCameos = selectSoraAcceptNoCameos(state);

    // No filtering enabled
    if (allowedCameos.length === 0 && acceptNoCameos) {
      return true;
    }

    const response = await soraApi.getPost(id);
    const cameoProfiles = response?.post?.cameo_profiles || [];

    // Filter: reject videos without cameos if setting is disabled
    if (!acceptNoCameos && cameoProfiles.length === 0) {
      logger.info(`Rejecting Sora video ${id}: no cameos found`);
      return false;
    }

    // Filter: check allowed cameo usernames (only if video has cameos)
    if (allowedCameos.length > 0 && cameoProfiles.length > 0) {
      const hasCameoMatch = cameoProfiles.some((cameo) =>
        allowedCameos.includes(cameo.username.toLowerCase())
      );
      if (!hasCameoMatch) {
        logger.info(`Rejecting Sora video ${id}: no matching cameos`);
        return false;
      }
    }

    return true;
  }
}

const soraProvider = new SoraProvider();
export default soraProvider;
