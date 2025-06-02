import axios from 'axios';

export const registerUser = async (username: string, password: string, role: string) => {
  const response = await axios.post('/api/admin/register', { username, password, role });
  return response.data;
};