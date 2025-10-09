export interface AuthInfo {
  access_token: string;
  token_type: string;
  scope: string;
}

export interface UserInfo {
  aud: string;
  azp: string;
  exp: string;
  iat: string;
  iss: string;
  sub: string;

  preferred_username?: string;
  picture?: string;
}

export interface TokenInfo {
  client_id: string;
  expires_in: number;
  login: string;
  scopes: string[];
  user_id: string;
}

export interface TwitchClip {
  id: string;
  url: string;
  embed_url: string;
  broadcaster_id: string;
  broadcaster_name: string;
  creator_id: string;
  creator_name: string;
  video_id: string;
  game_id: string;
  language: string;
  title: string;
  view_count: number;
  created_at: string;
  thumbnail_url: string;
  duration: number;
  vod_offset?: number;
}

export interface TwitchVideo {
  id: string;
  url: string;
  embed_url: string;
  user_id: string;
  user_name: string;
  language: string;
  title: string;
  view_count: number;
  created_at: string;
  thumbnail_url: string;
  duration: number;
}

export interface TwitchGame {
  box_art_url: string;
  id: string;
  name: string;
}
export interface TwitchBadge {
  id: string;
  version: string;
  title: string;
  imageUrl: string;
}

export interface TwitchEmote {
  name: string;
  url: string;
  type: 'twitch' | 'bttv' | 'ffz' | '7tv';
}
export interface ChatMessageFragment {
  text: string;
  emote?: TwitchEmote;
}

export interface ChatCommenter {
  displayName: string;
  login: string;
  color?: string;
  badges?: TwitchBadge[];
}

export interface ChatMessage {
  id: string;
  message: {
    fragments: ChatMessageFragment[];
  };
  commenter: ChatCommenter;
  contentOffsetSeconds: number;
  createdAt: string;
}
export interface JustlogMessageTags {
  emotes?: string;
  color?: string;
  badges?: string;
  'display-name'?: string;
  'user-type'?: string;
  subscriber?: string;
  mod?: string;
  turbo?: string;
  'user-id'?: string;
}
export interface JustlogMessage {
  text: string;
  displayName: string;
  timestamp: string;
  id: string;
  tags: JustlogMessageTags;
}
export interface JustlogResponse {
  messages: JustlogMessage[];
}
export interface ChatReplayConfig {
  videoId: string;
  offsetSeconds: number;
  duration: number;
  channelLogin: string;
  channelId?: string;
  vodStartTime: Date;
}
export interface VODInfo {
  videoId?: string;
  offsetSeconds: number;
  hasVod: boolean;
  clipCreatedAt?: string;
  vodCreatedAt?: string;
  channelId?: string;
  channelLogin?: string;
}
