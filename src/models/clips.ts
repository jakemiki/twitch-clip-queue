export interface ClipSubmitter {
  displayName?: string;
  userName: string;
}

export interface Clip {
  hash?: string;

  provider?: string;
  id?: string;

  title?: string;
  channel?: string;
  game?: string;
  timestamp?: string;

  submitter?: ClipSubmitter;
  submitters?: ClipSubmitter[];

  url?: string;
  thumbnailUrl?: string;
  videoUrl?: string;

  startTime?: string;
}
