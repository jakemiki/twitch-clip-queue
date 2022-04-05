import {
  useMantineColorScheme,
  UnstyledButton,
  Avatar,
  Divider,
  Menu,
  Switch,
  Text,
  Group,
  ChevronIcon,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { MoonStars, Settings, Logout } from 'tabler-icons-react';
import { selectUsername, selectProfilePictureUrl, logout } from '../features/auth/authSlice';
import useSettingsModal from '../features/settings/SettingsModal';
import { useAppDispatch, useAppSelector } from './hooks';

function AppMenu() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const username = useAppSelector(selectUsername);
  const profilePictureUrl = useAppSelector(selectProfilePictureUrl);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { openSettingsModal } = useSettingsModal();

  return (
    <Menu
      control={
        <UnstyledButton
          sx={(theme) => ({
            padding: theme.spacing.xs,

            '&:hover': {
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.35)
                  : theme.fn.rgba(theme.colors.gray[0], 0.35),
            },
          })}
        >
          <Group>
            <Avatar size="md" radius="xl" src={profilePictureUrl} alt={username}></Avatar>
            <Text>{username}</Text>
            <ChevronIcon />
          </Group>
        </UnstyledButton>
      }
    >
      <Menu.Item
        icon={<MoonStars size={14} />}
        onClick={() => toggleColorScheme()}
        rightSection={<Switch size="xs" checked={colorScheme === 'dark'} readOnly />}
      >
        Dark mode
      </Menu.Item>
      <Menu.Item icon={<Settings size={14} />} onClick={() => openSettingsModal()}>
        Settings
      </Menu.Item>

      <Divider />

      <Menu.Item
        icon={<Logout size={14} />}
        onClick={() => {
          navigate('/');
          dispatch(logout());
        }}
      >
        Log Out
      </Menu.Item>
    </Menu>
  );
}

export default AppMenu;
