import React from 'react';
import { Clip } from '../../models';
import ClipCard from './ClipCard';
import { AutoSizer, List, ListRowRenderer } from 'react-virtualized';
import { useState } from '@hookstate/core';
import { acceptingClips } from '../../store/queue';

export interface ClipRollProps {
  clips: Clip[];
  clipLimit?: number;
}

function ClipRoll({ clips }: ClipRollProps) {
  const isAcceptingClips = useState(acceptingClips).get();

  const clipRenderer: ListRowRenderer = ({ index, key }) => (
    <div key={key} className="mb-4">
      <ClipCard clip={clips[index]} />
    </div>
  );

  return (
    <div className="w-full h-full">
      <AutoSizer>
        {({ width, height }) => (
          <List
            className="custom-scroll"
            height={height}
            rowCount={clips.length}
            rowHeight={256}
            rowRenderer={clipRenderer}
            noRowsRenderer={() => <strong>No clips in queue. {isAcceptingClips && <>Send some in chat!</>}</strong>}
            width={width}
          />
        )}
      </AutoSizer>
    </div>
  );
}

export default ClipRoll;
