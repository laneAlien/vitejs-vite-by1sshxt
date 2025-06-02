import axios from 'axios';

export const loginWithGoogle = async (code: string) => {
  const response = await axios.post('/api/auth/google', { code });
  return response.data;
};

export const loginWithCredentials = async (username: string, password: string) => {
  const response = await axios.post('/api/auth/login', { username, password });
  return response.data;
};

export const verifyToken = async (token: string) => {
  const response = await axios.get('/api/auth/verify', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};