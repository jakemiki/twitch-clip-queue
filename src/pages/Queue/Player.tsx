import React from 'react';

export interface PlayerProps {
  title?: string;
  provider?: string;
  id?: string;
  channel?: string;
  game?: string;
  submitter?: string;
  submitterCount?: number;
}

function Player(props: PlayerProps) {
  const { game, channel, title, submitter, submitterCount = 0 } = props;
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
              , submitted by <span className="font-bold">{submitter}</span>
              {submitterCount > 0 && <> and {submitterCount} other(s)</>}
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
          allowFullScreen={true}
          title={props.title}
        ></iframe>
      );
  }

  return <span>Provider not supported: {provider}</span>;
}

export default Player;
