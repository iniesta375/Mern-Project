const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const api = {
  auth: {
    login: async (data) => {
      console.log('Fetching:', `${API_BASE}/auth/login`);
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Login failed');
      return res.json();
    },
    register: async (data) => {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Registration failed');
      return res.json();
    },
    me: async () => {
      const res = await fetch(`${API_BASE}/auth/me`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch user');
      return res.json();
    },
  },
  medications: {
    list: async () => {
      const res = await fetch(`${API_BASE}/medications`, { headers: getHeaders() });
      return res.json();
    },
    create: async (data) => {
      const res = await fetch(`${API_BASE}/medications`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return res.json();
    },
    delete: async (id) => {
      await fetch(`${API_BASE}/medications/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
    },
  },
  adherence: {
    today: async () => {
      const res = await fetch(`${API_BASE}/adherence/today`, { headers: getHeaders() });
      return res.json();
    },
    log: async (data) => {
      await fetch(`${API_BASE}/adherence/log`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
    },
    stats: async () => {
      const res = await fetch(`${API_BASE}/adherence/stats`, { headers: getHeaders() });
      return res.json();
    },
  },
  wellness: {
    logs: async () => {
      const res = await fetch(`${API_BASE}/wellness/logs`, { headers: getHeaders() });
      return res.json();
    },
    log: async (data) => {
      await fetch(`${API_BASE}/wellness/log`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
    },
  },
  reports: {
    summary: async () => {
      const res = await fetch(`${API_BASE}/reports/summary`, { headers: getHeaders() });
      return res.json();
    },
  },
};
