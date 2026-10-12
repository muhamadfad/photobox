import React, { useState } from 'react';
import { TEMPLATE_CATEGORIES, TEMPLATES_LIST } from '../data/templatesData';
import { Sparkles, Columns2, Search, Palette, Check, Flame, Bookmark, Heart, Ticket, Newspaper, Mail } from 'lucide-react';
import TemplateThumbnail from './TemplateThumbnail';

export default function TemplateSelector({
  activeTemplateId,
  onSelectTemplate,
  isTwin,
  onToggleTwin,
  slotCount = 4,
  onToggleSlotCount,
  frameColor,
  onChangeFrameColor
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const renderCatIcon = (iconName) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-3.5 h-3.5 shrink-0" />;
      case 'Flame':
        return <Flame className="w-3.5 h-3.5 shrink-0" />;
      case 'Bookmark':
        return <Bookmark className="w-3.5 h-3.5 shrink-0" />;
      case 'Heart':
        return <Heart className="w-3.5 h-3.5 shrink-0" />;
      case 'Ticket':
        return <Ticket className="w-3.5 h-3.5 shrink-0" />;
      case 'Newspaper':
        return <Newspaper className="w-3.5 h-3.5 shrink-0" />;
      case 'Mail':
        return <Mail className="w-3.5 h-3.5 shrink-0" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 shrink-0" />;
    }
  };

  // Filter templates by category and search
  const filteredTemplates = TEMPLATES_LIST.filter((tmpl) => {
    const matchesCat = selectedCategory === 'all' || tmpl.category === selectedCategory;
    const matchesSearch =
      tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const COLOR_PALETTES = [
    { name: 'Default Template', color: '' },
    { name: 'Onyx Black', color: '#18181b' },
    { name: 'Pure White', color: '#ffffff' },
    { name: 'Theater Maroon', color: '#54121d' },
    { name: 'Navy Seoul', color: '#1e1b4b' },
    { name: 'Pastel Pink', color: '#fbcfe8' },
    { name: 'Haru Sky Blue', color: '#bae6fd' },
    { name: 'Vintage Cream', color: '#f5f0e1' },
    { name: 'Sage Olive', color: '#14532d' }
  ];

  return (
    <div className="bg-white border border-stone-200/80 rounded-3xl p-4 sm:p-5 shadow-xs">
      
      {/* Top Header & Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-stone-800 font-extrabold text-sm tracking-tight flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-rose-500" />
              <span>Pilih Template Photobooth</span>
            </h3>
            <span className="text-[10px] bg-rose-50 text-rose-600 font-bold px-2 py-0.5 rounded-full border border-rose-200/60">
              35 Desain
            </span>
          </div>
          <p className="text-stone-400 text-xs mt-0.5">
            Pilih dari 35 template: Viral 1989 Denim, XXL Lyrics, Panorama Ticket, 90s Pop, & Korean 4-Cut
          </p>
        </div>

        {/* Global Format Toggles (Ant Design Segmented Control) */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* 3 vs 4 Slots Toggle */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200/60">
            <button
              onClick={() => onToggleSlotCount(3)}
              className={`px-2.5 py-1 text-xs rounded-lg font-bold transition ${
                slotCount === 3
                  ? 'bg-white text-stone-800 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              3 Foto
            </button>
            <button
              onClick={() => onToggleSlotCount(4)}
              className={`px-2.5 py-1 text-xs rounded-lg font-bold transition ${
                slotCount === 4
                  ? 'bg-white text-stone-800 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              4 Foto
            </button>
          </div>

          {/* Twin Strip Toggle */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200/60">
            <button
              onClick={() => onToggleTwin(false)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                !isTwin
                  ? 'bg-white text-stone-800 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Single
            </button>
            <button
              onClick={() => onToggleTwin(true)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition flex items-center gap-1 ${
                isTwin
                  ? 'bg-rose-500 text-white shadow-xs font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Cetak kembar 2 strip berdampingan"
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>Twin (2x)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Frame Background Color Customizer */}
      <div className="mb-4 p-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-stone-600 font-medium flex items-center gap-1.5 text-[11px]">
          <Palette className="w-3.5 h-3.5 text-rose-500" />
          <span>Warna Frame:</span>
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {COLOR_PALETTES.map((pal, idx) => (
            <button
              key={idx}
              onClick={() => onChangeFrameColor(pal.color)}
              className={`w-5 h-5 rounded-full border transition-transform hover:scale-110 relative ${
                frameColor === pal.color
                  ? 'ring-2 ring-rose-500 ring-offset-2 ring-offset-white border-white scale-110'
                  : 'border-stone-300'
              }`}
              style={{
                backgroundColor: pal.color || '#e7e5e4',
                backgroundImage: !pal.color ? 'linear-gradient(135deg, #d6d3d1 50%, #a8a29e 50%)' : 'none'
              }}
              title={pal.name}
            />
          ))}
          <input
            type="color"
            value={frameColor || '#54121d'}
            onChange={(e) => onChangeFrameColor(e.target.value)}
            className="w-5 h-5 rounded-full cursor-pointer bg-transparent border-0 ml-1"
            title="Pilih Warna Kustom"
          />
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <div className="flex gap-1.5 overflow-x-auto pb-1 flex-1">
          {TEMPLATE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200/60'
              }`}
            >
              {renderCatIcon(cat.icon)}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[130px] sm:w-44">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari template..."
            className="w-full bg-stone-50 border border-stone-200/80 rounded-xl pl-8 pr-2.5 py-1 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-rose-400 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Clean Grid of 30 Templates with Visual Pictures */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[460px] overflow-y-auto p-1.5 bg-stone-50/50 rounded-2xl border border-stone-200/60">
        {filteredTemplates.map((tmpl) => {
          const isActive = activeTemplateId === tmpl.id;
          return (
            <button
              key={tmpl.id}
              onClick={() => {
                onSelectTemplate(tmpl.id);
                if (tmpl.slots && onToggleSlotCount) {
                  onToggleSlotCount(tmpl.slots);
                }
              }}
              className={`text-left p-2.5 rounded-2xl border transition-all duration-200 relative group flex flex-col justify-between overflow-hidden cursor-pointer ${
                isActive
                  ? 'border-rose-400 bg-rose-50/50 ring-2 ring-rose-400/20 shadow-md'
                  : 'border-stone-200/80 bg-white hover:border-rose-200 hover:shadow-xs'
              }`}
            >
              {/* Header Badges */}
              <div className="flex items-center justify-between mb-1.5 w-full gap-1">
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-bold truncate max-w-[85px] sm:max-w-none">
                  {tmpl.tag}
                </span>
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                  isActive ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-600'
                }`}>
                  {tmpl.badge}
                </span>
              </div>

              {/* REAL VISUAL PICTURE MOCKUP OF THE PHOTOSTRIP */}
              <div className="w-full bg-stone-100/70 rounded-xl p-2 my-1 flex items-center justify-center border border-stone-200/60 group-hover:border-rose-200 transition">
                <div className="w-[72px] group-hover:scale-105 transition-transform duration-200 drop-shadow-sm">
                  <TemplateThumbnail templateId={tmpl.id} />
                </div>
              </div>

              {/* Title & Description */}
              <div className="mt-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-stone-800 group-hover:text-rose-600 transition truncate">
                    {tmpl.name}
                  </h4>
                  {isActive && (
                    <span className="w-3.5 h-3.5 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-stone-400 line-clamp-1 mt-0.5">
                  {tmpl.description}
                </p>
              </div>

              {/* Footer info */}
              <div className="mt-2 pt-1 border-t border-stone-100 flex items-center justify-between text-[9px] font-mono w-full">
                <span className="text-stone-400">{tmpl.aspect}</span>
                <span className={`font-bold ${isActive ? 'text-rose-600' : 'text-stone-400 group-hover:text-stone-700'}`}>
                  {isActive ? 'Terpilih' : 'Pilih'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
}
