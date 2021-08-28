import React from 'react';
import ClipCard from './ClipCard';

export interface ClipRollProps {
  clips: any[];
}

function ClipRoll({ clips }: ClipRollProps) {
  return (
    <div className="cliproll flex flex-wrap w-full">
      {clips.length ? (
        clips.map((clip) => (
          <ClipCard key={`${clip.provider}:${clip.id}`} {...clip} submitterCount={clip.submitters?.length} />
        ))
      ) : (
        <div className="pl-3 text-lg font-bold">Waiting for some clips from chat...</div>
      )}
    </div>
  );
}

export default ClipRoll;
