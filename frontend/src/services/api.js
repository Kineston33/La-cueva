const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    ...options,
  });

  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || 'Request failed');
  return payload;
}

export const api = {
  signup: (body) => request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: (token) => request('/profile/me', { token }),
  updateMe: (token, body) => request('/profile/me', { method: 'PUT', token, body: JSON.stringify(body) }),
  getTechnicians: ({ category, location }) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (location) params.set('location', location);
    return request(`/profile/technicians?${params.toString()}`);
  },
  getAdminUsers: (token) => request('/admin/users', { token }),
};
