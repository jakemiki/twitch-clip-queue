import youtubeApi from '../../../../common/apis/youtubeApi';
import type { Clip } from '../../clipQueueSlice';
import type { ClipProvider } from '../providers';

class YoutubeProvider implements ClipProvider {
  name = 'youtube';

  getIdFromUrl(url: string): string | undefined {
    let uri: URL;
    try {
      uri = new URL(url);
    } catch {
      return undefined;
    }

    let id: string | undefined = undefined;
    if (uri.hostname === 'youtu.be' || uri.pathname.includes('shorts')) {
      const idStart = uri.pathname.lastIndexOf('/') + 1;
      id = uri.pathname.slice(idStart).split('?')[0];
    } else if (uri.hostname.endsWith('youtube.com')) {
      id = uri.searchParams.get('v') ?? undefined;
    }

    if (!id) {
      return undefined;
    }

    const startTime = uri.searchParams.get('t') ?? undefined;

    if (startTime) {
      const chunks = startTime.split(/([hms])/).filter(chunk => chunk !== '');
      const magnitudes = chunks.filter(chunk => chunk.match(/[0-9]+/)).map(chunk => parseInt(chunk));
      const UNITS = ['h', 'm', 's'];
      const seenUnits = chunks.filter(chunk => UNITS.includes(chunk));

      if (chunks.length === 1) {
        return `${id};${chunks[0]}`;
      } else {
        const normalizedStartTime = magnitudes.reduce((accum, magnitude, index) => {
          let conversionFactor = 0;

          if (seenUnits[index] === 'h') {
            conversionFactor = 3600;
          } else if (seenUnits[index] === 'm') {
            conversionFactor = 60;
          } else if (seenUnits[index] === 's') {
            conversionFactor = 1;
          }

          return accum + magnitude * conversionFactor;
        }, 0);

        return `${id};${normalizedStartTime}`;
      }
    } else {
      return id;
    }
  }

  async getClipById(id: string): Promise<Clip | undefined> {
    if (!id) {
      return undefined;
    }

    const [idPart] = id.split(';');

    const clipInfo = await youtubeApi.getClip(idPart);

    if (!clipInfo) {
      return undefined;
    }

    return {
      id: idPart,
      title: clipInfo.title,
      author: clipInfo.author_name,
      thumbnailUrl: clipInfo.thumbnail_url,
      submitters: [],
    };
  }

  getUrl(id: string): string | undefined {
    const [idPart, startTime = ''] = id.split(';');
    return `https://youtu.be/${idPart}?t=${startTime}`;
  }

  getEmbedUrl(id: string): string | undefined {
    const [idPart, startTime = ''] = id.split(';');
    return `https://www.youtube.com/embed/${idPart}?autoplay=1&start=${startTime}`;
  }

  async getAutoplayUrl(id: string): Promise<string | undefined> {
    return this.getUrl(id);
  }
}

const youtubeProvider = new YoutubeProvider();

export default youtubeProvider;
