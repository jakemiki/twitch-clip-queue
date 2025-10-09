import { Group, Button, Switch } from '@mantine/core';
import { PlayerSkipForward, PlayerTrackNext, PlayerTrackPrev, Messages } from 'tabler-icons-react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  autoplayChanged,
  currentClipSkipped,
  selectAutoplayEnabled,
  selectClipLimit,
  selectNextId,
  chatReplayToggled,
  selectCurrentClip,
} from '../clipQueueSlice';
import { currentClipWatched, selectCurrentId, previousClipWatched, selectHasPrevious } from '../clipQueueSlice';

function PlayerButtons({ className }: { className?: string }) {
  const dispatch = useAppDispatch();
  const currentClipId = useAppSelector(selectCurrentId);
  const nextClipId = useAppSelector(selectNextId);
  const clipLimit = useAppSelector(selectClipLimit);
  const autoplayEnabled = useAppSelector(selectAutoplayEnabled);
  const hasPrevious = useAppSelector(selectHasPrevious);
  const currentClip = useAppSelector(selectCurrentClip);
  return (
    <Group align="flex-start" className={className}>
      <Group>
        <Switch
          label="Autoplay"
          checked={autoplayEnabled}
          onChange={(event) => dispatch(autoplayChanged(event.currentTarget.checked))}
        />
        {
          <Button
            leftIcon={<Messages />}
            onClick={() => dispatch(chatReplayToggled())}
            size="sm"
            disabled={currentClip?.Platform !== 'Twitch'}
          >
            Chat
          </Button>
        }
        {clipLimit && (
          <Button
            variant="default"
            rightIcon={<PlayerSkipForward />}
            onClick={() => dispatch(currentClipSkipped())}
            disabled={!currentClipId}
          >
            Skip
          </Button>
        )}
      </Group>
      <Button
        //prettier-ignore
        leftIcon={<PlayerTrackPrev />}
        onClick={() => dispatch(previousClipWatched())}
        disabled={!hasPrevious}
      >
        Previous
      </Button>
      <Button
        rightIcon={<PlayerTrackNext />}
        onClick={() => dispatch(currentClipWatched())}
        disabled={!currentClipId && !nextClipId}
      >
        Next
      </Button>
    </Group>
  );
}

export default PlayerButtons;
