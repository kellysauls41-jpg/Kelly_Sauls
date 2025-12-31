
import React from 'react';
import { ICONS } from '../constants';
import { View } from '../types';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, onSearch }) => {
  const [searchVal, setSearchVal] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchVal);
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b-4 border-blue-100 px-4 md:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setView('gallery')}>
          <div className="w-10 h-10 bg-yellow-400 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-md">
            <ICONS.Star className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tight text-blue-600 leading-none">WallAI</h1>
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Kids '23 Edition</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-bold">
          <button 
            onClick={() => setView('gallery')}
            className={`transition-all pb-1 border-b-2 ${currentView === 'gallery' ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-blue-400'}`}
          >
            Art Gallery
          </button>
          <button 
            onClick={() => setView('generate')}
            className={`transition-all pb-1 border-b-2 ${currentView === 'generate' ? 'text-pink-500 border-pink-500' : 'text-slate-400 border-transparent hover:text-pink-400'}`}
          >
            Create Art
          </button>
          <button 
            onClick={() => setView('my-walls')}
            className={`transition-all pb-1 border-b-2 ${currentView === 'my-walls' ? 'text-green-500 border-green-500' : 'text-slate-400 border-transparent hover:text-green-400'}`}
          >
            My Stickers
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-1 justify-end max-w-lg ml-4">
        <form onSubmit={handleSearch} className="relative w-full group">
          <ICONS.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search for magic..." 
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full bg-white border-2 border-slate-100 rounded-2xl py-2 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-blue-400 transition-all shadow-sm"
          />
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
