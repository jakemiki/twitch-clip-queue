import { Clip } from "./clips";

export interface Provider {
  tryGetClip(url: string): Promise<Clip | undefined>;
}
