import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  FiHome, FiTruck, FiCalendar, FiPackage, FiFileText, FiUsers,
  FiSettings, FiLogOut, FiMenu, FiX, FiTrendingUp, FiDollarSign
} from 'react-icons/fi';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const userMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiHome },
    { path: '/relocations', label: 'Relocations', icon: FiTruck },
    { path: '/bookings', label: 'Bookings', icon: FiCalendar },
    { path: '/shipments', label: 'Shipments', icon: FiPackage },
    { path: '/documents', label: 'Documents', icon: FiFileText },
    { path: '/service-providers', label: 'Service Providers', icon: FiUsers },
  ];

  const providerMenuItems = [
    { path: '/provider/dashboard', label: 'Dashboard', icon: FiHome },
    { path: '/bookings', label: 'Bookings', icon: FiCalendar },
    { path: '/shipments', label: 'Shipments', icon: FiPackage },
    { path: '/service-providers', label: 'My Profile', icon: FiUsers },
  ];

  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Admin Dashboard', icon: FiTrendingUp },
    { path: '/dashboard', label: 'User View', icon: FiHome },
  ];

  const menuItems = user?.user_type === 'admin' 
    ? adminMenuItems 
    : user?.user_type === 'service_provider' 
    ? providerMenuItems 
    : userMenuItems;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <FiTruck className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-gray-900">Relocate</span>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User section */}
          {user && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3 px-4 py-3 mb-2">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 font-semibold">
                    {(user.first_name || user.username || 'U')[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.first_name || user.username}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.user_type?.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FiLogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
