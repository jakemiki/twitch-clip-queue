import { ColorSchemeProvider, LoadingOverlay, MantineProvider } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { selectAccessToken, authenticateWithToken, selectAuthState } from '../features/auth/authSlice';
import { colorSchemeToggled, selectColorScheme } from '../features/settings/settingsSlice';
import { selectIsOpen } from '../features/clips/clipQueueSlice';
import { useAppDispatch, useAppSelector } from './hooks';
import Router from './Router';

function App() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectAccessToken);
  const authState = useAppSelector(selectAuthState);
  const preferredColorScheme = useColorScheme();
  const colorScheme = useAppSelector((state) => selectColorScheme(state, preferredColorScheme));
  const isOpen = useAppSelector(selectIsOpen);

  useEffect(() => {
    if (accessToken) {
      dispatch(authenticateWithToken(accessToken));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {authState === 'authenticated' && (
        <>
          {isOpen ? (
            <Helmet>
              <title>Clip Queue - Open</title>
              <link rel="shortcut icon" href={`${process.env.PUBLIC_URL}/favicon_open.ico`} />
            </Helmet>
          ) : (
            <Helmet>
              <title>Clip Queue - Closed</title>
              <link rel="shortcut icon" href={`${process.env.PUBLIC_URL}/favicon_closed.ico`} />
            </Helmet>
          )}
        </>
      )}

      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={() => dispatch(colorSchemeToggled(preferredColorScheme))}
      >
        <MantineProvider
          theme={{ colorScheme, primaryColor: 'indigo' }}
          defaultProps={{ Portal: { position: 'fixed' } }}
          withNormalizeCSS
          withGlobalStyles
        >
          <ModalsProvider>
            <NotificationsProvider>
              <Router />
              <LoadingOverlay loaderProps={{ size: 'xl' }} visible={authState === 'authenticating'} />
            </NotificationsProvider>
          </ModalsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}

export default App;
