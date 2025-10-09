import { Container, Grid, Group, Stack, ScrollArea } from '@mantine/core';
import Player from '../Player';
import PlayerButtons from '../PlayerButtons';
import PlayerTitle from '../PlayerTitle';
import Queue from '../Queue';
import QueueControlPanel from '../QueueControlPanel';
import ChatReplay from '../ChatReplay';
import { useAppSelector } from '../../../../app/hooks';
import { selectChatReplayEnabled } from '../../clipQueueSlice';

function ClassicLayout() {
  const chatReplayEnabled = useAppSelector(selectChatReplayEnabled);

  return (
    <Container fluid py="md" sx={{ height: '100%' }}>
      <Grid sx={{ height: '100%' }} columns={24}>
        <Grid.Col
          xs={chatReplayEnabled ? 18 : 14}
          sm={chatReplayEnabled ? 18 : 15}
          md={chatReplayEnabled ? 18 : 15}
          lg={chatReplayEnabled ? 18 : 17}
          xl={chatReplayEnabled ? 19 : 19}
          span={chatReplayEnabled ? 19 : 19}
        >
          <Stack justify="flex-start" spacing="xs" sx={{ height: '100%' }}>
            <Player />
            <Group position="apart">
              <PlayerTitle />
              <PlayerButtons />
            </Group>
          </Stack>
        </Grid.Col>
        {chatReplayEnabled && (
          <Grid.Col xs={6} sm={6} md={6} lg={6} xl={5} span={5} sx={{ height: '100%' }}>
            <Stack justify="flex-start" sx={{ height: '100%', maxHeight: '100%' }}>
              <ChatReplay visible={chatReplayEnabled} />
            </Stack>
          </Grid.Col>
        )}
        {!chatReplayEnabled && (
          <Grid.Col xs={10} sm={9} md={9} lg={7} xl={5} span={5} sx={{ height: '100%' }}>
            <Stack justify="flex-start" sx={{ height: '100%', maxHeight: '100%' }}>
              <QueueControlPanel />
              <ScrollArea sx={{ '.mantine-ScrollArea-viewport > div': { display: 'block !important' } }}>
                <Group direction="column" spacing="xs" sx={{ height: '100%' }}>
                  <Queue />
                </Group>
              </ScrollArea>
            </Stack>
          </Grid.Col>
        )}
      </Grid>
    </Container>
  );
}

export default ClassicLayout;
