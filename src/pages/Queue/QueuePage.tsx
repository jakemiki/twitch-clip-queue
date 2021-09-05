import React, { useEffect, useState } from 'react';
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
              const newChannel = prompt('Enter channel to read chat from', channel as string);
              if (newChannel && newChannel !== channel) {
                changeChannel(newChannel);
              }
            }}
          >
            Change channel <em>({channel})</em>
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
        <ClipRoll clips={clips} />
      </div>
    </>
  );
}

export default QueuePage;
