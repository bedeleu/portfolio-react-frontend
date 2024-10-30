// frontend/src/services/api.ts
import axios from 'axios';
import { Work, CreateWorkDTO, UpdateWorkDTO } from '@/hooks/useWorks';
import { environment } from '@/config/environment';

// Definim interfețele pentru răspunsurile API
interface WorksResponse {
  works: Work[];
}

interface UploadResponse {
  url: string;
}

const api = axios.create({
  baseURL: environment.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Serviciu pentru încărcarea imaginilor
export const uploadService = {
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const { data } = await axios.post<UploadResponse>(
      environment.uploadUrl,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return `${environment.apiUrl}${data.url}`;
  }
};

export const workService = {
  async getAll(): Promise<Work[]> {
    try {
      const response = await api.get<Work[] | WorksResponse>('/works');
      const { data } = response;

      // Verificăm dacă data este un array
      if (Array.isArray(data)) {
        return data;
      }

      // Verificăm dacă data este un obiect cu proprietatea works
      if ('works' in data && Array.isArray(data.works)) {
        return data.works;
      }

      // Dacă nu avem un format valid, returnăm array gol
      console.warn('Unexpected API response format:', data);
      return [];
    } catch (error) {
      console.error('Error fetching works:', error);
      return [];
    }
  },

  async create(work: CreateWorkDTO): Promise<Work> {
    try {
      const { data } = await api.post<Work>('/works', work);
      return data;
    } catch (error) {
      console.error('Error creating work:', error);
      throw error;
    }
  },

  async update(id: number, work: UpdateWorkDTO): Promise<Work> {
    try {
      const { data } = await api.patch<Work>(`/works/${id}`, work);
      return data;
    } catch (error) {
      console.error('Error updating work:', error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/works/${id}`);
    } catch (error) {
      console.error('Error deleting work:', error);
      throw error;
    }
  }
};