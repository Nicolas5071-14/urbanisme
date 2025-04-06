import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Intercepteur pour les erreurs
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default {
  // Documents
  getDocuments: () => api.get('/documents'),
  uploadDocument: (formData) => api.post('/documents', formData),

  // Batiments
  getBatiments: () => api.get('/batiments'),
  linkDocumentToBatiment: (batimentId, documentId) => 
    api.post(`/batiment-documents/link/${batimentId}/${documentId}`),

  // Projets Urbains
  getProjetsUrbains: () => api.get('/projets-urbains'),
  createProjetUrbain: (data) => api.post('/projets-urbains', data),
};