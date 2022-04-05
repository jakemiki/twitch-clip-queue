import axios from 'axios';
import { OEmbedVideoResponse } from '../models/oembed';

const getClip = async (id: string): Promise<OEmbedVideoResponse | undefined> => {
  try {
    const { data } = await axios.get(
      `https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=${id}`
    );
    return data;
  } catch {
    return undefined;
  }
};

const youtubeApi = {
  getClip,
};

export default youtubeApi;
