import { useState } from '@hookstate/core';
import React from 'react';
import { acceptingClips } from '../../store/queue';
import ClipCard from './ClipCard';

export interface ClipRollProps {
  clips: any[];
  clipLimit?: number;
}

function ClipRoll({ clips, clipLimit = 19 }: ClipRollProps) {
  const isAcceptingClip = useState(acceptingClips);

  return (
    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 w-full">
      {clips.length ? (
        <>
          {clips.slice(0, clipLimit).map((clip) => (
            <ClipCard key={`${clip.provider}:${clip.id}`} {...clip} submitterCount={clip.submitters?.length} />
          ))}
          {clips.length > clipLimit && (
            <div className="clip max-w-sm rounded overflow-hidden text-3xl flex py-4">
              <div className="mx-auto my-auto">+{clips.length - clipLimit} more</div>
            </div>
          )}
        </>
      ) : (
        isAcceptingClip.get() && <div className="col-span-full text-lg font-bold">Waiting for some clips from chat...</div>
      )}
    </div>
  );
}

export default ClipRoll;
