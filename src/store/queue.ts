import { createState, none } from '@hookstate/core';
import { trace } from '../common/analytics';
import { Clip, ClipInfo, ClipSubmitter } from '../models';
import { createPersistentState, same } from './helpers';

export const currentClip = createState({} as Clip);
export const clipQueue = createPersistentState('clipQueue', [] as Clip[]);
export const clipMemory = createPersistentState('clipMemory', [] as Clip[]);
export const acceptingClips = createState(false);
export const softClipLimit = createPersistentState('softClipLimit', 0);
export const softClipCount = createState(0);
export const autoplay = createPersistentState('autoplay', false);
export const useReactPlayer = createState(false);
export const autoplayTimeoutHandle = createState(-1);

const addClipToMemory = (clip: Clip): void => {
  if (clip) {
    clipMemory.set((memory) => [JSON.parse(JSON.stringify(clip)), ...(memory ?? [])]);
  }
};

export const addClip = (clip: Clip): void => {
  const queuedState = clipQueue.find((c) => same(c.get(), clip));
  const queued = queuedState?.get();
  const limit = softClipLimit.get();

  if (queued) {
    const sameSubmitter =
      queued.submitter?.userName === clip.submitter?.userName ||
      (queued.submitters?.find((s) => s.userName === clip.submitter?.userName) ?? false);

    if (!sameSubmitter) {
      queuedState?.submitters.set((submitters) => [...(submitters ?? []), clip.submitter as ClipSubmitter]);
      clipQueue.set((queue) => queue.sort((a, b) => (b.submitters?.length ?? 0) - (a.submitters?.length ?? 0)));
    }

    return;
  } else if (limit && softClipCount.get() >= limit) {
    return;
  } else if (getMemorizedClip(clip)) {
    return;
  }

  clipQueue.set((queue) => [...(queue ?? []), clip]);
  softClipCount.set((c) => c + 1);

  trace('clip-added');
};

export const nextClip = (uncount = false): void => {
  const next = clipQueue[0]?.get();
  currentClip.set(JSON.parse(JSON.stringify(next ?? {})));
  addClipToMemory(next);
  clipQueue[0].set(none);

  if (uncount) {
    softClipCount.set((c) => Math.max(c - 1, 0));
  }

  useReactPlayer.set(autoplay.get());
  cancelDelayedNextClip();

  if (next) {
    trace('next-clip');
    trace('?visit-time-extender', 'view');
  }
};

export const getMemorizedClip = (clip: ClipInfo): Clip | undefined => {
  const queue = clipQueue.find((c) => same(c.get(), clip));
  if (queue) {
    return queue?.get();
  }
  const memory = clipMemory.find((c) => same(c.get(), clip));
  if (memory) {
    return memory?.get();
  }
  return undefined;
};

export const getQueuedClip = (clip: ClipInfo): Clip | undefined => {
  const queue = clipQueue.find((c) => same(c.get(), clip));
  return queue?.get();
};

export const selectCurrentClip = (clip: Clip): void => {
  const queued = getQueuedClip(clip);
  if (queued) {
    useReactPlayer.set(autoplay.get());
    currentClip.set(JSON.parse(JSON.stringify(queued)));
    removeClip(queued);
  }
};

export const removeClip = (clip: ClipInfo): void => {
  const index = clipQueue.findIndex((c) => same(c.get(), clip));
  addClipToMemory(clipQueue[index].get());
  clipQueue[index].set(none);
  softClipCount.set((c) => Math.max(c - 1, 0));
};

export const clearQueue = (): void => {
  clipQueue.set([]);
  currentClip.set({});
  softClipCount.set(0);

  trace('clear-queue');
};

export const clearMemory = (count?: number): void => {
  if (!count) {
    clipMemory.set([]);
  } else {
    clipMemory.set((m) => m.slice(0, -count));
  }

  trace('purge-memory');
};

export const acceptClips = (accept: boolean): void => {
  acceptingClips.set(accept);
  if (accept) {
    softClipCount.set(clipQueue.length);
  }

  trace(`accept-clips-${accept}`);
};

export const reloadClip = (): void => {
  currentClip.hash.set(() => Date.now().toString());
};

export const setSoftClipLimit = (limit: number): void => {
  softClipLimit.set(limit);

  trace('set-soft-limit');
};

export const toggleAutoplay = (ap?: boolean): void => {
  ap = ap ?? !autoplay.get();
  autoplay.set(ap);

  if (ap) {
    useReactPlayer.set(true);
  } else {
    cancelDelayedNextClip();
  }

  trace(`toggle-autoplay-${ap}`);
};

export const delayedNextClip = (): void => {
  cancelDelayedNextClip();

  const timeoutHandle = setTimeout(() => nextClip(), 1000) as unknown as number;
  autoplayTimeoutHandle.set(timeoutHandle);
};

export const cancelDelayedNextClip = (): void => {
  let timeoutHandle = autoplayTimeoutHandle.get();
  if (timeoutHandle) {
    clearTimeout(timeoutHandle);
  }
};
