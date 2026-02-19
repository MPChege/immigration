import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import {
  FiTruck, FiHome, FiCalendar, FiPackage, FiFileText, FiUsers,
  FiBell, FiLogOut, FiMenu, FiX, FiChevronDown, FiUser, FiSettings,
  FiShield
} from 'react-icons/fi';

const TopNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    { path: '/service-providers', label: 'Providers', icon: FiUsers },
  ];

  const providerMenuItems = [
    { path: '/provider/dashboard', label: 'Dashboard', icon: FiHome },
    { path: '/bookings', label: 'Bookings', icon: FiCalendar },
    { path: '/shipments', label: 'Shipments', icon: FiPackage },
  ];

  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Admin', icon: FiShield },
  ];

  const menuItems = user?.user_type === 'admin'
    ? adminMenuItems
    : user?.user_type === 'service_provider'
    ? providerMenuItems
    : userMenuItems;

  if (['/login', '/register'].some(path => location.pathname.startsWith(path)) || location.pathname === '/') {
    return null;
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-gray-900/95 backdrop-blur-xl shadow-2xl'
            : 'bg-gray-900 shadow-lg'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-3 group flex-shrink-0">
              <div className="relative w-9 h-9 bg-gradient-to-br from-maroon-500 to-red-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-red-500/25 transition-all duration-300">
                <FiTruck className="text-white text-sm" />
              </div>
              <span className="text-lg font-semibold text-white tracking-tight hidden sm:block">
                Relocate
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-0.5 mx-8">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                    {active && (
                      <motion.div
                        layoutId="navIndicator"
                        className="absolute inset-0 bg-white/10 rounded-md"
                        initial={false}
                        transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              {user ? (
                <>
                  {/* Notification Bell */}
                  <button className="relative p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200">
                    <FiBell className="w-4.5 h-4.5" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                  </button>

                  {/* Divider */}
                  <div className="hidden lg:block w-px h-6 bg-gray-700 mx-1" />

                  {/* User Dropdown */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center space-x-2.5 pl-2 pr-3 py-1.5 rounded-md hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="w-7 h-7 bg-gradient-to-br from-maroon-500 to-red-600 rounded-md flex items-center justify-center shadow-sm">
                        <span className="text-white text-xs font-bold">
                          {(user.first_name || user.username || 'U')[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="hidden lg:block text-left">
                        <p className="text-sm font-medium text-white leading-tight">
                          {user.first_name || user.username}
                        </p>
                        <p className="text-[10px] text-gray-500 capitalize leading-tight">
                          {user.user_type?.replace('_', ' ')}
                        </p>
                      </div>
                      <FiChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-60 bg-gray-800 rounded-lg shadow-2xl border border-gray-700/50 py-1 z-50 overflow-hidden"
                        >
                          {/* User Info Header */}
                          <div className="px-4 py-3 border-b border-gray-700/50">
                            <p className="text-sm font-semibold text-white">{user.first_name || user.username}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                          </div>

                          {/* Menu Items */}
                          <div className="py-1">
                            <Link
                              to="/profile"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center space-x-2.5 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                            >
                              <FiUser className="w-4 h-4" />
                              <span>Profile</span>
                            </Link>
                            <Link
                              to="/profile"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center space-x-2.5 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                            >
                              <FiSettings className="w-4 h-4" />
                              <span>Settings</span>
                            </Link>
                          </div>

                          {/* Logout */}
                          <div className="border-t border-gray-700/50 py-1">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center space-x-2.5 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                            >
                              <FiLogOut className="w-4 h-4" />
                              <span>Sign out</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Mobile Hamburger */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-maroon-500 to-red-600 rounded-md hover:from-maroon-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-gray-800 overflow-hidden"
            >
              <div className="px-4 py-3 space-y-0.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-md transition-all ${
                        active
                          ? 'bg-white/10 text-white font-medium'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default TopNavbar;
