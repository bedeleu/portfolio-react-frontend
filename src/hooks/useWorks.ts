// src/hooks/useWorks.ts
import {useState, useCallback, useEffect} from 'react';
import { workService } from '@/services/api';

export interface Work {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  clientUrl: string;
  isVisible: boolean;
}

export interface CreateWorkDTO {
  title: string;
  description: string;
  imageUrl: string;
  clientUrl: string;
  isVisible: boolean;
}

export interface UpdateWorkDTO extends Partial<CreateWorkDTO> {}

export const useWorks = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await workService.getAll();
      setWorks(data);
    } catch (error) {
      console.error('Failed to fetch works:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createWork = useCallback(async (work: CreateWorkDTO) => {
    try {
      const createdWork = await workService.create(work);
      setWorks(prev => [...prev, createdWork]);
      return createdWork;
    } catch (error) {
      console.error('Failed to create work:', error);
      throw error;
    }
  }, []);

  const updateWork = useCallback(async (id: number, work: UpdateWorkDTO) => {
    try {
      const updatedWork = await workService.update(id, work);
      setWorks(prev => prev.map(w => w.id === id ? updatedWork : w));
      return updatedWork;
    } catch (error) {
      console.error('Failed to update work:', error);
      throw error;
    }
  }, []);

  const deleteWork = useCallback(async (id: number) => {
    try {
      await workService.delete(id);
      setWorks(prev => prev.filter(w => w.id !== id));
    } catch (error) {
      console.error('Failed to delete work:', error);
      throw error;
    }
  }, []);

  // Folosim useEffect pentru a încărca datele inițiale
  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  return {
    works,
    loading,
    createWork,
    updateWork,
    deleteWork,
    fetchWorks
  };
};