import type { ChatChannel } from '../chat/models';

export type ColorScheme = 'light' | 'dark';

export interface AllSettings {
  channel?: string;
  chatChannels?: ChatChannel[];
  colorScheme?: ColorScheme;
  commandPrefix?: string;
  enabledProviders?: string[];
  ignoredChatters?: string;
  clipLimit?: number | null;
  layout?: string;
  initialQueueOpen?: 'true' | 'false';
  platformIconMode?: 'colored' | 'grayscale' | 'disabled';
}
