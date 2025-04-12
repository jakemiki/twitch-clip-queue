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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<VideoJSPlayer | null>(null);
  const dispatch = useDispatch();
  const volume = useSelector((state: RootState) => state.settings.volume);

  useEffect(() => {
    if (!videoRef.current || !src) return;

    const YouTube = src.includes('youtube.com') || src.includes('youtu.be');

    playerRef.current = videojs(videoRef.current, {
      controls: true,
      autoplay: true,
      fluid: true,
      responsive: true,
      aspectRatio: '16:9',
      sources: YouTube
        ? [{ src, type: 'video/youtube' }]
        : [{ src, type: src.includes('.m3u8') ? 'application/x-mpegURL' : 'video/mp4' }],
      techOrder: YouTube ? ['youtube', 'html5'] : ['html5'],
      bigPlayButton: false,
      preload: 'auto',
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
        player.play();
      });

      if (onEnded) {
        player.on('ended', onEnded);
      }
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

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-default-skin" />
    </div>
  );
};

export default VideoPlayer;
