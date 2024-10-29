// frontend/src/hooks/useWorks.ts
import { useState, useEffect } from 'react';
import { workService } from '@/services/api';

export interface Work {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  clientUrl: string;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateWorkDTO = Omit<Work, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateWorkDTO = Partial<CreateWorkDTO>;

export const useWorks = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorks = async () => {
    try {
      setLoading(true);
      const data = await workService.getAll();
      // Asigurăm-ne că data este un array înainte de a o seta
      setWorks(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('An error occurred while fetching works');
      setWorks([]); // Setăm un array gol în caz de eroare
    } finally {
      setLoading(false);
    }
  };

  const createWork = async (work: CreateWorkDTO) => {
    try {
      const newWork = await workService.create(work);
      setWorks(prev => [...prev, newWork]);
      return newWork;
    } catch (err) {
      console.error('Create error:', err);
      throw new Error('Failed to create work');
    }
  };

  const updateWork = async (id: number, work: UpdateWorkDTO) => {
    try {
      const updatedWork = await workService.update(id, work);
      setWorks(prev => prev.map(w => w.id === id ? updatedWork : w));
      return updatedWork;
    } catch (err) {
      console.error('Update error:', err);
      throw new Error('Failed to update work');
    }
  };

  const deleteWork = async (id: number) => {
    try {
      await workService.delete(id);
      setWorks(prev => prev.filter(w => w.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      throw new Error('Failed to delete work');
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  return {
    works,
    loading,
    error,
    createWork,
    updateWork,
    deleteWork,
    refreshWorks: fetchWorks
  };
};