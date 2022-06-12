import {
  AppShell,
  Box,
  Button,
  ColorSchemeProvider,
  Group,
  Header,
  LoadingOverlay,
  MantineProvider,
  Space,
} from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { TitleIcon, TitleText } from './AppHeader';

function AppSkeleton() {
  const preferredColorScheme = useColorScheme();
  return (
    <ColorSchemeProvider colorScheme={preferredColorScheme} toggleColorScheme={() => {}}>
      <MantineProvider
        theme={{ colorScheme: preferredColorScheme, primaryColor: 'indigo' }}
        withNormalizeCSS
        withGlobalStyles
      >
        <AppShell
          padding={0}
          fixed
          header={
            <Header height={60} px="lg">
              <Group position="apart" align="center" sx={{ height: '100%' }}>
                <Group align="center">
                  <TitleIcon />
                  <TitleText />
                </Group>

                <Space />
                <Button>Login with Twitch</Button>
              </Group>
            </Header>
          }
          sx={{
            main: {
              height: '100vh',
              minHeight: '100vh',
              maxHeight: '100vh',
            },
          }}
        >
          <Box
            sx={{
              height: '100%',
              overflow: 'auto',
            }}
          ></Box>
        </AppShell>
        <LoadingOverlay loaderProps={{ size: 'xl' }} visible />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default AppSkeleton;
