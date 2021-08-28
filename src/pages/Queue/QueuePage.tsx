import React, { useEffect } from 'react';
import TwitchChat from '../../services/TwitchChat';
import { clearMemory, clearQueue, clipMemory, clipQueue, currentClip, nextClip } from '../../store/queue';
import { changeChannel, userChannel, userName } from '../../store/user';
import ClipRoll from './ClipRoll';
import Player from './Player';
import './styles.css';

function QueuePage() {
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
      <div className="my-4 flex w-full">
        <button className="mr-2 btn btn-play" onClick={() => nextClip()}>
          Next &raquo;
        </button>

        <div className="flex-grow" />

        <button
          className="mr-2 btn btn-skip"
          onClick={() => {
            const newChannel = prompt('Enter channel to read chat from', channel as string);
            if (newChannel && newChannel !== channel) {
              changeChannel(newChannel);
            }
          }}
        >
          Change channel ({channel})
        </button>
        <button className="mr-2 btn btn-clear" onClick={() => clearMemory()}>
          &times; Purge memory ({clipMem.length})
        </button>
        <button className="mr-2 btn btn-clear" onClick={() => clearQueue()}>
          &times; Clear queue ({clips.length})
        </button>
      </div>
      <div>
        <ClipRoll clips={clips} />
      </div>
    </>
  );
}

export default QueuePage;
