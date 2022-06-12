import { PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { login, selectAuthState } from './authSlice';

function RequireAuth({ children }: PropsWithChildren<{}>) {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const authState = useAppSelector(selectAuthState);

  switch (authState) {
    case 'authenticating':
      return <></>;
    case 'authenticated':
      return <>{children}</>;
    case 'unauthenticated':
      dispatch(login(location.pathname));
      return <></>;
  }
}

export default RequireAuth;
