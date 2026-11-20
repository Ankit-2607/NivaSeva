const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function fetchClient(endpoint, options = {}) {
  const token = localStorage.getItem('nivaseva_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to NivaSeva backend server. Please verify backend is running on port 5000.');
    }
    throw error;
  }
}

// Authentication APIs
export const authApi = {
  login: (credentials) => fetchClient('/auth/login', { method: 'POST', body: credentials }),
  register: (userData) => fetchClient('/auth/register', { method: 'POST', body: userData }),
  getMe: () => fetchClient('/auth/me', { method: 'GET' }),
};

// Service APIs
export const serviceApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.all) query.append('all', 'true');
    const qs = query.toString() ? `?${query.toString()}` : '';
    return fetchClient(`/services${qs}`, { method: 'GET' });
  },
  getById: (id) => fetchClient(`/services/${id}`, { method: 'GET' }),
  create: (serviceData) => fetchClient('/services', { method: 'POST', body: serviceData }),
  update: (id, serviceData) => fetchClient(`/services/${id}`, { method: 'PUT', body: serviceData }),
  delete: (id) => fetchClient(`/services/${id}`, { method: 'DELETE' }),
};

// Booking APIs
export const bookingApi = {
  create: (bookingData) => fetchClient('/bookings', { method: 'POST', body: bookingData }),
  getMyBookings: () => fetchClient('/bookings/my', { method: 'GET' }),
  getById: (id) => fetchClient(`/bookings/${id}`, { method: 'GET' }),
  cancel: (id, reason) => fetchClient(`/bookings/${id}/cancel`, { method: 'PATCH', body: { reason } }),
};

// Admin APIs
export const adminApi = {
  getStats: () => fetchClient('/admin/stats', { method: 'GET' }),
  getAllBookings: (status) => {
    const qs = status && status !== 'ALL' ? `?status=${status}` : '';
    return fetchClient(`/admin/bookings${qs}`, { method: 'GET' });
  },
  updateBookingStatus: (id, status) =>
    fetchClient(`/admin/bookings/${id}/status`, { method: 'PATCH', body: { status } }),
  createAdmin: (adminData) => fetchClient('/admin/users', { method: 'POST', body: adminData }),
  getAllUsers: () => fetchClient('/admin/users', { method: 'GET' }),
};
