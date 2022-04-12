import axios from 'axios';
import { OEmbedVideoResponse } from '../models';

const getClip = async (id: string): Promise<OEmbedVideoResponse | undefined> => {
  try {
    const { data } = await axios.get(`https://api.streamable.com/oembed.json?url=https://streamable.com/${id}`);
    return data;
  } catch {
    return undefined;
  }
};

const StreamableApi = {
  getClip,
};

export default StreamableApi;
