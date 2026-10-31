import { Navigate, Route, Routes, Outlet } from 'react-router-dom';
import AuthPage from '../features/auth/AuthPage';
import IfAuthenticated from '../features/auth/IfAuthenticated';
import HistoryPage from '../features/clips/history/HistoryPage';
import QueuePage from '../features/clips/queue/QueuePage';
import HomePage from '../features/home/HomePage';
import AppLayout from './AppLayout';

function Router() {
  return (
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
        <Route path="queue" element={<QueuePage />} />
        <Route path="history" element={<HistoryPage />} />
      </Route>
    </Routes>
  );
}

export default Router;
