import { ActionIcon, AspectRatio, Image, Box, Group, Skeleton, Stack, Text } from '@mantine/core';
import { MouseEventHandler } from 'react';
import { Trash } from 'tabler-icons-react';
import { useAppSelector } from '../../app/hooks';
import { selectClipById } from './clipQueueSlice';

interface ClipProps {
  clipId: string;

  onClick?: MouseEventHandler<HTMLDivElement>;
  onCrossClick?: MouseEventHandler<HTMLButtonElement>;

  className?: string;
  card?: boolean;
}

function Clip({ clipId, onClick, onCrossClick, className, card }: ClipProps) {
  const { title, thumbnailUrl = '', author, submitters } = useAppSelector(selectClipById(clipId));

  return (
    <Box
      sx={(theme) => ({
        position: 'relative',
        height: '100%',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        '& .clip--action-icon': { display: 'none' },
        '&:hover .clip--action-icon': { display: 'block' },
        '&:hover .clip--title': { color: onClick ? theme.colors.indigo[5] : undefined },
      })}
    >
      <Group
        align="flex-start"
        spacing="xs"
        direction={card ? 'column' : 'row'}
        noWrap
        className={className}
        sx={{
          cursor: onClick ? 'pointer' : undefined,
          '&:active': onClick
            ? {
                paddingTop: 1,
                marginBottom: -1,
              }
            : {},
        }}
        onClick={onClick}
      >
        <AspectRatio
          ratio={16 / 9}
          sx={{
            width: card ? '100%' : '9rem',
            minWidth: card ? undefined : '9rem',
            maxWidth: card ? undefined : '33%',
          }}
        >
          <Skeleton visible={!thumbnailUrl}>
            <Image src={thumbnailUrl} sx={{ backgroundColor: '#373A40', borderRadius: 4 }} />
          </Skeleton>
        </AspectRatio>
        <Stack spacing={0} align="flex-start" sx={{ width: '100%' }}>
          <Skeleton visible={!title}>
            <Text
              className="clip--title"
              weight="700"
              size="sm"
              lineClamp={2}
              title={title}
            >
              {title}&nbsp;
            </Text>
          </Skeleton>
          <Skeleton visible={!author} height="xs">
            <Text size="xs" weight="700" color="dimmed" lineClamp={1} title={author}>
              {author}&nbsp;
            </Text>
          </Skeleton>
          {submitters?.[0] && (
            <Text size="xs" color="dimmed" lineClamp={1} title={submitters.join('\n')}>
              Submitted by <strong>{submitters[0]}</strong>
              {submitters.length > 1 && ` +${submitters.length - 1}`}
            </Text>
          )}
        </Stack>
      </Group>
      {onCrossClick && (
        <ActionIcon
          className="clip--action-icon"
          color="red"
          variant="filled"
          sx={{ position: 'absolute', left: 0, top: 0, opacity: 0.8, zIndex: 100 }}
          onClick={onCrossClick}
        >
          <Trash size={12} />
        </ActionIcon>
      )}
    </Box>
  );
}

export default Clip;
