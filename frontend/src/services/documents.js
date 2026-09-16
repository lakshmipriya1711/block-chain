const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function uploadDocument(file, token) {
  const formData = new FormData();
  formData.append('document', file);
  const response = await fetch(`${API_URL}/documents/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Upload failed.');
  return data;
}

export async function verifyUploadedDocument(id) {
  const response = await fetch(`${API_URL}/documents/${encodeURIComponent(id)}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Document not found.');
  return data;
}
