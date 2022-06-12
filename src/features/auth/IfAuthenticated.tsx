import { PropsWithChildren, ReactNode } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectAuthState } from './authSlice';

function IfAuthenticated({ children, otherwise }: PropsWithChildren<{ otherwise?: ReactNode }>) {
  const isAuthenticated = useAppSelector(selectAuthState) === 'authenticated';

  if (isAuthenticated) {
    return <>{children}</>;
  } else {
    return <>{otherwise}</>;
  }
}

export default IfAuthenticated;
