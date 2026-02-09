import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { BrainDump } from './pages/BrainDump';
import { Tasks } from './pages/Tasks';
import { Focus } from './pages/Focus';
import { Profile } from './pages/Profile';
import { Habits } from './pages/Habits';
import { Goals } from './pages/Goals';
import { Automation } from './pages/Automation';
import { Analytics } from './pages/Analytics';
import { Subscription } from './pages/Subscription';
import { Money } from './pages/Money';
import { Coach } from './pages/Coach';
import { Learning } from './pages/Learning';
import { Team } from './pages/Team';
import { Community } from './pages/Community';
import { Referrals } from './pages/Referrals';
import { Integrations } from './pages/Integrations';
import { Login } from './pages/Login';
import { useStore } from './store/useStore';
import { useAuthStore } from './store/useAuthStore';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function App() {
  const { preferences } = useStore();

  useEffect(() => {
    if (preferences.theme === 'dark' || (preferences.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="brain-dump" element={<BrainDump />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="habits" element={<Habits />} />
          <Route path="goals" element={<Goals />} />
          <Route path="focus" element={<Focus />} />
          <Route path="automation" element={<Automation />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<Profile />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="money" element={<Money />} />
          <Route path="coach" element={<Coach />} />
          <Route path="learning" element={<Learning />} />
          <Route path="team" element={<Team />} />
          <Route path="community" element={<Community />} />
          <Route path="referrals" element={<Referrals />} />
          <Route path="integrations" element={<Integrations />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
