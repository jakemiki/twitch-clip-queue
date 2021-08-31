import React, { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Toggle from '../../components/Toggle';
import TwitchChat from '../../services/TwitchChat';
import {
  acceptClips,
  acceptingClips,
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
  const isAcceptingClips = acceptingClips.use();
  const clips = clipQueue.use();
  const clipMem = clipMemory.use();
  const current = currentClip.use();

  const token = userName.use();
  const channel = userChannel.use();

  useEffect(() => {
    TwitchChat.connect();
    return () => TwitchChat.disconnect();
  }, [token]);

  return (
    <>
      <Player {...current} submitterCount={current.submitters?.length} />
      <div className="mt-4 flex w-full">
        <Button colour="green" className="mr-2" onClick={() => nextClip()}>
          Next &raquo;
        </Button>
        <Toggle pressed={isAcceptingClips} className="mr-2" onClick={() => acceptClips(!isAcceptingClips)}>
          {isAcceptingClips ? <>Close the floodgates! 🌊</> : <>Open the floodgates! 🚪</>}
        </Toggle>

        <div className="flex-grow" />
        <Button colour="red" className="mr-2" onClick={() => clearQueue()}>
          &times; Clear queue ({clips.length})
        </Button>
        <Toggle pressed={advancedVisible} colour="red" onClick={() => setAdvancedVisible(!advancedVisible)}>
          ⚙️
        </Toggle>
      </div>
      {advancedVisible && (
        <div className="mt-2 flex w-full">
          <div className="flex-grow" />
          <Button
            className="mr-2"
            onClick={() => {
              const newChannel = prompt('Enter channel to read chat from', channel as string);
              if (newChannel && newChannel !== channel) {
                changeChannel(newChannel);
              }
            }}
          >
            Change channel ({channel})
          </Button>
          <Button
            onClick={() => clearMemory()}
            title="Remove all clips from permanent memory, allow all clips to be posted and queued again"
          >
            &times; Purge memory ({clipMem.length})
          </Button>
        </div>
      )}
      <div className="mt-4">
        <ClipRoll clips={clips} />
      </div>
    </>
  );
}

export default QueuePage;
