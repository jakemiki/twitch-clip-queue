import axios from 'axios';
import { OEmbedVideoResponse } from '../models/oembed';

const getClip = async (id: string): Promise<OEmbedVideoResponse | undefined> => {
  try {
    const { data } = await axios({
      method: 'get',
      url: `https://openapi.afreecatv.com/oembed/embedinfo?vod_url=https://vod.afreecatv.com/player/${id}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: '*/*',
      },
    });
    return data;
  } catch {
    return undefined;
  }
};

const afreecaApi = {
  getClip,
};

export default afreecaApi;
