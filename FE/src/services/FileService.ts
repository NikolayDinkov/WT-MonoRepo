import axios from 'axios';
import { Element } from '../interfaces/Element';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/elements`;

export const FileService = {
  async getUserElements(userId: string): Promise<Element[]> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No auth token found');
    const response = await axios.get(`${API_BASE_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
