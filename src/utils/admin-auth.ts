// Admin authentication utilities connected to backend API

import { API_BASE_URL } from '../constants';

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
}

const ADMIN_KEY = 'current_admin';

export const loginAdmin = async (email: string, password: string): Promise<{ admin: Admin; token: string }> => {
  const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Admin login failed');
  }

  const data = await response.json();

  // Store admin data and token
  localStorage.setItem('admin_token', data.token);
  localStorage.setItem(ADMIN_KEY, JSON.stringify(data.admin));

  return {
    admin: data.admin,
    token: data.token,
  };
};

export const getCurrentAdmin = (): Admin | null => {
  const token = localStorage.getItem('admin_token');
  if (!token) return null;

  const adminStr = localStorage.getItem(ADMIN_KEY);
  if (!adminStr) return null;

  try {
    return JSON.parse(adminStr);
  } catch {
    return null;
  }
};

export const isAdminAuthenticated = (): boolean => {
  const token = localStorage.getItem('admin_token');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch {
    return false;
  }
};

export const logoutAdmin = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem(ADMIN_KEY);
};
