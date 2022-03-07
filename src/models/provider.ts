import { Clip, ClipInfo } from "./clips";

export interface Provider {
  canHandle(url: string): boolean;
  getInfo(url: string): ClipInfo | undefined;
  tryGetClip(url: string): Promise<Clip | undefined>;
}
