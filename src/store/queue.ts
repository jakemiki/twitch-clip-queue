import { createState, none } from '@hookstate/core';
import { trace } from '../common/analytics';
import { Clip, ClipSubmitter } from '../models';
import { createPersistentState, same } from './helpers';

export const currentClip = createState({} as Clip);
export const clipQueue = createPersistentState('clipQueue', [] as Clip[]);
export const clipMemory = createPersistentState('clipMemory', [] as Clip[]);
export const acceptingClips = createState(false);

export const addClip = (clip: Clip): void => {
  const queuedState = clipQueue.find((c) => same(c.get(), clip));
  const queued = queuedState?.get();

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
  }

  clipMemory.set((memory) => [...(memory ?? []), clip]);
  clipQueue.set((queue) => [...(queue ?? []), clip]);

  trace('clip-added');
};

export const nextClip = (): void => {
  currentClip.set(JSON.parse(JSON.stringify(clipQueue[0]?.get() ?? {})));
  clipQueue[0].set(none);

  trace('next-clip');
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
};

export const clearQueue = (): void => {
  clipQueue.set([]);
  currentClip.set({});

  trace('clear-queue');
};

export const clearMemory = (): void => {
  clipMemory.set([...(clipQueue.get() ?? [])]);

  trace('purge-memory');
};

export const acceptClips = (accept: boolean): void => {
  acceptingClips.set(accept);

  trace(`accept-clips-${accept}`);
};

export const reloadClip = (): void => {
  currentClip.hash.set(() => Date.now().toString());
};
