const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed: ${res.status}`);
  }
  return res.json();
};

export const api = {

  auth: {
    login: async (data) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    register: async (data) => {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    me: async () => {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    updateProfile: async (data) => {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    updatePreferences: async (data) => {
      const res = await fetch(`${API_BASE}/auth/preferences`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    deleteAccount: async () => {
      const res = await fetch(`${API_BASE}/auth/account`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    forgotPassword: async (data) => {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
 
    resetPassword: async (data) => {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

        googleLogin: async ({ idToken }) => {
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      return handleResponse(res);
    },

    uploadAvatar: async (file) => {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await fetch(`${API_BASE}/auth/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      return handleResponse(res);
    },
  },



  medications: {
    list: async () => {
      const res = await fetch(`${API_BASE}/medications`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    create: async (data) => {
      const res = await fetch(`${API_BASE}/medications`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    delete: async (id) => {
      const res = await fetch(`${API_BASE}/medications/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  adherence: {
    today: async () => {
      const res = await fetch(`${API_BASE}/adherence/today`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    log: async (data) => {
      const res = await fetch(`${API_BASE}/adherence/log`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    stats: async () => {
      const res = await fetch(`${API_BASE}/adherence/stats`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  wellness: {
    logs: async () => {
      const res = await fetch(`${API_BASE}/wellness/logs`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    log: async (data) => {
      const res = await fetch(`${API_BASE}/wellness/log`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
  },

  reports: {
    summary: async () => {
      const res = await fetch(`${API_BASE}/reports/summary`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

};