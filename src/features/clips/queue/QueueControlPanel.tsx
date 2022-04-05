import { Group, Text, SegmentedControl, Stack } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  isOpenChanged,
  selectClipLimit,
  selectIsOpen,
  selectQueueIds,
  selectTotalQueueLength,
} from '../clipQueueSlice';
import QueueQuickMenu from './QueueQuickMenu';

interface QueueControlPanelProps {
  className?: string;
}

function QueueControlPanel({ className }: QueueControlPanelProps) {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsOpen);
  const clipLimit = useAppSelector(selectClipLimit);
  const totalClips = useAppSelector(selectTotalQueueLength);
  const clipsLeft = useAppSelector(selectQueueIds).length;

  return (
    <Stack spacing={0} className={className}>
      <Group>
        <Text size="lg" weight={700} sx={{ flexGrow: 1 }}>
          Queue
        </Text>
        <SegmentedControl
          size="xs"
          sx={{ flexBasis: 196 }}
          value={isOpen ? 'open' : 'closed'}
          data={[
            { label: 'Closed', value: 'closed' },
            { label: 'Open', value: 'open' },
          ]}
          onChange={(state) => dispatch(isOpenChanged(state === 'open'))}
        />
        <QueueQuickMenu />
      </Group>
      <Text size="md" weight={700} sx={{ flexGrow: 1 }} mt={0} pt={0}>
        {clipsLeft} of {totalClips}
        {clipLimit && `/${clipLimit}`} clips left
      </Text>
    </Stack>
  );
}

export default QueueControlPanel;
