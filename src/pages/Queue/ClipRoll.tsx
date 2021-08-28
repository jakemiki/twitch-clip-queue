import React from 'react';
import ClipCard from './ClipCard';

export interface ClipRollProps {
  clips: any[];
  clipLimit?: number;
}

function ClipRoll({ clips, clipLimit = 19 }: ClipRollProps) {
  return (
    <div className="cliproll flex flex-wrap w-full">
      {clips.length ? (
        <>
          {clips.slice(0, clipLimit).map((clip) => (
            <ClipCard key={`${clip.provider}:${clip.id}`} {...clip} submitterCount={clip.submitters?.length} />
          ))}
          {clips.length > clipLimit && (
            <div className="clip max-w-sm rounded overflow-hidden ml-3 mb-3 text-3xl flex">
              <div className="mx-auto my-auto">+{clips.length - clipLimit}</div>
            </div>
          )}
        </>
      ) : (
        <div className="pl-3 text-lg font-bold">Waiting for some clips from chat...</div>
      )}
    </div>
  );
}

export default ClipRoll;
