import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/layout/Sidebar';
import PageWrapper from './components/layout/PageWrapper';
import ToastContainer from './components/ui/Toast';
import Dashboard from './pages/Dashboard';
import Wallet from './pages/Wallet';
import AddCredential from './pages/AddCredential';
import CredentialView from './pages/CredentialView';
import EditCredential from './pages/EditCredential';
import AccessLog from './pages/AccessLog';
import Profile from './pages/Profile';
import ShareView from './pages/ShareView';
import { useToast } from './hooks/useToast';

function AppLayout() {
  const { toasts, removeToast } = useToast();

  return (
    <>
      <Sidebar />
      <PageWrapper>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/wallet/add" element={<AddCredential />} />
            <Route path="/wallet/:id" element={<CredentialView />} />
            <Route path="/wallet/:id/edit" element={<EditCredential />} />
            <Route path="/access-log" element={<AccessLog />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </AnimatePresence>
      </PageWrapper>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public share view — no sidebar */}
        <Route path="/share/:token" element={<ShareView />} />
        {/* All other routes with sidebar layout */}
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
