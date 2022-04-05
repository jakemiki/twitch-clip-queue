import { AppShell, Box } from '@mantine/core';
import { PropsWithChildren } from 'react';
import AppHeader from './AppHeader';

function AppLayout({ children, noNav = false }: PropsWithChildren<{ noNav?: boolean }>) {
  return (
    <AppShell
      padding={0}
      fixed
      header={<AppHeader noNav={noNav} />}
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
      >
        {children}
      </Box>
    </AppShell>
  );
}

export default AppLayout;
