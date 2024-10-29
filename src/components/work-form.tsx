// src/components/work-form.tsx
import { useState } from 'react';
import { Work, CreateWorkDTO } from '@/types/work';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface WorkFormProps {
  work?: Work;
  onSubmit: (data: CreateWorkDTO) => Promise<void>;
  onCancel: () => void;
}

export function WorkForm({ work, onSubmit, onCancel }: WorkFormProps) {
  const [formData, setFormData] = useState<CreateWorkDTO>({
    title: work?.title || '',
    description: work?.description || '',
    imageUrl: work?.imageUrl || '',
    clientUrl: work?.clientUrl || '',
    isVisible: work?.isVisible ?? true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              // În mod normal aici ar trebui să facem upload la imagine
              // Pentru demo folosim un URL placeholder
              setFormData({ ...formData, imageUrl: '/api/placeholder/600/400' });
            }
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientUrl">Client Website URL</Label>
        <Input
          id="clientUrl"
          type="url"
          value={formData.clientUrl}
          onChange={(e) => setFormData({ ...formData, clientUrl: e.target.value })}
          required
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : work ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}