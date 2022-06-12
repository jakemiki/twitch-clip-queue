import { BrowserRouter, Navigate, Route, Routes, Outlet } from 'react-router-dom';
import AuthPage from '../features/auth/AuthPage';
import IfAuthenticated from '../features/auth/IfAuthenticated';
import RequireAuth from '../features/auth/RequireAuth';
import HistoryPage from '../features/clips/history/HistoryPage';
import QueuePage from '../features/clips/queue/QueuePage';
import HomePage from '../features/home/HomePage';
import AppLayout from './AppLayout';

function Router() {
  return (
    <BrowserRouter basename={process.env.REACT_APP_BASEPATH}>
      <Routes>
        <Route
          path="auth"
          element={
            <IfAuthenticated otherwise={<AuthPage />}>
              <Navigate to={'/queue'} replace />
            </IfAuthenticated>
          }
        />
        <Route
          element={
            <AppLayout>
              <Outlet />
            </AppLayout>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route
            path="queue"
            element={
              <RequireAuth>
                <QueuePage />
              </RequireAuth>
            }
          />
          <Route
            path="history"
            element={
              <RequireAuth>
                <HistoryPage />
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
