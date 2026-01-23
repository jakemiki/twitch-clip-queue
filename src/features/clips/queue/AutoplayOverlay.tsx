import { Button, Center, RingProgress, LoadingOverlay, Stack, Text } from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectAutoplayDelay, selectNextId, selectQueueIds, selectClipById } from '../clipQueueSlice';
import Clip from '../Clip';

interface AutoplayOverlayProps {
  visible: boolean;
  onCancel?: () => void;
}

function AutoplayOverlay({ visible, onCancel }: AutoplayOverlayProps) {
  const delay = useAppSelector(selectAutoplayDelay);
  const nextClipId = useAppSelector(selectNextId);
  const overlayOn = visible && !!nextClipId;

  const intervalTime = 100;
  const step = 100 / (delay / intervalTime - 1);

  const [progress, setProgress] = useState(0);
  const interval = useInterval(() => setProgress((p) => p + step), intervalTime);

  const clipQueueIds = useAppSelector(selectQueueIds);
  const clips = useAppSelector((state) =>
    clipQueueIds.map((id) => selectClipById(id)(state)).filter((clip) => clip !== undefined)
  );
  const nextClip = clips.find((clip) => clip!.id === nextClipId);

  useEffect(() => {
    if (overlayOn) {
      interval.stop();
      interval.start();
    } else {
      setProgress(0);
      interval.stop();
    }
    return () => interval.stop();
    // eslint-disable-next-line
  }, [overlayOn]);

  if (!overlayOn) {
    return <></>;
  }
  return (
    <LoadingOverlay
      visible={true}
      overlayOpacity={0.9}
      loader={
        <Stack spacing="xs">
          <Center>
            <RingProgress
              size={96}
              thickness={16}
              sections={[{ value: progress, color: 'gray' }]}
              label={
                onCancel && (
                  <Center>
                    <Button compact size="md" variant="subtle" color="dark" onClick={onCancel}>
                      Cancel
                    </Button>
                  </Center>
                )
              }
            />
          </Center>
          <Text size="lg" weight={700}>
            Next up
          </Text>
          <Clip platform={nextClip?.Platform || 'Unknown'} clipId={nextClipId} />
        </Stack>
      }
    />
  );
}

export default AutoplayOverlay;
