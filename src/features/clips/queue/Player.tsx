import { Stack } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import type { Clip } from '../clipQueueSlice';
import {
  autoplayTimeoutHandleChanged,
  selectAutoplayEnabled,
  selectAutoplayTimeoutHandle,
  selectCurrentClip,
  selectNextId,
} from '../clipQueueSlice';
import clipProvider from '../providers/providers';
import AutoplayOverlay from './AutoplayOverlay';
import VideoPlayer from './VideoPlayer';

interface PlayerProps {
  className?: string;
}

const getPlayerComponent = (
  currentClip: Clip | undefined,
  videoSrc: string | undefined,
  autoplayEnabled: boolean,
  nextClipId: string | undefined,
  dispatch: ReturnType<typeof useAppDispatch>
) => {
  if (!currentClip) return null;

  const KickClip = currentClip.Platform === 'Kick' || currentClip.id.startsWith('kick-clip:');

  if (autoplayEnabled && currentClip.id) {
    return (
      <VideoPlayer
        key={`${currentClip.id}-${videoSrc}`}
        src={videoSrc}
        onEnded={() => nextClipId && dispatch(autoplayTimeoutHandleChanged({ set: true }))}
      />
    );
  }

  if (KickClip) {
    return <VideoPlayer key={currentClip.id} src={videoSrc} />;
  }

  const embedUrl = clipProvider.getEmbedUrl(currentClip.id);
  return (
    <iframe
      key={currentClip.id}
      src={embedUrl}
      title={currentClip.title}
      style={{ height: '100%', width: '100%' }}
      frameBorder="0"
      allow="autoplay"
      allowFullScreen
    />
  );
};

function Player({ className }: PlayerProps) {
  const dispatch = useAppDispatch();
  const currentClip = useAppSelector(selectCurrentClip);
  const isKickClip = currentClip?.Platform === 'Kick' || !!currentClip?.id.startsWith('kick-clip:');
  const nextClipId = useAppSelector(selectNextId);
  const autoplayEnabled = useAppSelector(selectAutoplayEnabled);
  const autoplayTimeoutHandle = useAppSelector(selectAutoplayTimeoutHandle);
  const [videoSrc, setVideoSrc] = useState<string | undefined>(undefined);
  const [videoClipId, setVideoClipId] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    if (!currentClip) {
      setVideoSrc(undefined);
      setVideoClipId(undefined);
      setError(null);
      setIsFallback(false);
      return;
    }

    setVideoSrc(undefined);
    setVideoClipId(undefined);
    setError(null);
    setIsFallback(false);
    let active = true;

    const fetchVideoUrl = async () => {
      try {
        const url = await clipProvider.getAutoplayUrl(currentClip.id);
        if (active) {
          setVideoClipId(currentClip.id);
          setVideoSrc(url);
          setError(
            !url && isKickClip ? 'Failed to load video. Please make an Issue Request on GitHub. Thank you!' : null
          );
          setIsFallback(false);
        }
      } catch {
        if (!active) return;

        const fallbackUrl = clipProvider.getFallbackM3u8Url(currentClip.id);
        setVideoClipId(currentClip.id);
        setVideoSrc(fallbackUrl);
        setError(
          !fallbackUrl && isKickClip ? 'Failed to load video. Please make an Issue Request on GitHub. Thank you!' : null
        );
        setIsFallback(true);
      }
    };

    fetchVideoUrl();

    return () => {
      active = false;
    };
  }, [currentClip, isKickClip]);

  const effectAutoPlay = autoplayEnabled && !isFallback;
  const isCurrentVideo = videoClipId === currentClip?.id;
  const currentVideoSrc = isCurrentVideo ? videoSrc : undefined;
  const player = getPlayerComponent(currentClip, currentVideoSrc, effectAutoPlay, nextClipId, dispatch);

  return (
    <Stack
      align="center"
      sx={{ background: 'black', height: '100%', aspectRatio: '16 / 9', position: 'relative' }}
      className={className}
    >
      {error && isCurrentVideo ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : currentVideoSrc || (!autoplayEnabled && !isKickClip) ? (
        player
      ) : (
        <div></div>
      )}
      <AutoplayOverlay
        visible={!!autoplayTimeoutHandle}
        onCancel={() => dispatch(autoplayTimeoutHandleChanged({ set: false }))}
      />
    </Stack>
  );
}

export default Player;
