import { useState } from 'react';
import { Eye, EyeOff, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { Work } from '@/hooks/useWorks';

interface WorkCardProps {
  work: Work;
  onToggleVisibility: (id: number) => void;
  onEdit: (work: Work) => void;
  onDelete: (id: number) => void;
}

export function WorkCard({ work, onToggleVisibility, onEdit, onDelete }: WorkCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
        !work.isVisible ? 'opacity-75' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageError ? 'https://picsum.photos/600/400' : work.imageUrl}
          alt={work.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setImageError(true)}
        />
        {/* Overlay cu butoane */}
        <div className={`absolute inset-0 bg-black/50 flex items-center justify-center gap-4 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={() => onToggleVisibility(work.id)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all"
          >
            {work.isVisible ?
              <Eye className="h-5 w-5 text-white" /> :
              <EyeOff className="h-5 w-5 text-white" />
            }
          </button>
          <button
            onClick={() => onEdit(work)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all"
          >
            <Pencil className="h-5 w-5 text-white" />
          </button>
          <button
            onClick={() => onDelete(work.id)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all"
          >
            <Trash2 className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
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
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          Visit Project
        </a>
      </div>
    </div>
  );
}