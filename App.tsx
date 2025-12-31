
import React, { useState, useEffect, useCallback } from 'react';
import { Wallpaper, View, GenerationParams } from './types';
import { CATEGORIES, ASPECT_RATIOS, STYLES, ICONS } from './constants';
import Navbar from './components/Navbar';
import WallpaperCard from './components/WallpaperCard';
import Button from './components/Button';
import { generateWallpaper, editWallpaper } from './services/geminiService';

const MOCK_WALLPAPERS: Wallpaper[] = [
  { id: '1', url: 'https://picsum.photos/seed/kid1/1920/1080', prompt: 'A giant pizza moon with pepperoni stars in a purple cheese sky', author: 'Leo (Age 7)', aspectRatio: '16:9', createdAt: Date.now() },
  { id: '2', url: 'https://picsum.photos/seed/kid2/1080/1920', prompt: 'Rainbow dinosaur wearing a party hat jumping over a chocolate river', author: 'Mia (Age 5)', aspectRatio: '9:16', createdAt: Date.now() },
  { id: '3', url: 'https://picsum.photos/seed/kid3/1200/1200', prompt: 'Space cat driving a milk carton rocket through a galaxy of cookies', author: 'Sam (Age 8)', aspectRatio: '1:1', createdAt: Date.now() },
  { id: '4', url: 'https://picsum.photos/seed/kid4/1600/900', prompt: 'Underwater castle made of bubbles with jellyfish lanterns', author: 'Chloe (Age 6)', aspectRatio: '16:9', createdAt: Date.now() },
  { id: '5', url: 'https://picsum.photos/seed/kid5/1920/1080', prompt: 'Robot gardener planting flowers that look like lollipops', author: 'Zane (Age 9)', aspectRatio: '16:9', createdAt: Date.now() },
  { id: '6', url: 'https://picsum.photos/seed/kid6/1080/1920', prompt: 'Flying elephant with butterfly wings in a cotton candy cloud', author: 'Lily (Age 4)', aspectRatio: '9:16', createdAt: Date.now() },
];

type MockupType = 'none' | 'phone' | 'desktop';

const App: React.FC = () => {
  const [view, setView] = useState<View>('gallery');
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>(MOCK_WALLPAPERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [mockupMode, setMockupMode] = useState<MockupType>('none');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  
  const [genParams, setGenParams] = useState<GenerationParams>({
    prompt: '',
    aspectRatio: '16:9',
    style: STYLES[0]
  });

  const handleGenerate = async () => {
    if (!genParams.prompt) return;
    setIsGenerating(true);
    try {
      const imageUrl = await generateWallpaper(genParams);
      const newWallpaper: Wallpaper = {
        id: Math.random().toString(36).substr(2, 9),
        url: imageUrl,
        prompt: genParams.prompt,
        author: 'Me (Artist)',
        aspectRatio: genParams.aspectRatio,
        createdAt: Date.now()
      };
      setWallpapers(prev => [newWallpaper, ...prev]);
      setSelectedWallpaper(newWallpaper);
      setMockupMode('none');
      setView('my-walls');
    } catch (error) {
      alert("Uh oh! The magic brush is tired. Try again?");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedWallpaper || !editPrompt) return;
    setIsEditing(true);
    try {
      const editedUrl = await editWallpaper(selectedWallpaper.url, editPrompt);
      const newWallpaper: Wallpaper = {
        ...selectedWallpaper,
        id: Math.random().toString(36).substr(2, 9),
        url: editedUrl,
        prompt: `${selectedWallpaper.prompt} + ${editPrompt}`,
        createdAt: Date.now()
      };
      setWallpapers(prev => [newWallpaper, ...prev]);
      setSelectedWallpaper(newWallpaper);
      setEditPrompt('');
    } catch (error) {
      alert("The stickers won't stick! Try a different idea.");
    } finally {
      setIsEditing(false);
    }
  };

  const downloadImage = (url: string, id: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `my-masterpiece-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredWallpapers = wallpapers.filter(w => 
    w.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20">
      <Navbar currentView={view} setView={setView} onSearch={setSearchQuery} />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {view === 'gallery' && (
          <section className="space-y-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-4xl text-blue-600">Dreamy Designs '23</h2>
              <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSearchQuery(cat)}
                    className="whitespace-nowrap px-6 py-2 rounded-2xl bg-white border-2 border-blue-100 hover:border-pink-300 hover:bg-pink-50 transition-all text-sm font-bold text-slate-500 hover:text-pink-600 shadow-sm"
                  >
                    #{cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="masonry">
              {filteredWallpapers.map(wall => (
                <WallpaperCard 
                  key={wall.id} 
                  wallpaper={wall} 
                  onDownload={downloadImage}
                  onOpen={(w) => { setSelectedWallpaper(w); setMockupMode('none'); }}
                />
              ))}
            </div>
          </section>
        )}

        {view === 'generate' && (
          <section className="max-w-4xl mx-auto space-y-12 py-12">
            <div className="text-center space-y-4">
              <h2 className="text-5xl text-pink-500">Magic Art Studio</h2>
              <p className="text-slate-500 font-bold">What amazing thing should we draw today?</p>
            </div>

            <div className="glass p-8 rounded-[2.5rem] space-y-8 border-4 border-white shadow-2xl relative">
              {/* Decorative Sticker */}
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-yellow-300 rounded-full flex items-center justify-center rotate-[-15deg] border-4 border-white shadow-lg z-10">
                <ICONS.Star className="w-10 h-10 text-white" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-widest ml-2">Describe Your Vision</label>
                <textarea 
                  value={genParams.prompt}
                  onChange={(e) => setGenParams({...genParams, prompt: e.target.value})}
                  placeholder="A dragon eating a sandwich on a cloud..."
                  className="w-full h-32 bg-slate-50 border-4 border-slate-100 rounded-[2rem] p-6 text-slate-700 font-medium focus:outline-none focus:border-pink-300 transition-all resize-none shadow-inner"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-600 uppercase tracking-widest ml-2">Canvas Shape</label>
                  <div className="grid grid-cols-2 gap-3">
                    {ASPECT_RATIOS.map(ratio => (
                      <button
                        key={ratio.value}
                        onClick={() => setGenParams({...genParams, aspectRatio: ratio.value as any})}
                        className={`py-3 px-4 rounded-2xl text-xs font-bold border-2 transition-all ${genParams.aspectRatio === ratio.value ? 'bg-blue-500 border-blue-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200'}`}
                      >
                        {ratio.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-600 uppercase tracking-widest ml-2">Art Style</label>
                  <div className="grid grid-cols-2 gap-3">
                    {STYLES.map(style => (
                      <button
                        key={style}
                        onClick={() => setGenParams({...genParams, style})}
                        className={`py-3 px-4 rounded-2xl text-xs font-bold border-2 transition-all ${genParams.style === style ? 'bg-pink-500 border-pink-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-400 hover:border-pink-200'}`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleGenerate} 
                className="w-full" 
                variant="magic"
                size="lg" 
                isLoading={isGenerating}
                leftIcon={<ICONS.Sparkles className="w-6 h-6" />}
              >
                Poof! Create My Art
              </Button>
            </div>
          </section>
        )}

        {view === 'my-walls' && (
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl text-green-600">My Secret Library</h2>
              <Button onClick={() => setView('generate')} size="sm" variant="secondary" leftIcon={<ICONS.Plus className="w-4 h-4" />}>
                New Drawing
              </Button>
            </div>
            
            {wallpapers.filter(w => w.author === 'Me (Artist)').length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-6 text-center">
                <div className="w-24 h-24 bg-white rounded-[2rem] border-4 border-dashed border-slate-200 flex items-center justify-center">
                  <ICONS.History className="w-12 h-12 text-slate-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-400">Your art desk is empty!</h3>
                  <p className="text-slate-400 font-medium">Click create to start making masterpieces.</p>
                </div>
                <Button onClick={() => setView('generate')} variant="magic">Let's Go!</Button>
              </div>
            ) : (
              <div className="masonry">
                {wallpapers.filter(w => w.author === 'Me (Artist)').map(wall => (
                  <WallpaperCard 
                    key={wall.id} 
                    wallpaper={wall} 
                    onDownload={downloadImage}
                    onOpen={(w) => { setSelectedWallpaper(w); setMockupMode('none'); }}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Modal / Image Detail */}
      {selectedWallpaper && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-md" onClick={() => setSelectedWallpaper(null)} />
          
          <div className="relative glass w-full max-w-6xl max-h-[90vh] rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in fade-in zoom-in duration-300 border-8 border-white">
            {/* Image Preview / Mockup Area */}
            <div className="flex-1 bg-blue-50/50 flex items-center justify-center p-8 min-h-[400px] overflow-hidden relative">
              {mockupMode === 'none' ? (
                <img 
                  src={selectedWallpaper.url} 
                  alt={selectedWallpaper.prompt}
                  className="max-w-full max-h-full object-contain rounded-[2rem] shadow-xl border-4 border-white transition-all duration-500"
                />
              ) : mockupMode === 'phone' ? (
                <div className="relative w-[280px] h-[580px] bg-slate-100 rounded-[3.5rem] border-[10px] border-white shadow-2xl overflow-hidden flex flex-col transition-all duration-500 animate-in slide-in-from-bottom-8">
                   {/* Digital Stickers on Device */}
                   <div className="absolute top-10 right-4 w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center z-20 rotate-12 border-2 border-white shadow-sm opacity-90">
                      <span className="text-white text-xl">☺</span>
                   </div>
                   {/* Dynamic Island */}
                   <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-800 rounded-full z-10" />
                   <img 
                    src={selectedWallpaper.url} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/60 rounded-full z-10" />
                </div>
              ) : (
                <div className="w-full max-w-4xl transition-all duration-500 animate-in slide-in-from-bottom-4">
                   <div className="relative aspect-video bg-slate-100 rounded-[2.5rem] border-[14px] border-white shadow-2xl overflow-hidden">
                      {/* Desktop Sticker */}
                      <div className="absolute bottom-4 left-4 w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center z-20 -rotate-6 border-2 border-white shadow-sm opacity-80">
                         <ICONS.Star className="w-6 h-6 text-white" />
                      </div>
                      <img 
                        src={selectedWallpaper.url} 
                        className="w-full h-full object-cover" 
                      />
                   </div>
                   <div className="w-48 h-5 bg-white mx-auto rounded-b-[2rem] shadow-md" />
                   <div className="w-64 h-2 bg-slate-200 mx-auto rounded-b-[2rem] opacity-50" />
                </div>
              )}
            </div>

            {/* Sidebar / Info */}
            <div className="w-full md:w-96 p-8 overflow-y-auto space-y-8 border-l-4 border-blue-50 bg-white">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-3xl text-blue-600">Fun View!</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Preview My Masterpiece</p>
                </div>
                <button onClick={() => setSelectedWallpaper(null)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
                  <ICONS.Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>

              {/* Mockup Toggle Chips */}
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Try It Out</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setMockupMode('none')}
                    className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${mockupMode === 'none' ? 'bg-blue-500 border-blue-600 text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-white'}`}
                  >
                    <ICONS.Image className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Paper</span>
                  </button>
                  <button 
                    onClick={() => setMockupMode('phone')}
                    className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${mockupMode === 'phone' ? 'bg-pink-500 border-pink-600 text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-white'}`}
                  >
                    <ICONS.Smartphone className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Phone</span>
                  </button>
                  <button 
                    onClick={() => setMockupMode('desktop')}
                    className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${mockupMode === 'desktop' ? 'bg-green-500 border-green-600 text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-white'}`}
                  >
                    <ICONS.Monitor className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Computer</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-widest ml-1">The Story</span>
                  <p className="text-sm text-slate-600 leading-relaxed font-bold italic">"{selectedWallpaper.prompt}"</p>
                </div>
              </div>

              {/* Edit Tool */}
              <div className="space-y-4 border-t-2 border-blue-50 pt-8">
                <div className="flex items-center gap-2">
                  <ICONS.Sparkles className="w-4 h-4 text-pink-500" />
                  <span className="text-sm font-bold uppercase tracking-widest text-slate-700">Add Stickers</span>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Add more sparkle..."
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:border-pink-300"
                  />
                  <Button 
                    onClick={handleEdit} 
                    isLoading={isEditing}
                    size="sm"
                    variant="magic"
                    className="shrink-0"
                  >
                    Add!
                  </Button>
                </div>
              </div>

              <div className="space-y-3 border-t-2 border-blue-50 pt-8 mt-auto">
                <Button 
                  onClick={() => downloadImage(selectedWallpaper.url, selectedWallpaper.id)} 
                  className="w-full"
                  variant="primary"
                  leftIcon={<ICONS.Download className="w-5 h-5" />}
                >
                  Save Masterpiece
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action for Creating */}
      {view !== 'generate' && (
        <button 
          onClick={() => setView('generate')}
          className="fixed bottom-8 right-8 w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-95 transition-all z-40 border-4 border-white animate-bounce"
        >
          <ICONS.Plus className="w-10 h-10" />
        </button>
      )}
    </div>
  );
};

export default App;
