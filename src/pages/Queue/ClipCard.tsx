import React from 'react';
import Button from '../../components/Button';
import { Clip } from '../../models';
import { removeClip, selectCurrentClip } from '../../store/queue';

export interface ClipCardProps {
  clip: Clip;
}

function ClipCard({ clip }: ClipCardProps) {
  const { thumbnailUrl, id, provider, url, title, game, submitter, submitters, channel } = clip;
  const submitterCount = submitters?.length ?? 0;
  return (
    <div className={'clip max-w-sm rounded overflow-hidden flex flex-col '}>
      {thumbnailUrl && <img className="w-full cursor-pointer" src={thumbnailUrl} alt={title} onClick={() => selectCurrentClip({ id, provider })}/>}
      <div className="h-full w-full relative">
        <div className="px-2 py-1 ">
          <h4 className="font-bold text-sm mb-1 w-full overflow-hidden whitespace-nowrap overflow-ellipsis">
            <a className="text-black no-underline" href={url} target="_blank" rel="noreferrer">
              {title}
            </a>
          </h4>
          <p className="text-gray-900 text-xs mb-1 font-normal">
            <span className="font-bold">{channel} </span>
            {game && (
              <span>
                playing&nbsp;<span className="font-bold">{game}</span>
              </span>
            )}
          </p>
          <p className="text-gray-900 text-xs font-normal">
            {submitter && (
              <>
                Submitted by <span className="font-bold">{submitter.displayName ?? submitter.userName}</span>
              </>
            )}
            <span className="text-xs">{submitterCount > 0 && ' +' + submitterCount}</span>
          </p>
        </div>
        <div className="absolute flex right-1 bottom-1 clip-buttons space-x-1">
          <Button colour="green" onClick={() => selectCurrentClip({ id, provider })}>
            &raquo;
          </Button>
          <Button colour="red" onClick={() => removeClip({ id, provider })}>
            &times;
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ClipCard;
