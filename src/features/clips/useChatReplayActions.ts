import { showNotification } from '@mantine/notifications';
import { TwitchEmote } from '../../common/models/twitch';
import { getEmoteUrl } from '../../common/Services/emotes/Emotes';

interface ChatReplayActions {
  handleEmoteClick: (emote: TwitchEmote) => void;
  handleVodClick: (vodInfo: any) => void;
  handleRefreshClick: () => void;
}

export const useChatReplayActions = (onRefresh: () => void): ChatReplayActions => {
  const handleEmoteClick = (emote: TwitchEmote) => {
    const url = getEmoteUrl(emote);
    if (url) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          showNotification({
            title: `Successfully copied emote ${emote.name} URL to clipboard`,
            message: url,
          });
        })
        .catch(() => {
          showNotification({
            title: 'Failed to copy emote URL',
            message: 'Please try again',
            color: 'red',
          });
        });
    }
  };

  const handleVodClick = (vodInfo: any) => {
    const adjustedOffset = Math.max(0, vodInfo.offsetSeconds - 60);
    const vodUrl = `https://www.twitch.tv/videos/${vodInfo.videoId}?t=${adjustedOffset}s`;
    if (vodUrl) {
      window.open(vodUrl, '_blank');
    } else {
      console.warn('No VOD URL found in:', vodInfo);
    }
  };

  const handleRefreshClick = () => {
    onRefresh();
  };

  return {
    handleEmoteClick,
    handleVodClick,
    handleRefreshClick,
  };
};
