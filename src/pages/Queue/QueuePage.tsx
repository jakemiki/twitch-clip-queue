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
  reloadClip,
} from '../../store/queue';
import { accessToken, changeChannel, userChannel, userName } from '../../store/user';
import ClipRoll from './ClipRoll';
import Player from './Player';
import './styles.css';
import Page from '../Page';
import { getUrlFromMessage } from '../../common/utils';

function QueuePage() {
  const [advancedVisible, setAdvancedVisible] = useState(false);

  const isAcceptingClips = useHookState(acceptingClips).get();
  const clips = useHookState(clipQueue).get();
  const clipMem = useHookState(clipMemory).get();
  const current = useHookState(currentClip).get();

  const token = useHookState(accessToken).get();
  const name = useHookState(userName).get();
  const channel = useHookState(userChannel).get();

  useEffect(() => {
    TwitchChat.connect();
    return () => {
      TwitchChat.disconnect();
    };
  }, [token]);

  return (
    <Page fullWidth={true}>
      <div className="w-full queue-page">
        <Player clip={current} key={current.hash} />
        <div className="buttons-container relative">
          <div className="flex w-full">
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

            <div className="ml-4 font-bold text-xl leading-loose">
              {isAcceptingClips
                ? 'Clip submissions are open. Send some clips in chat!'
                : "Clip submissions are closed."}
            </div>
          </div>
          {advancedVisible && (
            <div className="absolute flex w-full -top-14">
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
                  const message = prompt('Enter clip url', '');
                  const url = getUrlFromMessage(message ?? '');
                  if (url) {
                    ClipFinder.findByUrl(url).then((clip) => {
                      if (clip) {
                        clip.hash = Date.now().toString();
                        clip.url = url;
                        clip.submitter = { userName: name ?? '', displayName: name ?? '' };
                        addClip(clip);
                      }
                    });
                  }
                }}
              >
                + Add cilp
              </Button>
              <Button
                className="mr-2"
                onClick={() => reloadClip()}>
                ♻️
              </Button>
              <Button
                onClick={() => clearMemory()}
                title="Remove all clips from permanent memory, allow all clips to be posted and queued again"
              >
                &times; Purge memory <em>({clipMem.length})</em>
              </Button>
            </div>
          )}
        </div>
        <div className="nextup-container">
          <div className="w-full flex border-b-2 mb-2 align-text-bottom">
            <h2>Next up</h2>
            <div className="flex-grow"></div>
            <h2>{clips.length}</h2>
          </div>
          <ClipRoll clips={clips} />
        </div>
      </div>
    </Page>
  );
}

export default QueuePage;
