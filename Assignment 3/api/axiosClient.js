import axios from 'axios';
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Inject auth token on every request
axiosClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // Debug log
  console.log('API REQUEST:', config.method?.toUpperCase(), config.baseURL + config.url);
  return config;
});

// Debug response
axiosClient.interceptors.response.use(
  (response) => {
    console.log('API RESPONSE:', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    console.log('API ERROR:', error.message, error.config?.url);
    return Promise.reject(error);
  }
);

export default axiosClient;