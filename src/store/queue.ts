import { createState, none } from '@hookstate/core';
import { trace } from '../common/analytics';
import { Clip, ClipSubmitter } from '../models';
import { createPersistentState, same } from './helpers';

export const currentClip = createState({} as Clip);
export const clipQueue = createPersistentState('clipQueue', [] as Clip[]);
export const clipMemory = createPersistentState('clipMemory', [] as Clip[]);
export const acceptingClips = createState(false);
export const softClipLimit = createPersistentState('softClipLimit', 0);
export const softClipCount = createState(0);

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
  } else if (getMemorizedClip(clip)) {
    return;
  } else if (limit && softClipCount.get() >= limit) {
    return;
  }

  clipMemory.set((memory) => [...(memory ?? []), clip]);
  clipQueue.set((queue) => [...(queue ?? []), clip]);
  softClipCount.set((c) => c + 1);

  trace('clip-added');
};

export const nextClip = (): void => {
  currentClip.set(JSON.parse(JSON.stringify(clipQueue[0]?.get() ?? {})));
  clipQueue[0].set(none);

  trace('next-clip');
  trace('?visit-time-extender', 'view');
};

export const getMemorizedClip = (clip: Clip): Clip | undefined => {
  const memory = clipMemory.find((c) => same(c.get(), clip));
  return memory?.get();
};

export const getQueuedClip = (clip: Clip): Clip | undefined => {
  const queue = clipQueue.find((c) => same(c.get(), clip));
  return queue?.get();
};

export const selectCurrentClip = (clip: Clip): void => {
  const queued = getQueuedClip(clip);
  if (queued) {
    currentClip.set(JSON.parse(JSON.stringify(queued)));
    removeClip(queued);
  }
};

export const removeClip = (clip: Clip): void => {
  const index = clipQueue.findIndex((c) => same(c.get(), clip));
  clipQueue[index].set(none);
  softClipCount.set((c) => Math.max(c - 1, 0));
};

export const clearQueue = (): void => {
  clipQueue.set([]);
  currentClip.set({});
  softClipCount.set(0);

  trace('clear-queue');
};

export const clearMemory = (): void => {
  clipMemory.set([...(clipQueue.get() ?? [])]);

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
}
