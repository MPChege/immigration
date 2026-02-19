import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import EmptyState from '../components/EmptyState';
import { CardSkeleton } from '../components/LoadingSkeleton';
import {
  FiTruck, FiStar, FiSearch, FiFilter,
  FiX, FiArrowRight, FiShield
} from 'react-icons/fi';

const ServiceProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [filterAvailable, setFilterAvailable] = useState(false);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await axios.get('/api/auth/service-providers/');
      setProviders(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching service providers:', error);
      toast.error('Failed to load service providers');
    } finally {
      setLoading(false);
    }
  };

  const filteredProviders = providers
    .filter(provider => {
      const matchesSearch = provider.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.services_offered.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAvailability = !filterAvailable || provider.availability;
      return matchesSearch && matchesAvailability;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
      if (sortBy === 'reviews') return b.total_reviews - a.total_reviews;
      return a.company_name.localeCompare(b.company_name);
    });

  const renderStars = (rating) => {
    rating = parseFloat(rating) || 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return (
      <div className="flex items-center space-x-0.5">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={`w-3.5 h-3.5 ${
              i < fullStars
                ? 'text-yellow-400 fill-yellow-400'
                : i === fullStars && hasHalfStar
                ? 'text-yellow-400 fill-yellow-400 opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1.5 text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const providerImages = [
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=250&fit=crop&q=80',
    'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&h=250&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400&h=250&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494412574643-ff11b0a5eb95?w=400&h=250&fit=crop&q=80',
    'https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&h=250&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=250&fit=crop&q=80',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative bg-gray-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1494412574643-ff11b0a5eb95?w=1600&h=400&fit=crop&q=80"
          alt="Service Providers"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/60" />
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white/80 border border-white/10 mb-4">
              <FiShield className="w-3 h-3" />
              <span>Verified Professionals</span>
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Service Providers</h1>
            <p className="text-gray-400 max-w-lg">
              Browse trusted relocation professionals. Compare ratings, services and pricing to find your perfect match.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6 relative z-10">
        {/* Search & Filters Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by company name or services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <FiX className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option value="rating">Sort by Rating</option>
                <option value="reviews">Sort by Reviews</option>
                <option value="name">Sort by Name</option>
              </select>
              <button
                onClick={() => setFilterAvailable(!filterAvailable)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  filterAvailable
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <FiFilter className="w-3.5 h-3.5" />
                <span>Available</span>
              </button>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Showing <span className="font-semibold text-gray-700">{filteredProviders.length}</span> of {providers.length} providers
            </p>
          </div>
        </motion.div>

        {/* Providers Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProviders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {filteredProviders.map((provider, index) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300"
              >
                {/* Card Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={providerImages[index % providerImages.length]}
                    alt={provider.company_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent" />
                  {provider.availability && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center space-x-1 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        <span>Available</span>
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                        <FiTruck className="text-white w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-sm leading-tight">{provider.company_name}</h3>
                        <p className="text-white/70 text-xs">{provider.contact_person}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  {/* Rating */}
                  <div className="flex items-center justify-between mb-3">
                    {renderStars(provider.rating)}
                    <span className="text-xs text-gray-500">
                      {provider.total_reviews} {provider.total_reviews === 1 ? 'review' : 'reviews'}
                    </span>
                  </div>

                  {/* Services */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Services</p>
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {provider.services_offered}
                    </p>
                  </div>

                  {/* Pricing */}
                  {provider.pricing_info && (
                    <div className="mb-4 bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Pricing</p>
                      <p className="text-sm text-gray-700 line-clamp-2">{provider.pricing_info}</p>
                    </div>
                  )}

                  {/* CTA */}
                  <Link
                    to={`/service-providers/${provider.id}`}
                    className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-maroon-600"
                  >
                    <span>View Details</span>
                    <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FiTruck}
            title="No providers found"
            description={
              searchTerm
                ? `No providers match "${searchTerm}". Try adjusting your search.`
                : "No service providers available at the moment."
            }
            actionLabel={searchTerm ? "Clear Search" : undefined}
            onAction={searchTerm ? () => setSearchTerm('') : undefined}
          />
        )}
      </div>
    </div>
  );
};

export default ServiceProviders;
