import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyState from '../components/EmptyState';
import { CardSkeleton } from '../components/LoadingSkeleton';
import {
  FiTruck, FiMapPin, FiCalendar, FiPackage, FiPlus, FiEdit, FiTrash2,
  FiArrowRight, FiArrowLeft, FiCheck, FiDollarSign, FiTrendingUp, FiX
} from 'react-icons/fi';

const Relocations = () => {
  const [relocations, setRelocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    moving_date: '',
    inventory: '',
  });

  useEffect(() => {
    fetchRelocations();
  }, []);

  const fetchRelocations = async () => {
    try {
      const response = await axios.get('/api/relocations/');
      setRelocations(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching relocations:', error);
      toast.error('Failed to load relocations');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }

    try {
      await axios.post('/api/relocations/', formData);
      toast.success('Relocation created successfully!');
      setShowWizard(false);
      setCurrentStep(1);
      setFormData({ origin: '', destination: '', moving_date: '', inventory: '' });
      fetchRelocations();
    } catch (error) {
      console.error('Error creating relocation:', error);
      toast.error('Failed to create relocation');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateQuotation = async (relocationId) => {
    try {
      await axios.post(`/api/relocations/${relocationId}/calculate_quotation/`);
      toast.success('Quotation calculated!');
      fetchRelocations();
    } catch (error) {
      toast.error('Error calculating quotation');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      planning: { label: 'Planning', class: 'badge-info' },
      booked: { label: 'Booked', class: 'badge-success' },
      in_progress: { label: 'In Progress', class: 'badge-warning' },
      completed: { label: 'Completed', class: 'badge-success' },
      cancelled: { label: 'Cancelled', class: 'badge-danger' },
    };
    const config = statusConfig[status] || { label: status, class: 'badge-info' };
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  const steps = [
    { number: 1, title: 'Location & Date', icon: FiMapPin },
    { number: 2, title: 'Inventory', icon: FiPackage },
    { number: 3, title: 'Review', icon: FiCheck },
  ];

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">My Relocations</h1>
            <p className="page-subtitle">Manage all your relocation plans in one place</p>
          </div>
          <button
            onClick={() => setShowWizard(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <FiPlus className="w-5 h-5" />
            <span>New Relocation</span>
          </button>
        </div>
      </div>

      {/* Multi-Step Wizard Modal */}
      <AnimatePresence>
        {showWizard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-large max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Wizard Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Create New Relocation</h2>
                  <button
                    onClick={() => {
                      setShowWizard(false);
                      setCurrentStep(1);
                      setFormData({ origin: '', destination: '', moving_date: '', inventory: '' });
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.number;
                    const isCompleted = currentStep > step.number;
                    return (
                      <React.Fragment key={step.number}>
                        <div className="flex items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                              isActive
                                ? 'bg-primary-600 text-white'
                                : isCompleted
                                ? 'bg-success-600 text-white'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {isCompleted ? (
                              <FiCheck className="w-5 h-5" />
                            ) : (
                              <Icon className="w-5 h-5" />
                            )}
                          </div>
                          <span className={`ml-2 text-sm font-medium ${isActive ? 'text-primary-600' : 'text-gray-600'}`}>
                            {step.title}
                          </span>
                        </div>
                        {index < steps.length - 1 && (
                          <div className={`flex-1 h-1 mx-4 ${isCompleted ? 'bg-success-600' : 'bg-gray-200'}`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Wizard Content */}
              <form onSubmit={handleSubmit} className="p-6">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="form-group">
                        <label className="form-label flex items-center space-x-2">
                          <FiMapPin className="w-4 h-4" />
                          <span>Origin Location</span>
                        </label>
                        <input
                          type="text"
                          name="origin"
                          value={formData.origin}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="Enter origin address"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label flex items-center space-x-2">
                          <FiMapPin className="w-4 h-4" />
                          <span>Destination Location</span>
                        </label>
                        <input
                          type="text"
                          name="destination"
                          value={formData.destination}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="Enter destination address"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label flex items-center space-x-2">
                          <FiCalendar className="w-4 h-4" />
                          <span>Moving Date</span>
                        </label>
                        <input
                          type="date"
                          name="moving_date"
                          value={formData.moving_date}
                          onChange={handleChange}
                          className="form-input"
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="form-group">
                        <label className="form-label flex items-center space-x-2">
                          <FiPackage className="w-4 h-4" />
                          <span>Inventory List</span>
                        </label>
                        <textarea
                          name="inventory"
                          value={formData.inventory}
                          onChange={handleChange}
                          className="form-textarea"
                          placeholder="List items to be moved (e.g., Furniture, Electronics, Clothing, Books)"
                          rows={8}
                          required
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          Separate items with commas or list them on new lines
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                        <h3 className="font-semibold text-gray-900 mb-4">Review Your Relocation Details</h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-600">Origin</p>
                            <p className="font-medium text-gray-900">{formData.origin}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Destination</p>
                            <p className="font-medium text-gray-900">{formData.destination}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Moving Date</p>
                            <p className="font-medium text-gray-900">
                              {new Date(formData.moving_date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Inventory</p>
                            <p className="font-medium text-gray-900 whitespace-pre-line">
                              {formData.inventory}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Wizard Actions */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentStep > 1) {
                        setCurrentStep(currentStep - 1);
                      } else {
                        setShowWizard(false);
                      }
                    }}
                    className="btn btn-outline flex items-center space-x-2"
                  >
                    <FiArrowLeft className="w-4 h-4" />
                    <span>{currentStep > 1 ? 'Previous' : 'Cancel'}</span>
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex items-center space-x-2"
                  >
                    <span>{currentStep < 3 ? 'Next' : 'Create Relocation'}</span>
                    {currentStep < 3 ? (
                      <FiArrowRight className="w-4 h-4" />
                    ) : (
                      <FiCheck className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Relocations List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : relocations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relocations.map((relocation) => (
            <motion.div
              key={relocation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <FiTruck className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {relocation.origin}
                      </h3>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <FiArrowRight className="w-4 h-4" />
                        <span>{relocation.destination}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {getStatusBadge(relocation.status)}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FiCalendar className="w-4 h-4" />
                  <span>{new Date(relocation.moving_date).toLocaleDateString()}</span>
                </div>
                {relocation.estimated_cost && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FiDollarSign className="w-4 h-4" />
                    <span className="font-semibold text-gray-900">
                      ${relocation.estimated_cost}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                {!relocation.estimated_cost && (
                  <button
                    onClick={() => calculateQuotation(relocation.id)}
                    className="btn btn-outline btn-sm flex-1"
                  >
                    Calculate Quote
                  </button>
                )}
                <Link
                  to={`/relocations/${relocation.id}`}
                  className="btn btn-primary btn-sm flex-1 text-center"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FiTruck}
          title="No relocations yet"
          description="Start planning your first relocation to get started"
          actionLabel="Create Relocation"
          onAction={() => setShowWizard(true)}
        />
      )}
    </div>
  );
};

export default Relocations;
