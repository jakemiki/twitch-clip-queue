import axios from 'axios';

const CORS_PROXY = 'https://corsproxy.io/?';

interface SoraCameoProfile {
  username: string;
  display_name?: string;
  user_id: string;
  verified?: boolean;
}

interface SoraPost {
  id: string;
  text: string;
  preview_image_url?: string;
  attachments?: Array<{
    downloadable_url?: string;
    encodings?: {
      thumbnail?: {
        path?: string;
      };
    };
  }>;
  cameo_profiles?: SoraCameoProfile[] | null;
}

interface SoraProfile {
  username: string;
  display_name?: string;
  verified?: boolean;
}

interface SoraApiResponse {
  post: SoraPost;
  profile?: SoraProfile;
}

const getPost = async (id: string): Promise<SoraApiResponse | undefined> => {
  try {
    const apiUrl = `https://sora.chatgpt.com/backend/project_y/post/${id}/tree?limit=1&max_depth=0`;
    const { data } = await axios.get<SoraApiResponse>(`${CORS_PROXY}${encodeURIComponent(apiUrl)}`);
    return data;
  } catch (error) {
    console.error('Failed to fetch Sora post:', id, error);
    return undefined;
  }
};

const getVideoUrl = async (id: string): Promise<string | undefined> => {
  const response = await getPost(id);
  if (!response || !response.post || !response.post.attachments || response.post.attachments.length === 0) {
    return undefined;
  }
  return response.post.attachments[0].downloadable_url;
};

const soraApi = {
  getPost,
  getVideoUrl,
};

export default soraApi;
