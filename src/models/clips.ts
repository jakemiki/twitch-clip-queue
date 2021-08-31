export interface Clip {
  provider?: string;
  id?: string;

  title?: string;
  channel?: string;
  game?: string;

  submitter?: string;
  submitters?: string[];

  url?: string;
  thumbnailUrl?: string;

  startTime?: string;
}
