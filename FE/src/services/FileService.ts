import axios from 'axios';
import {
  CreateDirectoryPayload,
  Element,
  UploadFilesPayload,
} from '../interfaces/Element';
import getAuthToken from './AuthService';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/elements`;

export const FileService = {
  async getUserElements(): Promise<Element[]> {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async getSharedElements(): Promise<Element[]> {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/shared`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async createDirectory(payload: CreateDirectoryPayload): Promise<Element> {
    const token = getAuthToken();
    const response = await axios.post(
      `${API_BASE_URL}/create/directory`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
  async uploadFiles(payload: UploadFilesPayload): Promise<Element[]> {
    const token = getAuthToken();
    const formData = new FormData();
    // Append each file to the FormData under the 'files' key
    Array.from(payload.files).forEach((file) => {
      formData.append('files', file);
    });
    // Append parent and path if provided
    if (payload.parentId !== undefined) {
      formData.append('parentId', payload.parentId || '');
    }

    const response = await axios.post(
      `${API_BASE_URL}/upload/files`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // Let the browser set Content-Type for FormData
        },
      }
    );
    // The backend returns { message, elements }, so return elements array
    return response.data.elements || response.data;
  },
};
