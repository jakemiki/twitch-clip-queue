import React from 'react';
import { Clip } from '../../models';
import ClipCard from './ClipCard';
import { useState } from '@hookstate/core';
import { acceptingClips } from '../../store/queue';

export interface ClipRollProps {
  clips: Clip[];
  clipLimit?: number;
  noButtons?: boolean;
}

function ClipRoll({ clips, noButtons }: ClipRollProps) {
  const isAcceptingClips = useState(acceptingClips).get();

  return (
    <div className="w-full overflow-y-scroll h-full">
      {!clips.length && <strong>No clips in queue. {isAcceptingClips && <>Send some in chat!</>}</strong>}
      {clips.slice(0, 100).map((clip) => (
        <div key={`${clip.provider}_${clip.id}`} className="mb-4">
          <ClipCard clip={clip} noButtons={noButtons} />
        </div>
      ))}
      {clips.length > 100 && (
        <div key="and-more" className="mb-4">
          ...and {clips.length - 100} more.
        </div>
      )}
      <div className="mb-16"></div>
    </div>
  );
}

export default ClipRoll;
