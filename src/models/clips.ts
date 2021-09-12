export interface ClipSubmitter {
  displayName?: string;
  userName: string;
}

export interface Clip {
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

  startTime?: string;
}
