import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { FiTruck, FiMail, FiLock, FiArrowRight, FiGlobe, FiShield, FiStar } from 'react-icons/fi';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(username, password);
    if (result.success) {
      toast.success('Welcome back!');
      setTimeout(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.user_type === 'admin') {
          navigate('/admin/dashboard');
        } else if (user.user_type === 'service_provider') {
          navigate('/provider/dashboard');
        } else {
          navigate('/dashboard');
        }
      }, 100);
    } else {
      toast.error(result.error || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=1600&fit=crop&q=80"
          alt="Logistics"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-maroon-900/90" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-maroon-500 to-red-600 rounded-lg flex items-center justify-center">
              <FiTruck className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">Relocate</span>
          </Link>

          {/* Center Content */}
          <div>
            <h2 className="text-4xl font-black text-white leading-tight mb-4">
              Your Global<br />Relocation Hub
            </h2>
            <p className="text-gray-300 text-lg max-w-md leading-relaxed">
              Manage every aspect of your relocation from a single, powerful platform.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 mt-8">
              {[
                { icon: FiGlobe, label: '50+ Countries' },
                { icon: FiShield, label: 'Insured Moves' },
                { icon: FiStar, label: '4.9 Rating' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                    <Icon className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-white/90">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Quote */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <p className="text-white/90 italic leading-relaxed">
              "Relocate made our international move completely seamless. The real-time tracking gave us total peace of mind."
            </p>
            <div className="flex items-center space-x-3 mt-4">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Sarah Mitchell</p>
                <p className="text-gray-400 text-xs">New York to London</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="max-w-md w-full">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-maroon-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiTruck className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Relocate</span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-black text-gray-900 mb-1">Welcome back</h2>
            <p className="text-gray-500 mb-8">Sign in to continue managing your relocations.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <FiMail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <FiLock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm font-medium text-red-600 hover:text-red-700">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-maroon-600 text-white rounded-xl font-semibold text-sm hover:from-red-600 hover:to-maroon-700 transition-all shadow-lg shadow-red-500/25 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <FiArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-gray-50 text-gray-500">New to Relocate?</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Link
                  to="/register"
                  className="flex items-center justify-center px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  Create Account
                </Link>
                <Link
                  to="/register/provider"
                  className="flex items-center justify-center px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  Provider Sign Up
                </Link>
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 mt-8">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
