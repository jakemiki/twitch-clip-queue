import React, { useEffect, useRef } from 'react';
import { setVolume } from '../../settings/settingsSlice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../app/store';
import videojs from 'video.js';
import VideoJSPlayer from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';
import '@videojs/http-streaming';
import 'videojs-youtube';

interface VideoPlayerProps {
  src: string | undefined;
  onEnded?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, onEnded }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<VideoJSPlayer | null>(null);
  const dispatch = useDispatch();
  const volume = useSelector((state: RootState) => state.settings.volume);
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;

  useEffect(() => {
    if (!containerRef.current || !src) return;

    const video = document.createElement('video-js');
    video.classList.add('video-js', 'vjs-default-skin');
    containerRef.current.appendChild(video);

    const YouTube = src.includes('youtube.com') || src.includes('youtu.be');

    playerRef.current = videojs(video, {
      controls: true,
      autoplay: true,
      fluid: true,
      responsive: true,
      aspectRatio: '16:9',
      bigPlayButton: false,
      preload: 'auto',
      sources: YouTube
        ? [{ src, type: 'video/youtube' }]
        : [{ src, type: src.includes('.m3u8') ? 'application/x-mpegURL' : 'video/mp4' }],
      techOrder: YouTube ? ['youtube', 'html5'] : ['html5'],
    });

    const player = playerRef.current;
    if (player) {
      player.fill(true);
      player.volume(volume);

      player.on('volumechange', () => {
        const currentVolume = player.volume();
        dispatch(setVolume(currentVolume));
      });

      player.on('error', (e: any) => {
        console.error('Video player error:', e);
      });

      player.on('loadedmetadata', () => {
        if (!player.paused()) return;

        player.play()?.catch((err) => {
          console.warn('Play failed:', err);
        });
      });

      player.on('ended', () => onEndedRef.current?.());
    }

    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        try {
          playerRef.current.dispose();
        } catch (e) {
          console.warn('Error during Video.js dispose:', e);
        }
        playerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  if (!src) return null;

  return <div data-vjs-player ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default VideoPlayer;
