import { Button, Center, RingProgress, LoadingOverlay, Stack, Text } from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../app/hooks';
import Clip from '../Clip';
import { selectAutoplayDelay, selectNextId } from '../clipQueueSlice';

interface AutoplayOverlayProps {
  visible: boolean;
  onCancel?: () => void;
}

function AutoplayOverlay({ visible, onCancel }: AutoplayOverlayProps) {
  const delay = useAppSelector(selectAutoplayDelay);
  const nextClipId = useAppSelector(selectNextId);
  const overlayOn = visible && !!nextClipId;

  const intervalTime = 100;
  const step = (100 / (delay / intervalTime - 1));

  const [progress, setProgress] = useState(0);
  const interval = useInterval(() => setProgress((p) => p + step), intervalTime);

  useEffect(() => {
    if (overlayOn) {
      interval.start();
      return interval.stop;
    } else {
      setProgress(0);
    }
  }, [overlayOn, interval]);

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
          <Clip clipId={nextClipId} />
        </Stack>
      }
    />
  );
}

export default AutoplayOverlay;
