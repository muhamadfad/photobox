import React, { useState } from 'react';
import { TEMPLATES_LIST } from '../data/templatesData';
import { Check } from 'lucide-react';
import TemplateThumbnail from './TemplateThumbnail';

const SIMPLE_CATEGORIES = [
  { id: 'all', name: 'Semua' },
  { id: 'viral_momenku', name: 'Viral Hits' },
  { id: 'pinterest_popular', name: 'Pinterest' },
  { id: 'korean_booth', name: 'Korean 4-Cut' },
  { id: 'ticket_travel', name: 'Tiket & Pass' },
  { id: 'newspaper_editorial', name: 'Koran & Majalah' },
  { id: 'postal_scrapbook', name: 'Polaroid & Struk' }
];

const COLOR_PALETTES = [
  { name: 'Default', color: '' },
  { name: 'Hitam', color: '#18181b' },
  { name: 'Putih', color: '#ffffff' },
  { name: 'Maroon', color: '#54121d' },
  { name: 'Navy', color: '#1e1b4b' },
  { name: 'Pink', color: '#fbcfe8' },
  { name: 'Biru Muda', color: '#bae6fd' },
  { name: 'Cream', color: '#f5f0e1' },
  { name: 'Sage', color: '#14532d' }
];

export default function TemplateSelector({
  activeTemplateId,
  onSelectTemplate,
  onToggleSlotCount,
  frameColor,
  onChangeFrameColor
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTemplates = TEMPLATES_LIST.filter((tmpl) => {
    if (selectedCategory === 'all') return true;
    return tmpl.category === selectedCategory;
  });

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-xs space-y-3.5">
      
      {/* Simple Category Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {SIMPLE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat.id
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Visual Template Grid - Clean Picture Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
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
              className={`group relative rounded-2xl p-2 border text-center transition-all flex flex-col items-center cursor-pointer ${
                isActive
                  ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-500/15'
                  : 'border-stone-200/80 bg-stone-50/40 hover:bg-white hover:border-stone-300'
              }`}
            >
              {isActive && (
                <span className="absolute top-2 right-2 z-10 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs">
                  <Check className="w-2.5 h-2.5" />
                </span>
              )}

              <div className="w-full flex justify-center py-1">
                <TemplateThumbnail templateId={tmpl.id} template={tmpl} />
              </div>

              <span
                className={`mt-1.5 text-[11px] font-semibold truncate w-full ${
                  isActive ? 'text-rose-600' : 'text-stone-700'
                }`}
              >
                {tmpl.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Simple Frame Color Row */}
      <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-stone-500">Warna Bingkai:</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {COLOR_PALETTES.map((pal, idx) => (
            <button
              key={idx}
              onClick={() => onChangeFrameColor(pal.color)}
              className={`w-5 h-5 rounded-full border transition-transform ${
                frameColor === pal.color
                  ? 'ring-2 ring-rose-500 ring-offset-1 border-white scale-110'
                  : 'border-stone-300 hover:scale-105'
              }`}
              style={{
                backgroundColor: pal.color || '#e7e5e4',
                backgroundImage: !pal.color
                  ? 'linear-gradient(135deg, #fafaf9 50%, #a8a29e 50%)'
                  : 'none'
              }}
              title={pal.name}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
