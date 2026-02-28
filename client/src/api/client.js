const DEFAULT_API_URL = 'http://localhost:4000/api';

const normalizeBaseUrl = (value) => {
  const raw = (value || DEFAULT_API_URL).trim();
  return raw.replace(/\/+$/, '');
};

const normalizePath = (path) => (path.startsWith('/') ? path : `/${path}`);

const API_URL = normalizeBaseUrl(import.meta.env.VITE_API_URL);

const getHeaders = () => {
  const token = localStorage.getItem('fixaro_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${normalizePath(path)}`, {
    ...options,
    headers: { ...getHeaders(), ...(options.headers || {}) }
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : {};
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
};
