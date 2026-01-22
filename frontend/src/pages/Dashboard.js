import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import EmptyState from '../components/EmptyState';
import { StatCardSkeleton } from '../components/LoadingSkeleton';
import {
  FiTruck, FiCalendar, FiPackage, FiFileText, FiPlus,
  FiArrowRight, FiMapPin, FiClock, FiTrendingUp, FiGlobe,
  FiNavigation, FiCheckCircle, FiAward, FiUsers
} from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    relocations: 0,
    bookings: 0,
    shipments: 0,
    documents: 0,
  });
  const [recentRelocations, setRecentRelocations] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentRelocations();
  }, []);

  const fetchStats = async () => {
    try {
      const [relocations, bookings, shipments, documents] = await Promise.all([
        axios.get('/api/relocations/'),
        axios.get('/api/bookings/'),
        axios.get('/api/shipments/'),
        axios.get('/api/documents/'),
      ]);
      setStats({
        relocations: relocations.data.count || relocations.data.length,
        bookings: bookings.data.count || bookings.data.length,
        shipments: shipments.data.count || shipments.data.length,
        documents: documents.data.count || documents.data.length,
      });
      
      // Get upcoming trips (relocations with future dates)
      const allRelocations = relocations.data.results || relocations.data;
      const upcoming = allRelocations
        .filter(r => new Date(r.moving_date) >= new Date())
        .sort((a, b) => new Date(a.moving_date) - new Date(b.moving_date))
        .slice(0, 3);
      setUpcomingTrips(upcoming);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentRelocations = async () => {
    try {
      const response = await axios.get('/api/relocations/');
      const data = response.data.results || response.data;
      setRecentRelocations(data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching relocations:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      planning: { label: 'Planning', class: 'bg-maroon-100 text-maroon-800' },
      booked: { label: 'Booked', class: 'bg-green-100 text-green-800' },
      in_progress: { label: 'In Transit', class: 'bg-yellow-100 text-yellow-800' },
      completed: { label: 'Arrived', class: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Cancelled', class: 'bg-red-100 text-red-800' },
    };
    const config = statusConfig[status] || { label: status, class: 'bg-gray-100 text-gray-800' };
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  // Travel destination images (using Unsplash)
  const getDestinationImage = (destination) => {
    const city = destination.split(',')[0].trim();
    return `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=800&h=600&fit=crop&q=80`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-red-100/60 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Your Relocation Journey
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search relocations..."
                  className="pl-10 pr-4 py-2 bg-gray-100 rounded-xl border-none outline-none text-sm w-64 focus:bg-white focus:ring-2 focus:ring-primary-500"
                />
                <FiNavigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              <Link
                to="/relocations"
                className="btn btn-primary flex items-center space-x-2"
              >
                <FiPlus className="w-4 h-4" />
                <span>New Journey</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Key Metrics - Travel Style */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {[
              {
                title: 'Active Journeys',
                value: stats.relocations,
                icon: FiGlobe,
                gradient: 'from-red-500 to-red-600',
                bgGradient: 'from-red-50 to-red-100',
                trend: '+12%',
              },
              {
                title: 'Confirmed Bookings',
                value: stats.bookings,
                icon: FiCheckCircle,
                gradient: 'from-maroon-500 to-maroon-600',
                bgGradient: 'from-maroon-50 to-maroon-100',
                trend: '+8%',
              },
              {
                title: 'In Transit',
                value: stats.shipments,
                icon: FiTruck,
                gradient: 'from-red-600 to-maroon-600',
                bgGradient: 'from-red-100 to-maroon-100',
                trend: '5 active',
              },
              {
                title: 'Documents Ready',
                value: stats.documents,
                icon: FiAward,
                gradient: 'from-maroon-500 to-red-500',
                bgGradient: 'from-maroon-50 to-red-50',
                trend: 'All set',
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6 shadow-soft hover:shadow-medium transition-all cursor-pointer group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity -z-10`} style={{
                    background: stat.bgGradient.includes('red') && stat.bgGradient.includes('maroon')
                      ? 'linear-gradient(to bottom right, rgb(254 242 242), rgb(250 245 245))'
                      : stat.bgGradient.includes('maroon')
                      ? 'linear-gradient(to bottom right, rgb(250 245 245), rgb(245 235 235))'
                      : 'linear-gradient(to bottom right, rgb(254 242 242), rgb(254 242 242))'
                  }} />
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      {stat.trend}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">{stat.title}</h3>
                  <p className="text-4xl font-black text-gray-900 mb-1">{stat.value}</p>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <FiTrendingUp className="w-3 h-3" />
                    <span>vs last month</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Upcoming Journeys - Travel Cards */}
        {upcomingTrips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Upcoming Journeys</h2>
                <p className="text-sm text-gray-600 mt-1">Your next relocation adventures</p>
              </div>
              <Link to="/relocations" className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1">
                <span>View All</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingTrips.map((trip, index) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-soft hover:shadow-large transition-all cursor-pointer"
                >
                  {/* Destination Image */}
                  <div 
                    className="relative h-48 bg-gradient-to-br from-red-500 via-maroon-500 to-red-600 overflow-hidden"
                    style={{
                      backgroundImage: `url(https://images.unsplash.com/photo-${1500000000000 + index * 100000}?w=800&h=600&fit=crop&q=80)`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/80 via-maroon-600/80 to-red-700/80 group-hover:from-red-600/70 group-hover:via-maroon-600/70 group-hover:to-red-700/70 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FiMapPin className="w-16 h-16 text-white/40" />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center space-x-2 text-white">
                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                          <FiNavigation className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-lg">{trip.destination}</p>
                          <p className="text-sm text-white/80">{trip.origin}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Trip Details */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      {getStatusBadge(trip.status)}
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <FiClock className="w-4 h-4" />
                        <span>{new Date(trip.moving_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {trip.estimated_cost && (
                      <div className="flex items-center space-x-2 text-lg font-bold text-gray-900">
                        <span className="text-sm text-gray-500 font-normal">Estimated:</span>
                        <span className="text-primary-600">${trip.estimated_cost}</span>
                      </div>
                    )}
                    <Link
                      to={`/relocations/${trip.id}`}
                      className="mt-4 inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium text-sm group-hover:underline"
                    >
                      <span>View Details</span>
                      <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-soft"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
            {recentRelocations.length > 0 ? (
              <div className="space-y-4">
                {recentRelocations.slice(0, 4).map((relocation, index) => (
                  <motion.div
                    key={relocation.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-maroon-500 flex items-center justify-center flex-shrink-0">
                      <FiMapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {relocation.origin} → {relocation.destination}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(relocation.moving_date).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusBadge(relocation.status)}
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={FiTruck}
                title="No recent activity"
                description="Start your first relocation journey"
              />
            )}
          </motion.div>

          {/* Quick Actions - Travel Style */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-soft"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Plan Your Journey</h3>
            <div className="space-y-3">
              {[
                { icon: FiPlus, label: 'New Relocation', desc: 'Start planning', link: '/relocations', gradient: 'from-red-500 to-red-600' },
                { icon: FiUsers, label: 'Find Providers', desc: 'Browse services', link: '/service-providers', gradient: 'from-maroon-500 to-maroon-600' },
                { icon: FiPackage, label: 'Track Shipment', desc: 'Monitor progress', link: '/shipments', gradient: 'from-red-600 to-maroon-600' },
                { icon: FiFileText, label: 'Documents', desc: 'Manage files', link: '/documents', gradient: 'from-maroon-500 to-red-500' },
              ].map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    to={action.link}
                    className="flex items-center space-x-4 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all group"
                  >
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${action.gradient} group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{action.label}</p>
                      <p className="text-sm text-gray-500">{action.desc}</p>
                    </div>
                    <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-transform" />
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Journey Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-red-50 via-maroon-50 to-red-100 rounded-2xl border border-red-200 p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Journey Insights</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600">All systems operational</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <p className="text-sm text-gray-600 mb-1">Average Journey Time</p>
              <p className="text-2xl font-bold text-gray-900">7-14 days</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <p className="text-sm text-gray-600 mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">98.5%</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <p className="text-sm text-gray-600 mb-1">Happy Customers</p>
              <p className="text-2xl font-bold text-gray-900">10K+</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
