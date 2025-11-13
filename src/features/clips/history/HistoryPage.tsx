import { Anchor, Center, Container, Grid, Pagination, Text } from '@mantine/core';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { memoryClipRemoved, selectClipHistoryIdsPage, selectClipById } from '../clipQueueSlice';
import Clip from '../Clip';
import clipProvider from '../providers/providers';

function MemoryPage() {
  const dispatch = useAppDispatch();
  const [activePage, setPage] = useState(1);
  const { clips, totalPages } = useAppSelector((state) => selectClipHistoryIdsPage(state, activePage, 24));
  const clipObjects = useAppSelector((state) => clips.map((id) => selectClipById(id)(state)).filter(Boolean));
  return (
    <Container size="xl" py="md">
      {totalPages > 0 ? (
        <>
          <Center>
            <Pagination page={activePage} onChange={setPage} total={totalPages} />
          </Center>
          <Grid py="sm">
            {clipObjects.map((clip) => (
              <Grid.Col span={2} key={clip!.id}>
                <Anchor
                  href={clipProvider.getUrl(clip!.id) || clipProvider.getChannelUrl(clip!.id, clip!)}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  underline={false}
                >
                  <Clip
                    platform={clip!.Platform || undefined}
                    card
                    clipId={clip!.id}
                    onClick={() => {}}
                    onCrossClick={(e) => {
                      e.preventDefault();
                      dispatch(memoryClipRemoved(clip!.id));
                    }}
                  />
                </Anchor>
              </Grid.Col>
            ))}
          </Grid>
        </>
      ) : (
        <Text>Clip history is empty.</Text>
      )}
    </Container>
  );
}

export default MemoryPage;
