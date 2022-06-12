import { Box, Container, Text, Title } from '@mantine/core';
import MyCredits from '../../common/components/MyCredits';
import FeaturesSection from './FeaturesSection';
import QuickstartSection from './QuickstartSection';
import ScreenshotsSection from './ScreenshotsSection';

function HomePage() {
  return (
    <Container py="md">
      <Box>
        <Title order={1}>Clip Queue</Title>
        <MyCredits />
        <Text component="p">Enqueue and play clips from your Twitch Chat using nothing more than your web browser</Text>
      </Box>
      <QuickstartSection />
      <FeaturesSection />
      <ScreenshotsSection />
    </Container>
  );
}

export default HomePage;
