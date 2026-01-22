import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import {
  FiTruck, FiMail, FiLock, FiUser, FiPhone, FiMapPin,
  FiArrowRight, FiArrowLeft, FiBriefcase, FiUsers, FiPackage, FiDollarSign
} from 'react-icons/fi';

const Register = ({ provider = false }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    contact: '',
    address: '',
    ...(provider && {
      company_name: '',
      contact_person: '',
      services_offered: '',
      pricing_info: '',
    }),
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const totalSteps = provider ? 3 : 2;

  const steps = provider
    ? [
        { number: 1, title: 'Personal Info', icon: FiUser },
        { number: 2, title: 'Company Details', icon: FiBriefcase },
        { number: 3, title: 'Review', icon: FiPackage },
      ]
    : [
        { number: 1, title: 'Account Info', icon: FiUser },
        { number: 2, title: 'Personal Details', icon: FiMapPin },
      ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.username || !formData.email || !formData.password || !formData.password2) {
        setError('Please fill in all required fields');
        return false;
      }
      if (formData.password !== formData.password2) {
        setError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        return false;
      }
    }
    if (currentStep === 2) {
      if (!formData.first_name || !formData.last_name || !formData.contact || !formData.address) {
        setError('Please fill in all required fields');
        return false;
      }
      if (provider && (!formData.company_name || !formData.contact_person || !formData.services_offered)) {
        setError('Please fill in all company details');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!validateStep()) return;

    setLoading(true);
    setError('');

    const result = await register(formData, provider);
    if (result.success) {
      toast.success(provider ? 'Service provider account created!' : 'Account created successfully!');
      setTimeout(() => {
        if (provider) {
          navigate('/provider/dashboard');
        } else {
          navigate('/dashboard');
        }
      }, 500);
    } else {
      const errorMsg = typeof result.error === 'object' 
        ? Object.values(result.error).flat().join(', ') 
        : result.error;
      setError(errorMsg || 'Registration failed');
      toast.error(errorMsg || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Logo and Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-large">
              <FiTruck className="text-white text-2xl" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {provider ? 'Register as Service Provider' : 'Create Your Account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {provider 
              ? 'Join our network of trusted relocation professionals'
              : 'Start managing your relocations today'
            }
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            return (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-primary-600 text-white shadow-lg scale-110'
                        : isCompleted
                        ? 'bg-success-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {isCompleted ? (
                      <FiArrowRight className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`mt-2 text-xs font-medium ${isActive ? 'text-primary-600' : 'text-gray-600'}`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 ${isCompleted ? 'bg-success-600' : 'bg-gray-200'} transition-colors`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Registration Form */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="card"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Account Information */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="form-group">
                  <label htmlFor="username" className="form-label flex items-center space-x-2">
                    <FiUser className="w-4 h-4" />
                    <span>Username</span>
                  </label>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Choose a username"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label flex items-center space-x-2">
                    <FiMail className="w-4 h-4" />
                    <span>Email</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="password" className="form-label flex items-center space-x-2">
                      <FiLock className="w-4 h-4" />
                      <span>Password</span>
                    </label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Min. 8 characters"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password2" className="form-label flex items-center space-x-2">
                      <FiLock className="w-4 h-4" />
                      <span>Confirm Password</span>
                    </label>
                    <input
                      id="password2"
                      type="password"
                      name="password2"
                      value={formData.password2}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Re-enter password"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Personal/Company Information */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="first_name" className="form-label flex items-center space-x-2">
                      <FiUser className="w-4 h-4" />
                      <span>First Name</span>
                    </label>
                    <input
                      id="first_name"
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="John"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="last_name" className="form-label flex items-center space-x-2">
                      <FiUser className="w-4 h-4" />
                      <span>Last Name</span>
                    </label>
                    <input
                      id="last_name"
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="contact" className="form-label flex items-center space-x-2">
                    <FiPhone className="w-4 h-4" />
                    <span>Contact Number</span>
                  </label>
                  <input
                    id="contact"
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address" className="form-label flex items-center space-x-2">
                    <FiMapPin className="w-4 h-4" />
                    <span>Address</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="Enter your full address"
                    rows={3}
                    required
                  />
                </div>

                {provider && (
                  <>
                    <div className="border-t border-gray-200 pt-5 mt-5">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <FiBriefcase className="w-5 h-5 text-primary-600" />
                        <span>Company Information</span>
                      </h3>
                    </div>

                    <div className="form-group">
                      <label htmlFor="company_name" className="form-label flex items-center space-x-2">
                        <FiBriefcase className="w-4 h-4" />
                        <span>Company Name</span>
                      </label>
                      <input
                        id="company_name"
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="ABC Relocation Services"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="contact_person" className="form-label flex items-center space-x-2">
                        <FiUsers className="w-4 h-4" />
                        <span>Contact Person</span>
                      </label>
                      <input
                        id="contact_person"
                        type="text"
                        name="contact_person"
                        value={formData.contact_person}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="services_offered" className="form-label flex items-center space-x-2">
                        <FiPackage className="w-4 h-4" />
                        <span>Services Offered</span>
                      </label>
                      <textarea
                        id="services_offered"
                        name="services_offered"
                        value={formData.services_offered}
                        onChange={handleChange}
                        className="form-textarea"
                        placeholder="e.g., Packing, Transportation, Unpacking, Storage"
                        rows={4}
                        required
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        List all services your company provides
                      </p>
                    </div>

                    <div className="form-group">
                      <label htmlFor="pricing_info" className="form-label flex items-center space-x-2">
                        <FiDollarSign className="w-4 h-4" />
                        <span>Pricing Information (Optional)</span>
                      </label>
                      <textarea
                        id="pricing_info"
                        name="pricing_info"
                        value={formData.pricing_info}
                        onChange={handleChange}
                        className="form-textarea"
                        placeholder="e.g., Starting from $500 for local moves, $1000+ for long distance"
                        rows={3}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 3: Review (Provider only) */}
            {currentStep === 3 && provider && (
              <div className="space-y-5">
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Review Your Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Username</p>
                      <p className="font-medium text-gray-900">{formData.username}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium text-gray-900">{formData.first_name} {formData.last_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Contact</p>
                      <p className="font-medium text-gray-900">{formData.contact}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium text-gray-900">{formData.address}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Company Name</p>
                      <p className="font-medium text-gray-900">{formData.company_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Contact Person</p>
                      <p className="font-medium text-gray-900">{formData.contact_person}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Services Offered</p>
                      <p className="font-medium text-gray-900 whitespace-pre-line">{formData.services_offered}</p>
                    </div>
                    {formData.pricing_info && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">Pricing Info</p>
                        <p className="font-medium text-gray-900 whitespace-pre-line">{formData.pricing_info}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-danger-50 border border-danger-200 text-danger-800 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  if (currentStep > 1) {
                    setCurrentStep(currentStep - 1);
                    setError('');
                  } else {
                    navigate('/login');
                  }
                }}
                className="btn btn-outline flex items-center space-x-2"
                disabled={loading}
              >
                <FiArrowLeft className="w-4 h-4" />
                <span>{currentStep > 1 ? 'Previous' : 'Back to Login'}</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="btn btn-primary flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </>
                ) : currentStep < totalSteps ? (
                  <>
                    <span>Next</span>
                    <FiArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <FiArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
