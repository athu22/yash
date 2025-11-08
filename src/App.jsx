import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import AdminRoutes from './admin/routes/AdminRoutes';
import { AuthProvider } from './hooks/useAuth.jsx';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <AdminRoutes />
          <Toaster position="top-right" />
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App
