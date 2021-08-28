import React from 'react';

export interface ClipCardProps {
  title?: string;
  submitter?: string;
  submitterCount?: number;
  channel?: string;
  game?: string;

  thumbnailUrl?: string;
}

function ClipCard({
  thumbnailUrl,
  title,
  submitter,
  submitterCount = 0,
  channel,
  game,
}: ClipCardProps) {
  return (
    <div className="clip max-w-sm rounded overflow-hidden ml-3 mb-3">
      {thumbnailUrl && (
        <img className="w-full" src={thumbnailUrl} alt={title} />
      )}
      <div className="px-2 py-1">
        <h4 className="font-bold text-sm mb-1">{title}</h4>
        <p className="text-gray-700 text-xs mb-1 font-normal">
          <span className="font-bold">{channel} </span>
          {game && (
            <span>
              playing&nbsp;<span className="font-bold">{game}</span>
            </span>
          )}
        </p>
        <p className="text-gray-700 text-xs font-normal">
          {submitter && (
            <>
              Submitted by <span className="font-bold">{submitter}</span>
            </>
          )}
          <span className="text-xs">
            {submitterCount > 0 && ' +' + submitterCount}
          </span>
        </p>
      </div>
    </div>
  );
}

export default ClipCard;
