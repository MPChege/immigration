import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from './Sidebar';
import { FiMenu, FiBell, FiSearch } from 'react-icons/fi';

const EnhancedNavbar = () => {
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left: Menu button and search */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <FiMenu className="w-6 h-6" />
              </button>
              
              {user && (
                <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-lg px-4 py-2 flex-1 max-w-md">
                  <FiSearch className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search relocations, shipments..."
                    className="bg-transparent border-none outline-none text-sm flex-1"
                  />
                </div>
              )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 relative">
                    <FiBell className="w-6 h-6" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
                  </button>
                  <div className="flex items-center space-x-3">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium text-gray-900">
                        {user.first_name || user.username}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user.user_type?.replace('_', ' ')}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-semibold">
                        {(user.first_name || user.username || 'U')[0].toUpperCase()}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
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
        </div>
      </nav>
    </>
  );
};

export default EnhancedNavbar;
