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
  autoplay,
  clearMemory,
  clearQueue,
  clipMemory,
  clipQueue,
  currentClip,
  delayedNextClip,
  nextClip,
  reloadClip,
  setSoftClipLimit,
  softClipCount,
  softClipLimit,
  toggleAutoplay,
  useReactPlayer,
} from '../../store/queue';
import { accessToken, changeChannel, userChannel, userName } from '../../store/user';
import ClipRoll from './ClipRoll';
import Player from './Player';
import './styles.css';
import Page from '../Page';
import { getUrlFromMessage } from '../../common/utils';

function QueuePage() {
  const [advancedVisible, setAdvancedVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);

  const isAcceptingClips = useHookState(acceptingClips).get();
  const clips = useHookState(clipQueue).get();
  const clipMem = useHookState(clipMemory).get();
  const current = useHookState(currentClip).get();

  const token = useHookState(accessToken).get();
  const name = useHookState(userName).get();
  const channel = useHookState(userChannel).get();
  const softLimit = useHookState(softClipLimit).get();
  const autoplayEnabled = useHookState(autoplay).get();
  const reactPlayer = useHookState(useReactPlayer).get();

  const limitReached = useHookState(softClipCount).get() >= softLimit;

  let statusText = 'Clip submissions are open. Send some clips in chat!';
  if (!isAcceptingClips) {
    statusText = 'Clip submissions are closed.';
  } else if (softLimit > 0 && limitReached) {
    statusText = 'Clip limit reached. Send clips queued by others to boost them to the top 👆';
  }

  useEffect(() => {
    TwitchChat.connect();
    return () => {
      TwitchChat.disconnect();
    };
  }, [token]);

  return (
    <Page fullWidth={true}>
      <div className="w-full queue-page">
        <Player
          clip={current}
          key={current.hash}
          useReactPlayer={reactPlayer}
          onEnded={() => autoplayEnabled && delayedNextClip()}
        />
        <div className="buttons-container relative">
          <div className="flex w-full items-start">
            <Button colour="green" className="mr-2" onClick={() => nextClip()}>
              Next &raquo;
            </Button>
            <Toggle
              pressed={autoplayEnabled}
              colour="green"
              className="mr-2"
              onClick={() => toggleAutoplay(!autoplayEnabled)}
            >
              Autoplay is {autoplayEnabled ? <>on</> : <>off</>}
            </Toggle>
            {!!softLimit && (
              <Button
                colour="red"
                className="mr-2"
                onClick={() => nextClip(true)}
                title="Skipping a clip opens up a slot for another clip to be posted if gates are still open"
              >
                &times; Skip
              </Button>
            )}
            <Toggle pressed={isAcceptingClips} className="mr-2" onClick={() => acceptClips(!isAcceptingClips)}>
              {isAcceptingClips ? <>Close the floodgates! 🌊</> : <>Open the floodgates! 🚪</>}
            </Toggle>
            <Toggle pressed={advancedVisible} onClick={() => setAdvancedVisible(!advancedVisible)}>
              ⚙️
            </Toggle>

            <div className="ml-4 font-bold text-xl leading-loose">{statusText}</div>
          </div>
          {advancedVisible && (
            <div className="absolute flex items-start -top-20 pb-1 pt-7 bg-gray-900 bg-opacity-70">
              <Button
                className="mr-2"
                title="Change channel to read clips from"
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
                title="Soft clip limit - after set value no new clips are accepted, current clips can still be voted on"
                onClick={() => {
                  const newLimit = prompt(
                    'Set a soft limit after which no new clips will be accepted (0 to disable)',
                    softLimit.toString()
                  );
                  if (newLimit !== null && Number.isInteger(+newLimit)) {
                    setSoftClipLimit(+newLimit);
                  }
                }}
              >
                Clip limit <em>({softLimit})</em>
              </Button>
              <Button
                className="mr-2"
                title="Add clip from url"
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
                + Add clip
              </Button>
              <Button className="mr-2" title="Reload current clip" onClick={() => reloadClip()}>
                ♻️ Reload clip
              </Button>
              <Button className="mr-2" onClick={() => clearQueue()} title="Clear current queue">
                &times; Clear queue <em>({clips.length})</em>
              </Button>
              <Button
                onClick={() => clearMemory()}
                title="Remove all clips from permanent memory, allow all clips to be queued again"
              >
                &times; Purge memory <em>({clipMem.length})</em>
              </Button>
            </div>
          )}
        </div>
        <div className="nextup-container">
          <div className="w-full flex border-b-2 mb-2 align-text-bottom">
            <h2
              className={historyVisible ? 'text-gray-700 hover:text-indigo-50 cursor-pointer' : undefined}
              onClick={() => setHistoryVisible(false)}
            >
              Next up
            </h2>
            <div className="flex-grow"></div>
            <h2
              className={!historyVisible ? 'text-gray-700 hover:text-indigo-50 cursor-pointer' : undefined}
              onClick={() => setHistoryVisible(true)}
            >
              History
            </h2>
            <div className="flex-grow"></div>
            <h2>{clips.length}</h2>
          </div>
          {!historyVisible ? <ClipRoll clips={clips} /> : <ClipRoll clips={clipMem} noButtons/>}
        </div>
      </div>
    </Page>
  );
}

export default QueuePage;
