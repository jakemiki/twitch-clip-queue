import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Paper, Text, ScrollArea, Loader, Stack, Badge, Group } from '@mantine/core';
import { useAppSelector } from '../../../app/hooks';
import { selectCurrentClip } from '../clipQueueSlice';
import { ChatMessage, ChatReplayConfig, TwitchBadge, TwitchEmote } from '../../../common/models/twitch';
import { fetchAllEmotes, createEmoteMap, parseEmotesInText } from '../../../common/Services/emotes/Emotes';
import twitchApi from '../../../common/apis/twitchApi';

const CHAT_STYLES = {
  fontSize: '13px',
  lineHeight: '18px',
  badgeSize: '14px',
} as const;

const useAutoScroll = (scrollAreaRef: React.RefObject<HTMLDivElement>, messageCount: number) => {
  useEffect(() => {
    if (messageCount === 0) return;

    const scrollToBottom = () => {
      setTimeout(() => {
        if (scrollAreaRef.current) {
          const scrollArea = scrollAreaRef.current.querySelector('.mantine-ScrollArea-viewport');
          if (scrollArea) {
            scrollArea.scrollTop = scrollArea.scrollHeight;
          }
        }
      }, 10);
    };

    scrollToBottom();
  }, [messageCount, scrollAreaRef]);
};

const ChatBadgeComponent: React.FC<{ badge: TwitchBadge }> = ({ badge }) => (
  <Box
    title={badge.title}
    sx={{
      width: CHAT_STYLES.badgeSize,
      height: CHAT_STYLES.badgeSize,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '4px',
    }}
  >
    <img
      src={badge.imageUrl}
      alt={badge.title}
      style={{
        width: CHAT_STYLES.badgeSize,
        height: CHAT_STYLES.badgeSize,
        display: 'block',
      }}
    />
  </Box>
);

const ChatUsernameComponent: React.FC<{ commenter: ChatMessage['commenter'] }> = ({ commenter }) => (
  <Text
    size="xs"
    weight={700}
    sx={{
      color: commenter.color || '#8A2BE2',
      minWidth: 'fit-content',
      fontSize: CHAT_STYLES.fontSize,
    }}
  >
    {commenter.displayName}:
  </Text>
);

const EmoteComponent: React.FC<{ emote: TwitchEmote; name: string }> = ({ emote, name }) => (
  <img
    src={emote.url}
    alt={name}
    title={name}
    style={{
      height: '20px',
      width: 'auto',
      verticalAlign: 'middle',
      margin: '0 1px',
      display: 'inline-block',
    }}
    onError={(e) => {
      const target = e.target as HTMLImageElement;
      target.style.display = 'none';
      const textNode = document.createTextNode(name);
      target.parentNode?.insertBefore(textNode, target);
    }}
  />
);

const ChatMessageItemComponent: React.FC<{
  message: ChatMessage;
  emoteMap: Map<string, TwitchEmote>;
}> = React.memo(({ message, emoteMap }) => {
  const messageText = message.message.fragments.map((fragment) => fragment.text).join('');
  const parsedContent = parseEmotesInText(messageText, emoteMap);
  const renderMessageContent = () => {
    return parsedContent.map((segment, index) => {
      if (segment.emote) {
        return <EmoteComponent key={`emote-${index}`} emote={segment.emote} name={segment.text} />;
      }
      return (
        <span key={`text-${index}`} style={{ wordBreak: 'break-word' }}>
          {segment.text}
        </span>
      );
    });
  };

  return (
    <Box
      py={4}
      px="xs"
      sx={(theme) => ({
        fontSize: CHAT_STYLES.fontSize,
        lineHeight: CHAT_STYLES.lineHeight,
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2]}`,
        '&:hover': {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
        },
      })}
    >
      <Group spacing={6} align="flex-start" noWrap>
        {message.commenter.badges && message.commenter.badges.length > 0 && (
          <Group spacing={2} align="center" noWrap>
            {message.commenter.badges.map((badge) => (
              <ChatBadgeComponent key={`${badge.id}-${badge.version}`} badge={badge} />
            ))}
          </Group>
        )}

        <ChatUsernameComponent commenter={message.commenter} />

        <Text
          size="xs"
          sx={(theme) => ({
            color: theme.colorScheme === 'dark' ? theme.colors.gray[3] : theme.colors.dark[7],
            fontSize: CHAT_STYLES.fontSize,
            wordBreak: 'break-word',
            flex: 1,
          })}
          component="div"
        >
          {renderMessageContent()}
        </Text>
      </Group>
    </Box>
  );
});

const ChatReplayHeaderComponent: React.FC<{
  vodAvailable: boolean | null;
  vodInfo: any;
  onRefresh: () => void;
}> = ({ vodAvailable, vodInfo, onRefresh }) => {
  const handleVodClick = () => {
    const adjustedOffset = Math.max(0, vodInfo.offsetSeconds - 60);
    const vodUrl = `https://www.twitch.tv/videos/${vodInfo.videoId}?t=${adjustedOffset}s`;
    if (vodUrl) {
      window.open(vodUrl, '_blank');
    } else {
      console.warn('No VOD URL found in:', vodInfo);
    }
  };

  return (
    <Group position="apart" align="center" py="xs">
      <Group spacing="xs">
        <Text weight={600} size="sm">
          Chat Replay
        </Text>
      </Group>
      <Group spacing="xs">
        {vodAvailable === true && (
          <Badge
            color="green"
            variant="outline"
            size="xs"
            sx={(theme) => ({
              borderRadius: 4,
              height: 25,
              cursor: 'pointer',
              transition: 'background 0.3s',
              '&:hover': { backgroundColor: `${theme.colors.green[6]}`, color: 'white' },
            })}
            component="button"
            onClick={handleVodClick}
            title="Open VOD in new tab"
          >
            Go To VOD
          </Badge>
        )}
        {vodAvailable === false && (
          <Badge
            color="red"
            variant="outline"
            size="xs"
            sx={(theme) => ({
              borderRadius: 4,
              height: 25,
              cursor: 'pointer',
              transition: 'background 0.3s',
              '&:hover': { backgroundColor: `${theme.colors.red[6]}`, color: 'white' },
            })}
          >
            VOD Expired
          </Badge>
        )}
        <Badge
          size="xs"
          color="blue"
          variant="outline"
          sx={(theme) => ({
            borderRadius: 4,
            height: 25,
            cursor: 'pointer',
            transition: 'background 0.3s',
            '&:hover': { backgroundColor: `${theme.colors.blue[6]}`, color: 'white' },
          })}
          onClick={onRefresh}
          title="Refresh chat data"
        >
          Refresh
        </Badge>
      </Group>
    </Group>
  );
};

const ChatReplayFooterComponent: React.FC<{
  visibleCount: number;
  totalCount: number;
  vodAvailable: boolean | null;
}> = ({ visibleCount, totalCount, vodAvailable }) => (
  <Group position="apart" align="center" pt="xs">
    <Text size="xs" color="dimmed">
      {visibleCount} of {totalCount} messages
    </Text>
    <Text size="xs" color="dimmed">
      {vodAvailable ? 'Real chat data' : 'Mock data'}
    </Text>
  </Group>
);

interface ChatReplayProps {
  visible: boolean;
}

const ChatReplay: React.FC<ChatReplayProps> = ({ visible }) => {
  const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vodAvailable, setVodAvailable] = useState<boolean | null>(null);
  const [vodInfo, setVodInfo] = useState<any>(null);
  const [replayStartTime, setReplayStartTime] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [emoteMap, setEmoteMap] = useState<Map<string, TwitchEmote>>(new Map());

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const currentClip = useAppSelector(selectCurrentClip);

  useAutoScroll(scrollAreaRef, visibleMessages.length);

  const forceRefresh = () => {
    setAllMessages([]);
    setVisibleMessages([]);
    setError(null);
    setVodAvailable(null);
    setVodInfo(null);
    setReplayStartTime(0);
    setEmoteMap(new Map());
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    const loadEmotes = async (channelId?: string) => {
      try {
        const allEmotes = await fetchAllEmotes(channelId);
        const emoteMapping = createEmoteMap(allEmotes);
        setEmoteMap(emoteMapping);
      } catch (err) {
        console.error('❌ Failed to load emotes:', err);
      }
    };

    if (visible && currentClip && currentClip.Platform === 'Twitch' && vodInfo?.channelId) {
      loadEmotes(vodInfo.channelId);
    }
  }, [visible, currentClip, vodInfo?.channelId]);

  useEffect(() => {
    if (!visible || !currentClip || currentClip.Platform !== 'Twitch') {
      return;
    }
    const fetchChatReplay = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchedVodInfo = await twitchApi.getClipWithVodInfo(currentClip.id);

        if (!fetchedVodInfo.hasVod) {
          setVodAvailable(false);
          setError(`Chat replay unavailable - VOD has expired or doesn't exist`);
          return;
        }

        setVodAvailable(true);
        setVodInfo(fetchedVodInfo);

        if (!fetchedVodInfo.videoId || !fetchedVodInfo.channelLogin || !fetchedVodInfo.vodCreatedAt) {
          setError('Missing VOD information for chat replay');
          return;
        }

        const cleanClipId = currentClip.id.replace(/^twitch-clip:/, '');
        const clipDuration = await twitchApi.getClip(cleanClipId);
        const duration = clipDuration.duration + 1;
        const config: ChatReplayConfig = {
          videoId: fetchedVodInfo.videoId,
          offsetSeconds: fetchedVodInfo.offsetSeconds,
          duration: duration,
          channelLogin: fetchedVodInfo.channelLogin,
          channelId: fetchedVodInfo.channelId,
          vodStartTime: new Date(fetchedVodInfo.vodCreatedAt),
        };

        const fetchedMessages = await twitchApi.getChatReplay(config);

        setAllMessages(fetchedMessages);
        setReplayStartTime(Date.now());
        setVisibleMessages([]);
      } catch (err) {
        console.error('❌ Failed to fetch chat replay:', err);
        setError('Failed to load chat replay');
      } finally {
        setLoading(false);
      }
    };

    fetchChatReplay();
  }, [visible, currentClip, refreshKey]);

  useEffect(() => {
    if (!visible || allMessages.length === 0 || replayStartTime === 0) return;

    const interval = setInterval(() => {
      const currentTime = Date.now();
      const elapsedSeconds = (currentTime - replayStartTime) / 1000;

      const messagesToShow = allMessages.filter((msg) => msg.contentOffsetSeconds <= elapsedSeconds);
      setVisibleMessages(messagesToShow);
    }, 100);

    return () => clearInterval(interval);
  }, [visible, allMessages, replayStartTime]);

  if (!visible) return null;

  return (
    <Paper
      p="sm"
      withBorder
      style={{ height: '400px' }}
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3],
      })}
    >
      <Stack spacing="xs" style={{ height: '100%' }}>
        <ChatReplayHeaderComponent vodAvailable={vodAvailable} vodInfo={vodInfo} onRefresh={forceRefresh} />

        {loading && (
          <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Loader size="md" />
          </Box>
        )}

        {error && (
          <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Text color="red" size="sm" align="center">
              {error}
            </Text>
          </Box>
        )}

        {!loading && !error && visibleMessages.length === 0 && allMessages.length > 0 && (
          <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Text color="dimmed" size="sm">
              Waiting for chat messages...
            </Text>
          </Box>
        )}

        {!loading && !error && visibleMessages.length > 0 && (
          <ScrollArea
            style={{ flex: 1 }}
            ref={scrollAreaRef}
            scrollbarSize={6}
            sx={(theme) => ({
              '& .mantine-ScrollArea-scrollbar': {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2],
              },
            })}
          >
            <Stack spacing={0}>
              {visibleMessages.map((message) => (
                <ChatMessageItemComponent key={message.id} message={message} emoteMap={emoteMap} />
              ))}
            </Stack>
          </ScrollArea>
        )}

        {!loading && !error && allMessages.length > 0 && (
          <ChatReplayFooterComponent
            visibleCount={visibleMessages.length}
            totalCount={allMessages.length}
            vodAvailable={vodAvailable}
          />
        )}
      </Stack>
    </Paper>
  );
};

export default ChatReplay;
