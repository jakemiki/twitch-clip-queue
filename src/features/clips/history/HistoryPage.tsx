import { Anchor, Center, Container, Grid, Pagination, Text } from '@mantine/core';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import Clip from '../Clip';
import { memoryClipRemoved, selectClipHistoryIdsPage } from '../clipQueueSlice';
import clipProvider from '../providers/providers';

function MemoryPage() {
  const dispatch = useAppDispatch();
  const [activePage, setPage] = useState(1);
  const { clips, totalPages } = useAppSelector((state) => selectClipHistoryIdsPage(state, activePage, 24));

  return (
    <Container size="xl" py="md">
      {totalPages > 0 ? (
        <>
          <Center>
            <Pagination page={activePage} onChange={setPage} total={totalPages} />
          </Center>
          <Grid py="sm">
            {clips.map((id) => (
              <Grid.Col span={2} key={id}>
                <Anchor href={clipProvider.getUrl(id)} target="_blank" referrerPolicy="no-referrer" underline={false}>
                  <Clip
                    card
                    clipId={id}
                    onClick={() => {}}
                    onCrossClick={(e) => {
                      e.preventDefault();
                      dispatch(memoryClipRemoved(id));
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
