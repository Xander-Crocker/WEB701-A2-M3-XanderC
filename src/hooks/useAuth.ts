import { create } from 'zustand';
import axios, { AxiosError } from 'axios';

// Set the base URL for Axios
const API_URL = 'http://localhost:8081/api/'; 

// Create an Axios instance with the base URL
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Define the structure of a user
interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

// Define the structure of the profile form data
interface ProfileForm {
  username: string;
  email: string;
  currentPassword: string;
  newPassword?: string;
}
// Define the structure of the authentication state
interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, role: string) => Promise<void>;
  updateProfile: (data: ProfileForm, token: string) => Promise<void>;
  logout: () => void;
}

// Define the structure of an error response
interface ErrorResponse {
  message: string;
}

// Configure axios
axios.defaults.baseURL = '/api';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor for error handling
axios.interceptors.request.use(
  (config) => {
    // Get the token from local storage
    const token = localStorage.getItem('token');
    if (token) {
      // Set the Authorization header for the request
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  // Handle request errors
  (error) => {
    return Promise.reject(error);
  }
);

// Add response for error handling
export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),

  // Define the login function
  login: async (email: string, password: string) => {
    try {
      // Make a POST request to login
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });
      // Extract the token and user data from the response
      const { token, user } = response.data;
      // Store the token in local storage
      localStorage.setItem('token', token);
      // Update the user state with the new user data
      set({ token, user });
    } catch (error) {
      // Throw an error if the request fails
      const err = error as AxiosError<ErrorResponse>;
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  },

  // Define the register function
  register: async (username: string, email: string, password: string, role: string) => {
    try {
      // Make a POST request to register a new user
      const response = await axiosInstance.post('/auth/register', {
        username,
        email,
        password,
        role,
      });
      // Extract the token and user data from the response
      const { token, user } = response.data;
      // Store the token in local storage
      localStorage.setItem('token', token);
      // Update the user state with the new user data
      set({ token, user });
    } catch (error) {
      // Throw an error if the request fails
      const err = error as AxiosError<ErrorResponse>;
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  },

  // Define the update profile function
  updateProfile: async (data: ProfileForm, token: string) => {
    try {
      console.log('Sending request to update profile with data:', data);
      // Make a PUT request to update the user profile
      const response = await axiosInstance.put('/auth/profile', 
        {
          username: data.username,
          email: data.email,
          currentPassword: data.currentPassword,
          newPassword: data.newPassword || undefined
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      // Update the user state with the new user data
      set({ user: response.data.user });
      return response.data;
    } catch (error) {
      // Throw an error if the request fails
      const err = error as AxiosError<ErrorResponse>;
      throw new Error(err.response?.data?.message || 'Failed to update profile');
    }
  },

  // Define the logout function
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
}));

