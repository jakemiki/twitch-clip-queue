import { TwitchBadge } from '../models/twitch';

const channelBadgeCache = new Map<string, any>();

export const getChannelBadges = async (channelId: string, twitchApiClient: any): Promise<any> => {
  if (channelBadgeCache.has(channelId)) {
    return channelBadgeCache.get(channelId);
  }
  try {
    const { data } = await twitchApiClient.get(`chat/badges?broadcaster_id=${channelId}`);
    const badges = data.data || [];
    channelBadgeCache.set(channelId, badges);
    return badges;
  } catch (error) {
    console.error('Failed to fetch channel badges:', error);
    return [];
  }
};

export const getGlobalBadges = async (twitchApiClient: any): Promise<any> => {
  if (channelBadgeCache.has('global')) {
    return channelBadgeCache.get('global');
  }
  try {
    const { data } = await twitchApiClient.get(`chat/badges/global`);
    const badges = data.data || [];
    channelBadgeCache.set('global', badges);
    return badges;
  } catch (error) {
    console.error('Failed to fetch global badges:', error);
    return [];
  }
};

export const parseTwitchBadges = async (
  badgeString: string,
  channelId: string | undefined,
  twitchApiClient: any
): Promise<TwitchBadge[]> => {
  if (!badgeString) return [];

  const [channelBadges, globalBadges] = await Promise.all([
    channelId ? getChannelBadges(channelId, twitchApiClient) : Promise.resolve([]),
    getGlobalBadges(twitchApiClient),
  ]);

  const badges: TwitchBadge[] = [];
  const allBadges = [...channelBadges, ...globalBadges];

  badgeString.split(',').forEach((badge) => {
    const [name, version] = badge.split('/');
    if (name && version) {
      let imageUrl = '';
      let title = name.charAt(0).toUpperCase() + name.slice(1);
      const badgeInfo = allBadges.find((b: any) => b.set_id === name);
      if (badgeInfo && badgeInfo.versions) {
        const badgeVersion = badgeInfo.versions.find((v: any) => v.id === version);
        if (badgeVersion) {
          imageUrl = badgeVersion.image_url_1x;
          title = badgeVersion.title || title;
        }
      }
      if (!imageUrl) {
        switch (name) {
          case 'broadcaster':
            imageUrl = 'https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1';
            break;
          case 'moderator':
            imageUrl = 'https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/1';
            break;
          case 'subscriber':
            imageUrl = `https://static-cdn.jtvnw.net/badges/v1/subscriber/${version}`;
            break;
          case 'vip':
            imageUrl = 'https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/1';
            break;
          case 'premium':
            imageUrl = 'https://static-cdn.jtvnw.net/badges/v1/bbbe0db0-a598-423e-86d0-f9fb98ca1933/1';
            break;
          default:
            return;
        }
      }
      badges.push({
        id: name,
        version,
        title,
        imageUrl,
      });
    }
  });
  return badges;
};

export const clearBadgeCache = () => {
  channelBadgeCache.clear();
};
