import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import NewIceBath from './components/NewIceBath';
import Stats from './components/Stats';
import History from './components/History';
import IceBathDetail from './components/IceBathDetail';
import EditIceBath from './components/EditIceBath';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AuthProvider>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/new" element={<NewIceBath />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="/history" element={<History />} />
                <Route path="/avanto/:id" element={<IceBathDetail />} />
                <Route path="/avanto/:id/edit" element={<EditIceBath />} />
              </Route>

              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
