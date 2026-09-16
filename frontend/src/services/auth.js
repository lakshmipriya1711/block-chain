const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options });
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(data?.message || 'Request failed.');
  return data;
}

export function signUp(payload) { return request('/auth/signup', { method: 'POST', body: JSON.stringify(payload) }); }
export function login(payload) { return request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }); }
export function currentUser(token) { return request('/auth/me', { headers: { Authorization: `Bearer ${token}` } }); }
export function logout(token) { return request('/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } }); }
