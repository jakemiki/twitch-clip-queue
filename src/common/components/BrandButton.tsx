import { useMantineColorScheme, Button } from '@mantine/core';
import { PropsWithChildren } from 'react';

function BrandButton({ children, icon, href }: PropsWithChildren<{ icon: JSX.Element; href: string }>) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Button
      component="a"
      href={href}
      target="_blank"
      variant="subtle"
      color={isDark ? 'gray' : 'dark'}
      compact
      size="xs"
      leftIcon={icon}
      styles={{
        root: {
          paddingLeft: 1,
          paddingRight: 1,
        },
        leftIcon: {
          marginRight: 2,
        },
      }}
    >
      {children}
    </Button>
  );
}

export default BrandButton;
