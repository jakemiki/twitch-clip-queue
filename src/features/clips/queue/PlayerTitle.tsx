import { Box, Text } from '@mantine/core';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useAppSelector } from '../../../app/hooks';
import { selectCurrentClip } from '../clipQueueSlice';

interface PlayerTitleProps {
  className?: string;
}

const _nbsp = <>&nbsp;</>;

function PlayerTitle({ className }: PlayerTitleProps) {
  const currentClip = useAppSelector(selectCurrentClip);

  return (
    <Box className={className} sx={{ strong: { fontWeight: 600 } }}>
      <Text size="xl" weight={700} lineClamp={1}>
        {currentClip?.title ?? _nbsp}
      </Text>
      <Text color="dimmed" size="sm" lineClamp={1}>
        <strong>{currentClip?.author ?? _nbsp}</strong>
        {currentClip?.category && (
          <>
            {' ('}
            <strong>{currentClip?.category}</strong>
            {')'}
          </>
        )}
        {currentClip?.submitters[0] && (
          <>
            , submitted by <strong>{currentClip?.submitters[0]}</strong>
            {currentClip?.submitters.length > 1 && <> and {currentClip.submitters.length - 1} other(s)</>}
          </>
        )}
        {currentClip?.createdAt && <>, created {formatDistanceToNow(parseISO(currentClip?.createdAt))} ago</>}
      </Text>
    </Box>
  );
}

export default PlayerTitle;
