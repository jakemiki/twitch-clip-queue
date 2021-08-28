import axios from 'axios';

const getClip = async (id: string): Promise<any> => {
  try {
    const { data } = await axios.get(
      `https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=${id}`
    );
    return data;
  } catch {
    return undefined;
  }
};

const YoutubeApi = {
  getClip,
};

export default YoutubeApi;
