import axios from 'axios';
import { Skin, ApiResponse } from '../types/Skin';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const skinService = {
  getAllSkins: async (): Promise<ApiResponse<Skin[]>> => {
    const response = await api.get('/skins');
    return response.data;
  },

  getSkinById: async (id: number): Promise<ApiResponse<Skin>> => {
    const response = await api.get(`/skins/${id}`);
    return response.data;
  },
};