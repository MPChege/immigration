import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import {
  FiTruck, FiHome, FiCalendar, FiPackage, FiFileText, FiUsers,
  FiBell, FiSearch, FiLogOut, FiMenu, FiX, FiChevronDown, FiUser
} from 'react-icons/fi';

const TopNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setUserMenuOpen(false);
  };

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
  ];

  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Admin Dashboard', icon: FiHome },
  ];

  const menuItems = user?.user_type === 'admin'
    ? adminMenuItems
    : user?.user_type === 'service_provider'
    ? providerMenuItems
    : userMenuItems;

  // Don't show navbar on auth pages or home page
  if (['/login', '/register'].some(path => location.pathname.startsWith(path)) || location.pathname === '/') {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50'
          : 'bg-white/60 backdrop-blur-md border-b border-gray-200/30'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="relative w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-red-500 via-red-600 to-maroon-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
              <FiTruck className="text-white text-lg lg:text-xl relative z-10" />
            </motion.div>
            <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-red-600 to-maroon-600 bg-clip-text text-transparent">
              Relocate
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                    className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'text-red-600 bg-red-50'
                        : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-red-50 rounded-lg -z-10"
                      initial={false}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            {/* Search (Desktop) */}
            {user && (
              <div className="hidden md:flex items-center space-x-2 bg-gray-100/80 hover:bg-gray-200/80 rounded-lg px-4 py-2 transition-colors cursor-pointer">
                <FiSearch className="text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-sm w-32 lg:w-48 placeholder-gray-400"
                />
              </div>
            )}

            {user ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                  <FiBell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full animate-pulse"></span>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-maroon-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {(user.first_name || user.username || 'U')[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user.first_name || user.username}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user.user_type?.replace('_', ' ')}
                      </p>
                    </div>
                    <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user.first_name || user.username}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <FiUser className="w-4 h-4" />
                          <span>View Profile</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <FiLogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="btn btn-outline btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 py-4 space-y-1"
            >
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-red-50 text-red-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click outside to close menus */}
      {(userMenuOpen || mobileMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setUserMenuOpen(false);
            setMobileMenuOpen(false);
          }}
        />
      )}
    </motion.nav>
  );
};

export default TopNavbar;
