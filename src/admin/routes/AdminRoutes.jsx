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

  // If user is not authenticated, only show login page
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Protected routes for authenticated users
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/resharpening" element={<Resharpening />} />
        <Route path="/salespersons" element={<Salespersons />} />
        <Route path="/quotations" element={<Quotations />} />
        <Route path="/orders" element={<Orders />} />
      </Route>
      <Route path="/track/:orderId" element={<TrackOrder />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
