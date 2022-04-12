import React from 'react';
import ReactPlayer from 'react-player';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Clip } from '../../models';
import { CommonProps } from '../../common/props';
import { reloadClip } from '../../store/queue';

export interface PlayerProps extends CommonProps {
  clip: Clip;
  useReactPlayer?: boolean;
  onEnded?: () => void;
}

function Player(props: PlayerProps) {
  const {
    clip: { channel, title, timestamp, startTime, game, submitter, submitters, url },
  } = props;
  const submitterCount = submitters?.length ?? 0;

  return (
    <>
      <div className="player player-container">
        <PlayerSwitch {...props} />
      </div>
      <div className="player-title-container">
        <h2 className="font-bold mb-1">
          {title ?? <>&nbsp;</>}
          {startTime && (
            <small className="text-gray-700">
              {' ('}start at{' '}
              <span className="cursor-pointer underline" onClick={() => reloadClip()}>
                {startTime}
              </span>
              {')'}
            </small>
          )}
          {url && (
            <span>
              &nbsp;
              <sup>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-700 no-underline hover:text-gray-200"
                >
                  &#x1F5D7;
                </a>
              </sup>
            </span>
          )}
        </h2>
        <p className="text-gray-500 text-sm font-normal">
          {channel ? (
            <>
              <span className="font-bold">{channel}</span>
              {game && (
                <span>
                  &nbsp;playing&nbsp;<span className="font-bold">{game}</span>
                </span>
              )}
              , submitted by <span className="font-bold">{submitter?.displayName ?? submitter?.userName}</span>
              {submitterCount > 0 && <span> and {submitterCount} other(s)</span>}
              {timestamp && <span>, created {formatDistanceToNow(parseISO(timestamp))} ago</span>}
            </>
          ) : (
            <>&nbsp;</>
          )}
        </p>
      </div>
    </>
  );
}

function PlayerSwitch({ clip, useReactPlayer, onEnded }: PlayerProps) {
  if (useReactPlayer) {
    const url = clip.videoUrl ?? clip.url;
    if (url && ReactPlayer.canPlay(url)) {
      return <ReactPlayer url={url} height="100%" width="100%" className="player" controls playing onEnded={onEnded} />;
    }
  }

  switch (clip.provider) {
    case undefined:
      return <></>;
    case 'twitch-clip':
      return (
        <iframe
          src={`https://clips.twitch.tv/embed?clip=${clip.id}&autoplay=true&parent=${window.location.hostname}`}
          height="100%"
          width="100%"
          className="player"
          allowFullScreen={true}
          title={clip.title}
        ></iframe>
      );
    case 'twitch-vod':
      return (
        <iframe
          src={`https://player.twitch.tv/?video=${clip.id}&autoplay=true&parent=${window.location.hostname}&time=${clip.startTime}`}
          height="100%"
          width="100%"
          className="player"
          allowFullScreen={true}
          title={clip.title}
        ></iframe>
      );
    case 'youtube':
      return (
        <iframe
          src={`https://www.youtube.com/embed/${clip.id}?autoplay=1&start=${clip.startTime ?? ''}`}
          height="100%"
          width="100%"
          className="player"
          allowFullScreen={true}
          title={clip.title}
        ></iframe>
      );
    case 'streamable':
      return (
        <iframe
          src={`https://streamable.com/o/${clip.id}`}
          height="100%"
          width="100%"
          className="player"
          allowFullScreen={true}
          title={clip.title}
        ></iframe>
      );
  }

  return <span>Provider not supported: {clip.provider}</span>;
}

export default Player;
