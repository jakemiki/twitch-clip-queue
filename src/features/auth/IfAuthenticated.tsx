import { PropsWithChildren, ReactNode } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectAuthState } from './authSlice';
import { selectChatChannels } from '../settings/settingsSlice';

function IfAuthenticated({
  children,
  otherwise,
  allowKick = false,
}: PropsWithChildren<{ otherwise?: ReactNode; allowKick?: boolean }>) {
  const isAuthenticated = useAppSelector(selectAuthState) === 'authenticated';
  const hasKickChannel = useAppSelector((state) =>
    selectChatChannels(state).some((channel) => channel.platform === 'kick')
  );

  if (isAuthenticated || (allowKick && hasKickChannel)) {
    return <>{children}</>;
  } else {
    return <>{otherwise}</>;
  }
}

export default IfAuthenticated;
