import { Users, FileText, Link, Link2Off } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import StatCard from '../components/StatCard';
import { getDashboardStats } from '../../firebase/realtime';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSalespersons: 0,
    totalOrders: 0,
    activeTrackingLinks: 0,
    expiredLinks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        toast.error('Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Yash Tools Admin</title>
      </Helmet>

      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Salespersons"
            value={stats.totalSalespersons}
            icon={Users}
            color="blue-500"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={FileText}
            color="green-500"
          />
          <StatCard
            title="Active Tracking Links"
            value={stats.activeTrackingLinks}
            icon={Link}
            color="indigo-500"
          />
          <StatCard
            title="Expired Links"
            value={stats.expiredLinks}
            icon={Link2Off}
            color="red-500"
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
