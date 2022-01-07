import { acceptClips, clearMemory, clearQueue, nextClip, setSoftClipLimit, toggleAutoplay } from '../store/queue';

export const commands: Record<string, (...args: string[]) => void> = {
  queuenext: () => nextClip(),
  queueclose: () => acceptClips(false),
  queueopen: () => acceptClips(true),
  queueclear: () => clearQueue(),
  queuepurgememory: () => clearMemory(),
  queueautoplay: (val) =>
    toggleAutoplay(['1', 'on', 'true'].includes(val) ? true : ['0', 'off', 'false'].includes(val) ? false : undefined),
  queuesoftlimit: (limit) => limit !== null && Number.isInteger(+limit) && setSoftClipLimit(+limit),
};
