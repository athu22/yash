import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AdminLayout from '../components/layouts/AdminLayout';
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import Resharpening from '../pages/Resharpening';
import Salespersons from '../pages/Salespersons';
import Quotations from '../pages/Quotations';
import Orders from '../pages/Orders';
import TrackOrder from '../pages/TrackOrder';
import Login from '../pages/Login';

const AdminRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public route for order tracking */}
      <Route path="/track/:orderId" element={<TrackOrder />} />
      
      {/* Authentication routes */}
      {!user ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/resharpening" element={<Resharpening />} />
            <Route path="/salespersons" element={<Salespersons />} />
            <Route path="/quotations" element={<Quotations />} />
            <Route path="/orders" element={<Orders />} />
          </Route>
          <Route path="/login" element={<Navigate to="/" replace />} />
        </>
      )}
      
      {/* Fallback route - will show TrackOrder for tracking URLs, login for others */}
      <Route 
        path="*" 
        element={
          window.location.pathname.startsWith('/track/') 
            ? <TrackOrder /> 
            : <Navigate to={user ? "/" : "/login"} replace />
        } 
      />
    </Routes>
  );
};

export default AdminRoutes;
