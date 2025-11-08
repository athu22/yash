import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Wrench,
  Users,
  FileText,
  Truck
} from 'lucide-react';
import { cn } from '../../utils/cn';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Resharpening', href: '/resharpening', icon: Wrench },
  { name: 'Salespersons', href: '/salespersons', icon: Users },
  { name: 'Quotations', href: '/quotations', icon: FileText },
  { name: 'Orders', href: '/orders', icon: Truck },
];

const Sidebar = () => {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col bg-primary-900">
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          {/* Logo */}
          <div className="flex flex-shrink-0 items-center px-4">
            <h1 className="text-2xl font-bold text-white">Yash Tools</h1>
          </div>

          {/* Navigation */}
          <nav className="mt-5 flex-1 space-y-1 px-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                    isActive
                      ? 'bg-primary-800 text-white'
                      : 'text-primary-100 hover:bg-primary-800 hover:text-white'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={cn(
                        'mr-3 h-5 w-5 flex-shrink-0',
                        isActive
                          ? 'text-white'
                          : 'text-primary-300 group-hover:text-white'
                      )}
                    />
                    <motion.span
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.name}
                    </motion.span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
