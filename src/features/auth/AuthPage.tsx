import { LoadingOverlay } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAuthState, authenticateWithToken } from './authSlice';

function AuthPage() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [returnUrl, setReturnUrl] = useState('/');
  const authState = useAppSelector(selectAuthState);

  useEffect(() => {
    if (location.hash) {
      const { access_token, state } = location.hash
        .substring(1)
        .split('&')
        .reduce((authInfo, s) => {
          const parts = s.split('=');
          authInfo[parts[0]] = decodeURIComponent(decodeURIComponent(parts[1]));
          return authInfo;
        }, {} as Record<string, any>) as { access_token: string; state: string };

      if (state) {
        setReturnUrl(state);
      }

      if (access_token) {
        dispatch(authenticateWithToken(access_token));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  switch (authState) {
    case 'authenticating':
      return <LoadingOverlay loaderProps={{ size: 'xl' }} visible />;
    case 'authenticated':
      return <Navigate to={returnUrl} replace />;
    case 'unauthenticated':
      return <Navigate to={'/'} replace />;
  }
}

export default AuthPage;
