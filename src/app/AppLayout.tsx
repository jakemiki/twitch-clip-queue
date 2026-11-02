import { AppShell, ScrollArea } from '@mantine/core';
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
      <ScrollArea
        sx={{
          height: '100%',
        }}
        styles={{ viewport: { '& > div': { display: 'block !important', height: '100%' } } }}
      >
        {children}
      </ScrollArea>
    </AppShell>
  );
}

export default AppLayout;
