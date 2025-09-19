import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const projectApi = {
  // Get all projects
  getProjects: () => api.get('/projects'),

  // Create new project
  createProject: (data: { name: string; group: string }) => 
    api.post('/projects', data),
};

export const documentApi = {
  // Upload document
  uploadDocument: (projectId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);
    return api.post('/documents/upload', formData);
  },

  // Get documents for a project
  getProjectDocuments: (projectId: string) => 
    api.get(`/documents/project/${projectId}`),
};

export const chatApi = {
  // Send message
  sendMessage: (_projectId: string, message: string) =>
    api.post('/chat', { message }),
};

export const devApi = {
  // Get a dev token for local development
  getToken: () => api.get('/dev/login'),
};

export default api;