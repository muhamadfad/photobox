import React, { useState } from 'react';
import { STICKER_CATEGORIES, STICKERS_LIST } from '../data/stickersData';
import { Smile, Trash2, Plus, Sparkles, Film, Heart, Tag, Bookmark, Type } from 'lucide-react';

export default function StickerCanvas({
  stickers,
  onAddSticker,
  onClearStickers
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [customText, setCustomText] = useState('');
  const [customColor, setCustomColor] = useState('#ff4d6d');

  const renderStickerCatIcon = (iconName) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-3.5 h-3.5 shrink-0" />;
      case 'Film': return <Film className="w-3.5 h-3.5 shrink-0" />;
      case 'Heart': return <Heart className="w-3.5 h-3.5 shrink-0" />;
      case 'Tag': return <Tag className="w-3.5 h-3.5 shrink-0" />;
      case 'Bookmark': return <Bookmark className="w-3.5 h-3.5 shrink-0" />;
      case 'Type': return <Type className="w-3.5 h-3.5 shrink-0" />;
      case 'Smile':
      default:
        return <Smile className="w-3.5 h-3.5 shrink-0" />;
    }
  };

  const filteredStickers = activeCategory === 'all'
    ? STICKERS_LIST
    : STICKERS_LIST.filter((s) => s.category === activeCategory);

  const handleAddCustomBadge = () => {
    if (!customText.trim()) return;
    onAddSticker({
      instanceId: `stk_${Date.now()}_${Math.random()}`,
      isBadge: true,
      text: customText.trim().toUpperCase(),
      bg: customColor,
      color: '#ffffff',
      x: 50 + (Math.random() * 20 - 10),
      y: 50 + (Math.random() * 20 - 10),
      rotation: Math.round(Math.random() * 20 - 10),
      scale: 1
    });
    setCustomText('');
  };

  const handleStickerClick = (templateSticker) => {
    onAddSticker({
      instanceId: `stk_${Date.now()}_${Math.random()}`,
      ...templateSticker,
      x: 50 + (Math.random() * 30 - 15),
      y: 40 + (Math.random() * 40 - 20),
      rotation: Math.round(Math.random() * 20 - 10),
      scale: 1
    });
  };

  return (
    <div className="bg-white border border-stone-200/80 rounded-3xl p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-stone-800 font-extrabold text-sm tracking-tight flex items-center gap-1.5">
            <Smile className="w-4 h-4 text-rose-500" />
            <span>Studio Dekorasi & Stiker</span>
          </h3>
          <p className="text-stone-400 text-xs mt-0.5">
            Klik stiker untuk menempelkannya ke foto (klik stiker di foto untuk menghapusnya)
          </p>
        </div>

        {stickers.length > 0 && (
          <button
            onClick={onClearStickers}
            className="px-2.5 py-1 text-xs rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-500 hover:text-rose-600 border border-stone-200 hover:border-rose-200 transition flex items-center gap-1 self-start sm:self-auto"
            title="Hapus semua stiker yang sudah ditempel"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Semua ({stickers.length})</span>
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3">
        {STICKER_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeCategory === cat.id
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200/60'
            }`}
          >
            {renderStickerCatIcon(cat.icon)}
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Stickers Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-7 gap-2 max-h-56 overflow-y-auto p-1.5 bg-stone-50/60 rounded-2xl border border-stone-200/60">
        {filteredStickers.map((stk) => (
          <button
            key={stk.id}
            onClick={() => handleStickerClick(stk)}
            className="p-2 rounded-2xl bg-white hover:bg-stone-50 hover:scale-105 active:scale-95 transition flex flex-col items-center justify-center border border-stone-200/70 shadow-xs group"
            title={`Tempel ${stk.name}`}
          >
            {stk.isBadge ? (
              <span
                className="px-1.5 py-0.5 rounded text-[8px] font-black truncate max-w-[65px] text-white"
                style={{ backgroundColor: stk.bg }}
              >
                {stk.text}
              </span>
            ) : stk.isTape ? (
              <span
                className="px-1 text-[7px] font-mono truncate max-w-[65px] border-x border-white text-stone-900"
                style={{ backgroundColor: stk.bg }}
              >
                TAPE
              </span>
            ) : (
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {stk.emoji}
              </span>
            )}
            <span className="text-[9px] text-stone-400 truncate max-w-full mt-1">
              {stk.name}
            </span>
          </button>
        ))}
      </div>

      {/* Custom Text Badge Creator */}
      <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2">
        <span className="text-xs text-stone-500 font-medium">Buat Stiker Teks:</span>
        <input
          type="text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Contoh: BEST DAY ♡"
          className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1 text-xs text-stone-800 flex-1 min-w-[130px] focus:outline-none focus:border-rose-400 focus:bg-white transition"
          onKeyDown={(e) => e.key === 'Enter' && handleAddCustomBadge()}
        />
        <input
          type="color"
          value={customColor}
          onChange={(e) => setCustomColor(e.target.value)}
          className="w-6 h-6 rounded-lg cursor-pointer bg-transparent border-0"
          title="Pilih Warna Badge"
        />
        <button
          onClick={handleAddCustomBadge}
          disabled={!customText.trim()}
          className="px-3 py-1 bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tempel</span>
        </button>
      </div>
    </div>
  );
}
