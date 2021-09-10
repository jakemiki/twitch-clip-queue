import { createState } from '@hookstate/core';
import { Clip } from '../models';
import { umami } from '../umami';
import { createPersistentState, same } from './helpers';

export const currentClip = createState({} as Clip);
export const clipQueue = createPersistentState('clipQueue', [] as Clip[]);
export const clipMemory = createPersistentState('clipMemory', [] as Clip[]);
export const acceptingClips = createState(false);

export const addClip = (clip: Clip): void => {
  const queued = getQueuedClip(clip);
  if (queued) {
    const sameSubmitter =
      queued.submitter === clip.submitter || (queued.submitters?.includes(clip.submitter as string) ?? false);
    if (!sameSubmitter) {
      const newQueued = {
        ...queued,
        submitters: [...(queued?.submitters ?? []), clip.submitter as string],
      };
      clipQueue.set((queue) =>
        queue
          .map((c) => (same(c, newQueued) ? newQueued : c))
          .sort((a, b) => (b.submitters?.length ?? 0) - (a.submitters?.length ?? 0))
      );
    }

    return;
  } else if (getMemorizedClip(clip)) {
    return;
  }

  clipMemory.set((memory) => [...(memory ?? []), clip]);
  clipQueue.set((queue) => [...(queue ?? []), clip]);

  umami('clip-added');
};

export const nextClip = (): void => {
  clipQueue.set((queue) => {
    const next = (queue ?? []).shift();

    currentClip.set(next ?? {});

    return [...queue];
  });
};

export const getMemorizedClip = (clip: Clip): Clip | undefined => {
  const memory = clipMemory.get();

  return memory?.find((c) => same(c, clip)) ?? undefined;
};

export const getQueuedClip = (clip: Clip): Clip | undefined => {
  const queue = clipQueue.get();

  return queue?.find((c) => same(c, clip)) ?? undefined;
};

export const selectCurrentClip = (clip: Clip): void => {
  const queued = getQueuedClip(clip);
  if (queued) {
    currentClip.set(queued);
    removeClip(queued);
  }
};

export const removeClip = (clip: Clip): void => {
  clipQueue.set(queue => queue.filter(c => !same(c, clip)));
};

export const clearQueue = (): void => {
  clipQueue.set([]);
  currentClip.set({});
  umami('clear-queue');
};

export const clearMemory = (): void => {
  clipMemory.set([...(clipQueue.get() ?? [])]);
  umami('purge-memory');
};

export const acceptClips = (accept: boolean): void => {
  acceptingClips.set(accept);
}
