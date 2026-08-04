import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import RecordJournal from './pages/RecordJournal';
import JournalHistory from './pages/JournalHistory';
import MoodAnalytics from './pages/MoodAnalytics';
import SmartSearch from './pages/SmartSearch';
import AIChatReflection from './pages/AIChatReflection';
import ProfileSettings from './pages/ProfileSettings';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Authenticated Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/record" element={<RecordJournal />} />
          <Route path="/history" element={<JournalHistory />} />
          <Route path="/analytics" element={<MoodAnalytics />} />
          <Route path="/search" element={<SmartSearch />} />
          <Route path="/chat" element={<AIChatReflection />} />
          <Route path="/settings" element={<ProfileSettings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
