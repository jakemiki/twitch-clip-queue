import { Button, Container, Grid, Group, Portal, Stack } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import AppLayout from '../../../../app/AppLayout';
import Player from '../Player';
import PlayerButtons from '../PlayerButtons';
import PlayerTitle from '../PlayerTitle';
import Queue from '../Queue';
import QueueControlPanel from '../QueueControlPanel';

function copyStyles(sourceDoc: Document, targetDoc: Document) {
  Array.from(sourceDoc.styleSheets).forEach((styleSheet) => {
    if (styleSheet.cssRules) {
      // for <style> elements
      const newStyleEl = sourceDoc.createElement('style');

      Array.from(styleSheet.cssRules).forEach((cssRule) => {
        // write the text of each rule into the body of the style element
        newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
      });

      targetDoc.head.appendChild(newStyleEl);
    } else if (styleSheet.href) {
      // for <link> elements loading CSS from a URL
      const newLinkEl = sourceDoc.createElement('link');

      newLinkEl.rel = 'stylesheet';
      newLinkEl.href = styleSheet.href;
      targetDoc.head.appendChild(newLinkEl);
    }
  });
}

function Popup({ children }: PropsWithChildren<{}>) {
  const containerEl = useMemo(() => document.createElement('div'), []);

  useEffect(() => {
    const popup = window.open('', '', `width=${window.outerWidth},height=${window.outerHeight},popup`);
    if (popup) {
      const closePopup = () => popup.close();
      window.addEventListener('unload', closePopup);

      popup.document.body.appendChild(containerEl);
      popup.document.title = 'Twitch Clip Queue — Player';
      setTimeout(() => copyStyles(document, popup.document), 100);

      return () => {
        window.removeEventListener('unload', closePopup);
        popup.close();
      };
    }
  }, [containerEl]);

  return <Portal target={containerEl}>{children}</Portal>;
}

function PopupContent() {
  return (
    <AppLayout noNav>
      <Container fluid py="md" sx={{ height: '100%' }}>
        <Stack justify="flex-start" sx={{ height: '100%' }}>
          <Player />
          <PlayerTitle />
        </Stack>
      </Container>
    </AppLayout>
  );
}

function FullscreenWithPopupLayout() {
  const [key, setKey] = useState(randomId());

  return (
    <React.Fragment key={key}>
      <Container fluid py="md">
        <Button variant="default" onClick={() => setKey(randomId())}>
          Reload layout
        </Button>
        <Container size="xl">
          <Group position="apart" align="flex-end" pb="sm">
            <PlayerTitle />
            <PlayerButtons />
          </Group>
          <QueueControlPanel />
          <Grid pt="sm">
            <Queue card wrapper={({ children }) => <Grid.Col span={2}>{children}</Grid.Col>} />
          </Grid>
        </Container>
      </Container>
      <Popup>
        <PopupContent />
      </Popup>
    </React.Fragment>
  );
}

export default FullscreenWithPopupLayout;
