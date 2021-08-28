import { Clip } from "./clips";

export interface Provider {
  canHandle(url: string): boolean;
  tryGetClip(url: string): Promise<Clip | undefined>;
}
