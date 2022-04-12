import { Clip, ClipInfo } from "./clips";

export interface Provider {
  name: string;
  canHandle(url: string): boolean;
  getInfo(url: string): ClipInfo | undefined;
  tryGetClip(url: string): Promise<Clip | undefined>;
}

interface OEmbedBaseResponse {
  type: string;
  version: string;
  title?: string;
  author_name?: string;
  author_url?: string;
  provider_name?: string;
  provider_url?: string;
  cache_age?: number;
  thumbnail_url?: string;
  thumbnail_width?: number;
  thumbnail_height?: number;
}

export interface OEmbedVideoResponse extends OEmbedBaseResponse {
  type: 'video';
  html: string;
  width: number;
  height: number;
}

export type OEmbedResponse = OEmbedBaseResponse | OEmbedVideoResponse;
