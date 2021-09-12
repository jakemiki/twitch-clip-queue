import React from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ClipSubmitter } from '../../models';

export interface PlayerProps {
  title?: string;
  provider?: string;
  id?: string;
  channel?: string;
  game?: string;
  timestamp?: string;
  submitter?: ClipSubmitter;
  submitterCount?: number;
  startTime?: string;
}

function Player(props: PlayerProps) {
  const { game, channel, title, timestamp, submitter, submitterCount = 0 } = props;
  console.log(timestamp);
  return (
    <>
      <div className="player">
        <PlayerSwitch {...props} />
      </div>
      <div className="pt-2">
        <h2 className="font-bold mb-1">{title ?? <>&nbsp;</>}</h2>
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
              {submitterCount > 0 && <> and {submitterCount} other(s)</>}
              {timestamp && (
                <span>
                  , created {formatDistanceToNow(parseISO(timestamp))} ago
                </span>
              )}
            </>
          ) : (
            <>&nbsp;</>
          )}
        </p>
      </div>
    </>
  );
}

function PlayerSwitch({ provider, ...props }: PlayerProps) {
  switch (provider) {
    case undefined:
      return <></>;
    case 'twitch-clip':
      return (
        <iframe
          src={`https://clips.twitch.tv/embed?clip=${props.id}&autoplay=true&parent=${window.location.hostname}`}
          height="100%"
          width="100%"
          className="player"
          allowFullScreen={true}
          title={props.title}
        ></iframe>
      );
    case 'twitch-vod':
      return (
        <iframe
          src={`https://player.twitch.tv/?video=${props.id}&autoplay=true&parent=${window.location.hostname}&time=${props.startTime}`}
          height="100%"
          width="100%"
          className="player"
          allowFullScreen={true}
          title={props.title}
        ></iframe>
      );
    case 'youtube':
      return (
        <iframe
          src={`https://www.youtube.com/embed/${props.id}?autoplay=1&start=${props.startTime ?? ''}`}
          height="100%"
          width="100%"
          className="player"
          allowFullScreen={true}
          title={props.title}
        ></iframe>
      );
  }

  return <span>Provider not supported: {provider}</span>;
}

export default Player;
