import React, { useState, memo, useCallback } from 'react';
import { Eye, EyeOff, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { Work } from '@/hooks/useWorks';

interface WorkCardProps {
  work: Work;
  onToggleVisibility: (id: number) => void;
  onEdit: (work: Work) => void;
  onDelete: (id: number) => void;
  viewMode?: 'grid' | 'list';
}

interface ActionButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon: React.ReactNode;
  ariaLabel: string;
}

interface ListActionButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  label: string;
  variant?: 'default' | 'danger';
}

// Memoized sub-components pentru performanță
const ActionButton = memo<ActionButtonProps>(({ onClick, icon, ariaLabel }) => (
  <button
    onClick={onClick}
    className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all
               hover:scale-110 active:scale-95"
    aria-label={ariaLabel}
  >
    {icon}
  </button>
));

const ListActionButton = memo<ListActionButtonProps>(({ onClick, label, variant = 'default' }) => (
  <button
    onClick={onClick}
    className={`
      w-full px-3 py-1.5 text-sm font-medium
      rounded-md border 
      transition-all duration-300 ease-in-out
      transform hover:scale-95
      ${variant === 'danger'
      ? 'text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700'
      : 'text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-700'
    }
    `}
  >
    {label}
  </button>
));

const CardContent = memo<{ work: Work }>(({ work }) => (
  <div className="p-4">
    <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
      {work.title}
    </h3>
    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
      {work.description}
    </p>
    <a
      href={work.clientUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm
               font-medium transition-colors hover:scale-105 active:scale-95"
    >
      <ExternalLink className="h-4 w-4" />
      Visit Project
    </a>
  </div>
));

const WorkImage = memo<{
  src: string;
  alt: string;
  className: string;
  onError: () => void;
}>(({ src, alt, className, onError }) => (
  <img
    src={src}
    alt={alt}
    className={className}
    onError={onError}
    loading="lazy"
  />
));

export const WorkCard = memo<WorkCardProps>(({ work, onToggleVisibility, onEdit, onDelete, viewMode = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDelete = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (window.confirm('Are you sure you want to delete this project?')) {
      onDelete(work.id);
    }
  }, [work.id, onDelete]);

  const handleToggleVisibility = useCallback(() => {
    onToggleVisibility(work.id);
  }, [work.id, onToggleVisibility]);

  const handleEdit = useCallback(() => {
    onEdit(work);
  }, [work, onEdit]);

  const imageUrl = imageError ? '/api/placeholder/600/400' : work.imageUrl;

  if (viewMode === 'grid') {
    return (
      <div
        className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl 
                   ${!work.isVisible ? 'opacity-25' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-64 overflow-hidden">
          <WorkImage
            src={imageUrl}
            alt={work.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
          <div
            className={`absolute inset-0 bg-black/50 flex items-center justify-center gap-4
                       transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          >
            <ActionButton
              onClick={handleToggleVisibility}
              icon={work.isVisible ? <Eye className="h-5 w-5 text-white" /> : <EyeOff className="h-5 w-5 text-white" />}
              ariaLabel={work.isVisible ? 'Hide project' : 'Show project'}
            />
            <ActionButton
              onClick={handleEdit}
              icon={<Pencil className="h-5 w-5 text-white" />}
              ariaLabel="Edit project"
            />
            <ActionButton
              onClick={handleDelete}
              icon={<Trash2 className="h-5 w-5 text-white" />}
              ariaLabel="Delete project"
            />
          </div>
        </div>
        <CardContent work={work} />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${!work.isVisible ? 'opacity-25' : ''}`}>
      <div className="flex flex-row p-4 gap-4 items-center">
        <div className="w-[120px] flex-shrink-0">
          <WorkImage
            src={imageUrl}
            alt={work.title}
            className="w-full h-20 object-cover rounded-md"
            onError={() => setImageError(true)}
          />
        </div>
        <div className="flex-grow min-w-0">
          <CardContent work={work} />
        </div>
        <div className="flex-shrink-0 w-[90px] flex flex-col gap-2">
          <ListActionButton
            onClick={handleToggleVisibility}
            label={work.isVisible ? 'Hide' : 'Show'}
          />
          <ListActionButton
            onClick={handleEdit}
            label="Edit"
          />
          <ListActionButton
            onClick={handleDelete}
            label="Delete"
            variant="danger"
          />
        </div>
      </div>
    </div>
  );
});

// Display names pt debugging
ActionButton.displayName = 'ActionButton';
ListActionButton.displayName = 'ListActionButton';
CardContent.displayName = 'CardContent';
WorkImage.displayName = 'WorkImage';
WorkCard.displayName = 'WorkCard';