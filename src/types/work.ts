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