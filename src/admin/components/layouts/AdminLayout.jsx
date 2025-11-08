import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Navigation */}
        <Navbar />

        {/* Main Content Area */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
