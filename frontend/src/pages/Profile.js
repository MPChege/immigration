import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiSave, FiX,
  FiCalendar, FiShield, FiCheckCircle, FiAward, FiTruck
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    contact: user?.contact || '',
    address: user?.address || '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axios.patch(`/api/auth/user/${user.id}/`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      updateUser(response.data);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      contact: user?.contact || '',
      address: user?.address || '',
    });
    setIsEditing(false);
  };

  const getInitials = () => {
    const first = user?.first_name?.[0] || '';
    const last = user?.last_name?.[0] || '';
    return (first + last).toUpperCase() || user?.username?.[0]?.toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/20 to-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-soft">
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-maroon-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-4xl font-bold text-white">{getInitials()}</span>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <FiEdit2 className="w-4 h-4 text-gray-700" />
                    </button>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {user?.first_name && user?.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : user?.username}
                </h2>
                <p className="text-sm text-gray-500 capitalize mb-4">
                  {user?.user_type?.replace('_', ' ')}
                </p>
                {user?.is_verified && (
                  <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
                    <FiCheckCircle className="w-4 h-4" />
                    <span>Verified Account</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <FiTruck className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Relocations</p>
                      <p className="text-lg font-bold text-gray-900">-</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-maroon-50 rounded-lg">
                      <FiAward className="w-5 h-5 text-maroon-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Member Since</p>
                      <p className="text-lg font-bold text-gray-900">
                        {user?.created_at
                          ? new Date(user.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              year: 'numeric',
                            })
                          : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-soft">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      <FiX className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-maroon-600 text-white rounded-lg hover:from-red-600 hover:to-maroon-700 transition-all font-medium disabled:opacity-50"
                    >
                      <FiSave className="w-4 h-4" />
                      <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiUser className="inline w-4 h-4 mr-2" />
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                      placeholder="Enter first name"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                      {user?.first_name || 'Not set'}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiUser className="inline w-4 h-4 mr-2" />
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                      placeholder="Enter last name"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                      {user?.last_name || 'Not set'}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiMail className="inline w-4 h-4 mr-2" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                      placeholder="Enter email"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                      {user?.email || 'Not set'}
                    </p>
                  )}
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiPhone className="inline w-4 h-4 mr-2" />
                    Contact Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                      placeholder="Enter contact number"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                      {user?.contact || 'Not set'}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiMapPin className="inline w-4 h-4 mr-2" />
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none"
                      placeholder="Enter address"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 min-h-[60px]">
                      {user?.address || 'Not set'}
                    </p>
                  )}
                </div>

                {/* Account Info */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <FiShield className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Account Type</p>
                        <p className="font-medium text-gray-900 capitalize">
                          {user?.user_type?.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <FiCalendar className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Joined</p>
                        <p className="font-medium text-gray-900">
                          {user?.created_at
                            ? new Date(user.created_at).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
