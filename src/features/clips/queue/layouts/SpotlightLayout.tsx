import { Container, Grid, Group } from '@mantine/core';
import Player from '../Player';
import PlayerButtons from '../PlayerButtons';
import PlayerTitle from '../PlayerTitle';
import Queue from '../Queue';
import QueueControlPanel from '../QueueControlPanel';

function SpotlightLayout() {
  return (
    <Container fluid pt="md">
      <Container size="md">
        <Player />
        <Group position="apart" pt="xs">
          <PlayerTitle />
          <PlayerButtons />
        </Group>
      </Container>
      <Container size="xl">
        <QueueControlPanel />
        <Grid pt="sm">
          <Queue card wrapper={({ children }) => <Grid.Col span={2}>{children}</Grid.Col>} />
        </Grid>
      </Container>
    </Container>
  );
}

export default SpotlightLayout;
