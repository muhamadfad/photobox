import React from 'react';
import { Camera, Download, Sparkles } from 'lucide-react';

export default function Header({
  onOpenBooth,
  onOpenExport
}) {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-stone-200/70 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Cute Minimal Brand Logo: pikubooth. */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs font-serif italic font-black text-base select-none">
            p.
          </div>
          <div className="flex items-baseline gap-2">
            <h1 className="text-stone-900 font-extrabold text-base tracking-tight m-0">
              piku<span className="text-rose-500">booth.</span>
            </h1>
            <span className="text-[11px] text-stone-400 font-medium hidden sm:inline">
              cute self-photo box
            </span>
          </div>
        </div>

        {/* Only 2 Clear Primary Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenBooth}
            className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Ambil Foto</span>
          </button>

          <button
            onClick={onOpenExport}
            className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-black active:scale-95 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>

      </div>
    </header>
  );
}
