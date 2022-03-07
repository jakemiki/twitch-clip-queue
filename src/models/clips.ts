export interface ClipSubmitter {
  displayName?: string;
  userName: string;
}

export interface ClipInfo {
  provider?: string;
  id?: string;

  startTime?: string;
}

export interface Clip extends ClipInfo {
  hash?: string;

  title?: string;
  channel?: string;
  game?: string;
  timestamp?: string;

  submitter?: ClipSubmitter;
  submitters?: ClipSubmitter[];

  url?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
}
