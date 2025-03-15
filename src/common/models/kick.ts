export interface KickCategory {
  id: number;
  name: string;
  slug: string;
  responsive: string;
  banner: string;
  parent_category: string;
}

export interface KickChannel {
  id: number;
  username: string;
  slug: string;
  profile_picture: string | null;
}

export interface KickClip {
  id: string;
  livestream_id: string;
  category_id: string;
  channel_id: number;
  user_id: number;
  title: string;
  clip_url: string;
  thumbnail_url: string;
  privacy: string;
  likes: number;
  liked: boolean;
  views: number;
  duration: number;
  started_at: string;
  created_at: string;
  is_mature: boolean;
  video_url: string;
  view_count: number;
  likes_count: number;
  is_live: boolean;
  category: KickCategory;
  creator: KickChannel;
  channel: KickChannel;
}
