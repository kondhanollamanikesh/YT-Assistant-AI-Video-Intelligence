import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 180000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** Extract a human-readable message from an axios/FastAPI error. */
export const getErrorMessage = (error, fallback = 'Something went wrong') => {
  if (error?.response?.data?.detail) {
    const detail = error.response.data.detail;
    return typeof detail === 'string' ? detail : fallback;
  }
  if (error?.code === 'ECONNABORTED') return 'The request timed out. Please try again.';
  if (error?.message === 'Network Error') {
    return 'Cannot reach the server. Make sure the backend is running on port 8000.';
  }
  return error?.message || fallback;
};

export const loadVideo = async (url) => {
  const response = await api.post('/load-video', { url });
  return response.data;
};

export const sendMessage = async (sessionId, message) => {
  const response = await api.post('/chat', { session_id: sessionId, message });
  return response.data;
};

export const getTranscript = async (sessionId, searchQuery = null) => {
  const params = searchQuery ? { search_query: searchQuery } : {};
  const response = await api.get(`/transcript/${sessionId}`, { params });
  return response.data;
};

export const getSession = async (sessionId) => {
  const response = await api.get(`/session/${sessionId}`);
  return response.data;
};

export const deleteSession = async (sessionId) => {
  const response = await api.delete(`/session/${sessionId}`);
  return response.data;
};

export const getSummary = async (sessionId) => {
  const response = await api.get(`/summary/${sessionId}`);
  return response.data;
};

export const getQuiz = async (sessionId) => {
  const response = await api.get(`/quiz/${sessionId}`);
  return response.data;
};

export const getKeyPoints = async (sessionId) => {
  const response = await api.get(`/keypoints/${sessionId}`);
  return response.data;
};

export const checkHealth = async () => {
  const response = await api.get('/health', { timeout: 5000 });
  return response.data;
};

export default api;
