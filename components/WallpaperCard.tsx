
import React from 'react';
import { Wallpaper } from '../types';
import { ICONS } from '../constants';

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  onDownload: (url: string, id: string) => void;
  onOpen: (wallpaper: Wallpaper) => void;
}

const WallpaperCard: React.FC<WallpaperCardProps> = ({ wallpaper, onDownload, onOpen }) => {
  return (
    <div className="masonry-item group relative overflow-hidden rounded-2xl bg-gray-900 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10">
      <img
        src={wallpaper.url}
        alt={wallpaper.prompt}
        className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        onClick={() => onOpen(wallpaper)}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-5">
        <p className="text-sm text-gray-200 line-clamp-2 mb-3 font-medium">
          {wallpaper.prompt}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">By {wallpaper.author}</span>
          <div className="flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onDownload(wallpaper.url, wallpaper.id); }}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white backdrop-blur-md transition-colors"
              title="Download"
            >
              <ICONS.Download className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onOpen(wallpaper) }}
              className="p-2 bg-indigo-600/80 hover:bg-indigo-600 rounded-lg text-white backdrop-blur-md transition-colors"
              title="View Details"
            >
              <ICONS.Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WallpaperCard;
