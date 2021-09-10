import React, { useEffect, useState } from 'react';
import { useState as useHookState } from '@hookstate/core';
import Button from '../../components/Button';
import Toggle from '../../components/Toggle';
import ClipFinder from '../../services/ClipFinder';
import TwitchChat from '../../services/TwitchChat';
import {
  acceptClips,
  acceptingClips,
  addClip,
  clearMemory,
  clearQueue,
  clipMemory,
  clipQueue,
  currentClip,
  nextClip,
} from '../../store/queue';
import { changeChannel, userChannel, userName } from '../../store/user';
import ClipRoll from './ClipRoll';
import Player from './Player';
import './styles.css';

function QueuePage() {
  const [advancedVisible, setAdvancedVisible] = useState(false);
  const isAcceptingClips = useHookState(acceptingClips);
  const clips = useHookState(clipQueue);
  const clipMem = useHookState(clipMemory);
  const current = useHookState(currentClip);

  const token = useHookState(userName);
  const channel = useHookState(userChannel);
  const tokenValue = token.get();

  useEffect(() => {
    TwitchChat.connect();
    return () => TwitchChat.disconnect();
  }, [tokenValue]);

  return (
    <>
      <Player {...current.get()} submitterCount={current.submitters.get()?.length} />
      <div className="mt-4 flex w-full">
        <Button colour="green" className="mr-2" onClick={() => nextClip()}>
          Next &raquo;
        </Button>
        <Toggle pressed={isAcceptingClips.get()} className="mr-2" onClick={() => acceptClips(!isAcceptingClips.get())}>
          {isAcceptingClips.get() ? <>Close the floodgates! 🌊</> : <>Open the floodgates! 🚪</>}
        </Toggle>
        <Button colour="red" className="mr-2" onClick={() => clearQueue()}>
          &times; Clear queue <em>({clips.length})</em>
        </Button>
        <Toggle pressed={advancedVisible} colour="red" onClick={() => setAdvancedVisible(!advancedVisible)}>
          ⚙️
        </Toggle>
      </div>
      {advancedVisible && (
        <div className="mt-2 flex w-full">
          <Button
            className="mr-2"
            onClick={() => {
              const newChannel = prompt('Enter channel to read chat from', channel.get() as string);
              if (newChannel && newChannel !== channel.get()) {
                changeChannel(newChannel);
              }
            }}
          >
            Change channel <em>({channel.get()})</em>
          </Button>
          <Button
            className="mr-2"
            onClick={() => {
              const url = prompt('Enter clip url', '');
              if (url) {
                ClipFinder.findByUrl(url).then((clip) => {
                  if (clip) {
                    clip.url = url;
                    clip.submitter = userName.get() ?? undefined;
                    addClip(clip);
                  }
                });
              }
            }}
          >
           + Add cilp
          </Button>
          <Button
            onClick={() => clearMemory()}
            title="Remove all clips from permanent memory, allow all clips to be posted and queued again"
          >
            &times; Purge memory <em>({clipMem.length})</em>
          </Button>
        </div>
      )}
      <div className="mt-4">
        <ClipRoll clips={clips.get()} />
      </div>
    </>
  );
}

export default QueuePage;
