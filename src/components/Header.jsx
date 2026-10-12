import React from 'react';
import { Camera, Sparkles, Download, RefreshCw, Trash2, QrCode, Heart } from 'lucide-react';

export default function Header({
  onOpenBooth,
  onResetSamplePhotos,
  onClearPhotos,
  onOpenExport,
  onOpenQR,
  activeFilterName,
  activeTemplateName
}) {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2">
        
        {/* Brand Logo & Title (Ant Design + Cute Korean Stationery Vibe) */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-md shadow-pink-500/20 shrink-0">
            <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-stone-800 font-extrabold text-sm sm:text-base tracking-tight m-0 flex items-center gap-1">
                <span>haru.</span>
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
              </h1>
              <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 border border-pink-200/60 whitespace-nowrap">
                35 Desain
              </span>
            </div>
            <p className="text-stone-400 text-[10px] sm:text-[11px] hidden sm:block">
              korean photo studio & aesthetic kiosk
            </p>
          </div>
        </div>

        {/* Current Info Badges (Desktop only) */}
        <div className="hidden xl:flex items-center gap-2">
          {activeTemplateName && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100/80 border border-stone-200/70 text-xs text-stone-600">
              <span className="text-stone-400 text-[10px]">Template:</span>
              <span className="font-semibold text-stone-800 truncate max-w-[130px]">{activeTemplateName}</span>
            </div>
          )}
          {activeFilterName && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/60 text-xs text-rose-700">
              <Sparkles className="w-3 h-3 text-rose-400" />
              <span className="font-semibold text-[11px]">{activeFilterName}</span>
            </div>
          )}
        </div>

        {/* Action Buttons (Clean Ant Design Style - Perfectly Scaled for Mobile) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Scan QR for Mobile (Only needed when viewing on PC) */}
          <button
            onClick={onOpenQR}
            className="hidden md:flex px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 border border-stone-200 hover:border-stone-300 transition text-xs font-medium items-center gap-1.5 shadow-xs"
            title="Scan QR Code untuk buka langsung di kamera HP"
          >
            <QrCode className="w-3.5 h-3.5 text-stone-500" />
            <span>Buka di HP</span>
          </button>

          {/* Kosongkan foto */}
          {onClearPhotos && (
            <button
              onClick={onClearPhotos}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-white hover:bg-rose-50 text-stone-500 hover:text-rose-600 border border-stone-200 hover:border-rose-200 transition text-xs font-medium flex items-center gap-1 shadow-xs"
              title="Bersihkan Semua Foto (Mulai dari Lembar Kosong)"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Kosongkan</span>
            </button>
          )}

          {/* Reset sample photos */}
          <button
            onClick={onResetSamplePhotos}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-900 border border-stone-200 hover:border-stone-300 transition text-xs font-medium flex items-center gap-1 shadow-xs"
            title="Muat Foto Sample Estetik"
          >
            <RefreshCw className="w-3 h-3 text-stone-400" />
            <span className="hidden md:inline">Sample</span>
          </button>

          {/* Open Camera Booth */}
          <button
            onClick={onOpenBooth}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-bold text-xs flex items-center gap-1 sm:gap-1.5 shadow-sm shadow-rose-500/20 transition whitespace-nowrap"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Foto</span>
          </button>

          {/* Download Strip */}
          <button
            onClick={onOpenExport}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-black active:scale-95 text-white font-bold text-xs flex items-center gap-1 sm:gap-1.5 shadow-sm transition whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Simpan</span>
          </button>
        </div>

      </div>
    </header>
  );
}
