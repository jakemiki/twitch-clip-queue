import { acceptClips, clearMemory, clearQueue, nextClip, setSoftClipLimit } from '../store/queue';

export const commands: Record<string, (...args: string[]) => void> = {
  queuenext: () => nextClip(),
  queueclose: () => acceptClips(false),
  queueopen: () => acceptClips(true),
  queueclear: () => clearQueue(),
  queuepurgememory: () => clearMemory(),
  queuesoftlimit: (limit) => limit !== null && Number.isInteger(+limit) && setSoftClipLimit(+limit),
};
