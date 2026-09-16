const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function verifyCredential(id) {
  const response = await fetch(`${API_URL}/credentials/${encodeURIComponent(id)}`);
  if (!response.ok) throw new Error('Credential not found');
  return response.json();
}
