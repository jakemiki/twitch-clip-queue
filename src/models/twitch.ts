export interface AuthInfo {
  access_token: string;
  id_token: string;
  token_type: string;
  scope: string;

  decodedIdToken: IdToken;
}

export interface IdToken {
  aud: string;
  azp: string;
  exp: string;
  iat: string;
  iss: string;
  sub: string;

  preferred_username?: string;
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
