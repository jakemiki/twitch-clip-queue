import { Stack } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import AutoplayOverlay from './AutoplayOverlay';
import VideoPlayer from './VideoPlayer';
import {
  autoplayTimeoutHandleChanged,
  selectAutoplayEnabled,
  selectAutoplayTimeoutHandle,
  selectAutoplayUrl,
  selectCurrentClip,
  selectNextId,
} from '../clipQueueSlice';
import ReactPlayer from 'react-player/lazy';
import clipProvider from '../providers/providers';

interface PlayerProps {
  className?: string;
}

function Player({ className }: PlayerProps) {
  const dispatch = useAppDispatch();
  const currentClip = useAppSelector(selectCurrentClip);
  const nextClipId = useAppSelector(selectNextId);
  const autoplayEnabled = useAppSelector(selectAutoplayEnabled);
  const autoplayTimeoutHandle = useAppSelector(selectAutoplayTimeoutHandle);
  const autoplayUrl = useAppSelector(selectAutoplayUrl);
  const [videoSrc, setVideoSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!currentClip) return;

    const fetchVideoUrl = async () => {
      const url = await clipProvider.getAutoplayUrl(currentClip.id);
      setVideoSrc(url);
    };

    fetchVideoUrl();
  }, [currentClip]);

  let player = undefined;
  if (currentClip) {
    const isKickClip = currentClip.id.includes('clip_');
    if (autoplayEnabled) {
      if (autoplayUrl && ReactPlayer.canPlay(autoplayUrl)) {
        player = (
          <ReactPlayer
            key={currentClip.id}
            playing
            controls
            url={autoplayUrl}
            width="100%"
            height="100%"
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
            }}
            onEnded={() => nextClipId && dispatch(autoplayTimeoutHandleChanged({ set: true }))}
          />
        );
      }
    }

    if (!player) {
      if (isKickClip) {
        player = <VideoPlayer key={currentClip.id} src={currentClip.url} />;
      } else {
        const embedUrl = clipProvider.getEmbedUrl(currentClip.id);
        player = (
          <iframe
            key={currentClip.id}
            src={embedUrl}
            title={currentClip.title}
            style={{ height: '100%', width: '100%' }}
            frameBorder="0"
            allow="autoplay"
            allowFullScreen
          ></iframe>
        );
      }
    }
  }

  return (
    <Stack
      align="center"
      sx={{ background: 'black', height: '100%', aspectRatio: '16 / 9', position: 'relative' }}
      className={className}
    >
      {player}
      <AutoplayOverlay
        visible={!!autoplayTimeoutHandle}
        onCancel={() => dispatch(autoplayTimeoutHandleChanged({ set: false }))}
      />
    </Stack>
  );
}

export default Player;
