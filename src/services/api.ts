// frontend/src/services/api.ts
import axios from 'axios';
import { Work, CreateWorkDTO, UpdateWorkDTO } from '@/hooks/useWorks';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const workService = {
  async getAll(): Promise<Work[]> {
    const { data } = await api.get<Work[]>('/works');
    // Asigurăm-ne că data este un array
    if (!Array.isArray(data)) {
      if (data && Array.isArray(data.works)) {
        return data.works;
      }
      return [];
    }
    return data;
  },

  async create(work: CreateWorkDTO): Promise<Work> {
    const { data } = await api.post<Work>('/works', work);
    return data;
  },

  async update(id: number, work: UpdateWorkDTO): Promise<Work> {
    const { data } = await api.patch<Work>(`/works/${id}`, work);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/works/${id}`);
  }
};