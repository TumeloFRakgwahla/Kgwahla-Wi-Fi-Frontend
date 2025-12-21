// Authentication utilities connected to backend API

import { API_BASE_URL } from '../constants';

export interface User {
  id: string;
  name: string;
  roomNumber: string;
  idNumber: string;
  phone: string;
  email: string;
  macAddress: string;
  status: 'active' | 'blocked';
  wifiAccess: boolean;
  expiryDate: string;
}

export interface Payment {
  id: string;
  tenantId: string;
  type: 'POP' | 'cash';
  fileUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
  approvedAt?: string;
}

export const registerUser = async (userData: {
  name: string;
  roomNumber: string;
  idNumber: string;
  phone: string;
  email: string;
  macAddress: string;
  password: string;
  expiryDate: string;
}): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  const data = await response.json();
  return data.tenant;
};

export const loginUser = async (identifier: string, password: string): Promise<{ user: User; token: string }> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ identifier, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  const data = await response.json();

  // Store token
  localStorage.setItem('auth_token', data.token);

  return {
    user: data.tenant,
    token: data.token,
  };
};

export const getCurrentUser = async (): Promise<User | null> => {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        logout(); // Token expired or invalid
      }
      return null;
    }

    const userData = await response.json();
    return userData;
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('auth_token');
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('auth_token');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch {
    return false;
  }
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const uploadPayment = async (formData: FormData): Promise<Payment> => {
  const response = await fetch(`${API_BASE_URL}/payments/upload`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Payment upload failed');
  }

  const data = await response.json();
  return data.payment;
};

export const getPaymentStatus = async (): Promise<Payment[]> => {
  const response = await fetch(`${API_BASE_URL}/payments/status`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get payment status');
  }

  return await response.json();
};

export const submitCashPayment = async (): Promise<Payment> => {
  const response = await fetch(`${API_BASE_URL}/payments/cash`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Cash payment submission failed');
  }

  const data = await response.json();
  return data.payment;
};
