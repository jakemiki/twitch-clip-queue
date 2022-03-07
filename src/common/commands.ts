import ClipFinder from '../services/ClipFinder';
import { acceptClips, clearMemory, clearQueue, nextClip, removeClip, setSoftClipLimit, toggleAutoplay } from '../store/queue';

const queueremove: (url: string) => void = (url) => {
  if (!url) {
    return;
  }

  if (url.startsWith('http')) {
    const clipInfo = ClipFinder.getInfoByUrl(url);
    if (clipInfo) {
      removeClip(clipInfo);
    }
  }
};

export const commands: Record<string, (...args: string[]) => void> = {
  queuenext: () => nextClip(),
  queueclose: () => acceptClips(false),
  queueopen: () => acceptClips(true),
  queueclear: () => clearQueue(),
  queuepurgememory: () => clearMemory(),
  queueautoplay: (val) =>
    toggleAutoplay(['1', 'on', 'true'].includes(val) ? true : ['0', 'off', 'false'].includes(val) ? false : undefined),
  queuesoftlimit: (limit) => limit !== null && Number.isInteger(+limit) && setSoftClipLimit(+limit),
  queueremove,
};
