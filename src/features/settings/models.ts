export type ColorScheme = 'light' | 'dark';


export interface AllSettings {
  channel?: string;
  colorScheme?: ColorScheme;
  commandPrefix?: string;

  enabledProviders?: string[];
  ignoredChatters?: string;

  clipLimit?: number | null;
  layout?: string;
}
