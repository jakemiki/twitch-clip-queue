import { createAction } from '@reduxjs/toolkit';
import type { AppDispatch } from '../../app/store';
import type { Clip } from '../clips/clipQueueSlice';

interface LegacyClip {
  id: string;
  channel: string;
  provider: string;
  thumbnailUrl: string;
  title: string;
  timestamp: string;
  startTime: string;

  submitter: { userName: string };
  submitters: { userName: string }[];
}

interface LegacyMigrationData {
  autoplay: boolean;
  clipLimit: number | null;
  channel: string | undefined;
  providers: string[] | undefined;

  byIds: Record<string, Clip>;
  queueIds: string[];
  historyIds: string[];
  currentId: string | undefined;
}

export const legacyDataMigrated = createAction<LegacyMigrationData>('migration/legacyDataMigrated');

function convertLegacyClip(clip: LegacyClip): Clip {
  let id = `${clip.provider}:${clip.id}`;
  if (clip.startTime) {
    id = `${id};${clip.startTime}`;
  }

  const submitters = [clip.submitter.userName];
  if (clip.submitters) {
    submitters.push(...clip.submitters.map((s) => s.userName));
  }

  return {
    id,
    submitters,
    author: clip.channel,
    createdAt: clip.timestamp,
    thumbnailUrl: clip.thumbnailUrl,
    timestamp: new Date().toISOString(),
    title: clip.title,
  };
}

export function tryMigrateLegacyData(dispatch: AppDispatch) {
  if (localStorage.getItem('legacy-data-migration') || !localStorage.getItem('clipQueue')) {
    return;
  }

  localStorage.setItem('legacy-data-migration', 'done');

  const autoplay = localStorage.getItem('autoplay') === 'true';
  const clipLimit = Number.parseInt(localStorage.getItem('softClipLimit') ?? '');
  const channel = localStorage.getItem('userChannel')?.replaceAll('"', '');
  const providers = localStorage
    .getItem('enabledClipProviders')
    ?.replaceAll('"', '')
    .split(',')
    .map((provider) => provider.trim());

  const legacyData: LegacyMigrationData = {
    autoplay,
    clipLimit: Number.isInteger(clipLimit) ? clipLimit : null,
    channel,
    providers,

    byIds: {},
    queueIds: [],
    historyIds: [],
    currentId: undefined,
  };

  const currentClipJson = localStorage.getItem('currentClip');
  if (currentClipJson) {
    const currentClip = JSON.parse(currentClipJson) as LegacyClip;
    if (currentClip.id) {
      const convertedClip = convertLegacyClip(currentClip);
      legacyData.currentId = convertedClip.id;
      legacyData.byIds[convertedClip.id] = convertedClip;
    }
  }

  const clipQueueJson = localStorage.getItem('clipQueue');
  if (clipQueueJson) {
    const clipQueue = JSON.parse(clipQueueJson) as LegacyClip[];
    if (clipQueue) {
      clipQueue.forEach((clip) => {
        const convertedClip = convertLegacyClip(clip);

        legacyData.byIds[convertedClip.id] = convertedClip;
        legacyData.queueIds.push(convertedClip.id);
        legacyData.queueIds = Array.from(new Set(legacyData.queueIds));
      });
    }
  }

  const clipMemoryJson = localStorage.getItem('clipMemory');
  if (clipMemoryJson) {
    const clipMemory = JSON.parse(clipMemoryJson) as LegacyClip[];
    if (clipMemory) {
      clipMemory.forEach((clip) => {
        const convertedClip = convertLegacyClip(clip);

        legacyData.byIds[convertedClip.id] = convertedClip;
        legacyData.historyIds.push(convertedClip.id);
        legacyData.historyIds = Array.from(new Set(legacyData.historyIds));
      });
    }
  }

  dispatch(legacyDataMigrated(legacyData));
}
