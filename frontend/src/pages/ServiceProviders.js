import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import EmptyState from '../components/EmptyState';
import { CardSkeleton } from '../components/LoadingSkeleton';
import {
  FiTruck, FiStar, FiMapPin, FiCheckCircle, FiSearch, FiFilter,
  FiX, FiTrendingUp, FiUsers, FiPackage
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
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.total_reviews - a.total_reviews;
      return a.company_name.localeCompare(b.company_name);
    });

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={`w-4 h-4 ${
              i < fullStars
                ? 'text-warning-500 fill-warning-500'
                : i === fullStars && hasHalfStar
                ? 'text-warning-500 fill-warning-500 opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Service Providers</h1>
        <p className="page-subtitle">
          Find trusted relocation professionals for your move
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by company name or services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-12 w-full"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <FiX className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
            >
              <option value="rating">Sort by Rating</option>
              <option value="reviews">Sort by Reviews</option>
              <option value="name">Sort by Name</option>
            </select>
            <button
              onClick={() => setFilterAvailable(!filterAvailable)}
              className={`btn flex items-center space-x-2 ${
                filterAvailable ? 'btn-primary' : 'btn-outline'
              }`}
            >
              <FiFilter className="w-4 h-4" />
              <span>Available Only</span>
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredProviders.length} of {providers.length} providers
        </div>
      </div>

      {/* Providers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredProviders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider, index) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="card-hover h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                        <FiTruck className="text-white text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {provider.company_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {provider.contact_person}
                        </p>
                      </div>
                    </div>
                  </div>
                  {provider.availability && (
                    <span className="badge-success flex items-center space-x-1">
                      <FiCheckCircle className="w-3 h-3" />
                      <span>Available</span>
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="mb-4">
                  {renderStars(provider.rating)}
                  <p className="text-sm text-gray-600 mt-1">
                    {provider.total_reviews} {provider.total_reviews === 1 ? 'review' : 'reviews'}
                  </p>
                </div>

                {/* Services */}
                <div className="mb-4 flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-2">Services Offered:</p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {provider.services_offered}
                  </p>
                </div>

                {/* Pricing Info */}
                {provider.pricing_info && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-700 mb-1">Pricing:</p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {provider.pricing_info}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-4 border-t border-gray-200">
                  <Link
                    to={`/service-providers/${provider.id}`}
                    className="btn btn-primary flex-1 text-center"
                  >
                    View Details
                  </Link>
                </div>
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
  );
};

export default ServiceProviders;
