"use client";
import React, { useState } from 'react';
import { ImagePlus, Loader2, Play } from 'lucide-react';

export default function GeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [gallery, setGallery] = useState<string[]>([]);

  const generateImage = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.image) {
        setGallery([`data:image/png;base64,${data.image}`, ...gallery]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter">ruDALL-E Malevich</h1>
          <p className="text-zinc-400">Endless artistic predictions via ai-forever/rudalle-Malevich</p>
        </header>

        <div className="flex gap-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="An astronaut riding a horse in space style of Malevich..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
            onKeyDown={(e) => e.key === 'Enter' && generateImage()}
          />
          <button
            onClick={generateImage}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Play size={20} />}
            Generate
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((img, idx) => (
            <div key={idx} className="group relative aspect-square bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
              <img src={img} alt="Generated" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                 <button onClick={() => window.open(img)} className="text-xs bg-white text-black px-2 py-1 rounded">Download</button>
              </div>
            </div>
          ))}
          {gallery.length === 0 && !loading && (
            <div className="col-span-full h-64 border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-600">
              <ImagePlus size={48} className="mb-2" />
              <p>Your creations will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}