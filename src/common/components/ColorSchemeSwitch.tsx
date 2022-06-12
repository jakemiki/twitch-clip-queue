import { ActionIcon, PolymorphicComponentProps, useMantineColorScheme } from '@mantine/core';
import { PropsWithChildren } from 'react';
import { Sun, MoonStars } from 'tabler-icons-react';

const LightModeIcon = Sun;
const DarkModeIcon = MoonStars;

function ColorSchemeSwitch<C>({
  component = ActionIcon,
  children,
  ...props
}: PropsWithChildren<PolymorphicComponentProps<C>>) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const ModeIcon = isDark ? LightModeIcon : DarkModeIcon;
  const Component = component;

  return (
    <Component {...props} onClick={() => toggleColorScheme()}>
      {children ? children : <ModeIcon />}
    </Component>
  );
}

export default ColorSchemeSwitch;
