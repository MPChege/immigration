import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('access_token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/me/');
      const userData = response.data.user;
      if (response.data.service_provider) {
        userData.service_provider = response.data.service_provider;
      }
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/auth/login/', { username, password });
      const { access, refresh, user: userData, service_provider } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setToken(access);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      const userWithProvider = { ...userData };
      if (service_provider) {
        userWithProvider.service_provider = service_provider;
      }
      setUser(userWithProvider);
      localStorage.setItem('user', JSON.stringify(userWithProvider));
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const register = async (data, isProvider = false) => {
    try {
      const endpoint = isProvider ? '/api/auth/register/service-provider/' : '/api/auth/register/user/';
      const response = await axios.post(endpoint, data);
      const { access, refresh, user: userData, service_provider } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setToken(access);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      const userWithProvider = { ...userData };
      if (service_provider) {
        userWithProvider.service_provider = service_provider;
      }
      setUser(userWithProvider);
      localStorage.setItem('user', JSON.stringify(userWithProvider));
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Registration failed' 
      };
    }
  };

  const updateUser = (userData) => {
    const userWithProvider = { ...userData };
    if (userData.service_provider) {
      userWithProvider.service_provider = userData.service_provider;
    }
    setUser(userWithProvider);
    localStorage.setItem('user', JSON.stringify(userWithProvider));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
