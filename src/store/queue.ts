import { Clip } from '../models';
import { createEntity, same } from './helpers';

export const currentClip = createEntity('currentClip', {} as Clip);
export const clipQueue = createEntity('clipQueue', [] as Clip[]);
export const clipMemory = createEntity('clipMemory', [] as Clip[]);

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

export const clearQueue = (): void => {
  clipQueue.set([]);
  currentClip.set({});
};

export const clearMemory = (): void => {
  clipMemory.set([...(clipQueue.get() ?? [])]);
};
