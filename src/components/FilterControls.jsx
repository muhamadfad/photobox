import React from 'react';
import { PRESET_FILTERS } from '../utils/filterEngine';
import { Sparkles, Sun, Eye, Calendar, RotateCcw, Check } from 'lucide-react';

export default function FilterControls({
  filterSettings,
  onChangeSettings,
  onReset
}) {
  const handlePresetSelect = (presetKey) => {
    const preset = PRESET_FILTERS[presetKey];
    if (preset) {
      onChangeSettings({
        ...filterSettings,
        ...preset.settings,
        customDate: filterSettings.customDate || "'26 10 13"
      });
    }
  };

  const handleSliderChange = (key, value) => {
    onChangeSettings({
      ...filterSettings,
      [key]: value
    });
  };

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-xs space-y-4">
      
      {/* Top Row: Title + Reset */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-stone-800">Pilih Efek Warna</span>
        <button
          onClick={onReset}
          className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 text-[11px] font-medium flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1-Tap Clean Filter Grid */}
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(PRESET_FILTERS).map(([key, preset]) => {
          const isMatch =
            filterSettings.filmGrain === preset.settings.filmGrain &&
            filterSettings.softGlow === preset.settings.softGlow &&
            filterSettings.saturation === preset.settings.saturation &&
            filterSettings.brightness === preset.settings.brightness;

          return (
            <button
              key={key}
              onClick={() => handlePresetSelect(key)}
              className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between gap-1.5 cursor-pointer ${
                isMatch
                  ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/15'
                  : 'border-stone-200/80 bg-stone-50/50 hover:bg-white hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className="w-3 h-3 rounded-full shadow-xs"
                  style={{ backgroundColor: preset.swatch || '#fb7185' }}
                />
                {isMatch && (
                  <Check className="w-3.5 h-3.5 text-rose-500" />
                )}
              </div>
              <span className="font-bold text-[11px] text-stone-800 leading-tight truncate">
                {preset.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3 Simple Sliders */}
      <div className="pt-3 border-t border-stone-100 space-y-3">
        {/* Soft Glow / Skin Smooth */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-stone-600 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>Haluskan Kulit (Glow)</span>
            </span>
            <span className="text-stone-800 font-mono text-[11px] font-semibold">
              {filterSettings.softGlow || 0}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={filterSettings.softGlow || 0}
            onChange={(e) => handleSliderChange('softGlow', Number(e.target.value))}
            className="w-full accent-rose-500 bg-stone-200 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        {/* Brightness */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-stone-600 flex items-center gap-1.5 font-medium">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Kecerahan</span>
            </span>
            <span className="text-stone-800 font-mono text-[11px] font-semibold">
              {filterSettings.brightness || 0}
            </span>
          </div>
          <input
            type="range"
            min="-40"
            max="40"
            value={filterSettings.brightness || 0}
            onChange={(e) => handleSliderChange('brightness', Number(e.target.value))}
            className="w-full accent-stone-900 bg-stone-200 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        {/* Film Grain */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-stone-600 flex items-center gap-1.5 font-medium">
              <Eye className="w-3.5 h-3.5 text-stone-500" />
              <span>Tekstur Film Analog</span>
            </span>
            <span className="text-stone-800 font-mono text-[11px] font-semibold">
              {filterSettings.filmGrain || 0}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={filterSettings.filmGrain || 0}
            onChange={(e) => handleSliderChange('filmGrain', Number(e.target.value))}
            className="w-full accent-stone-900 bg-stone-200 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        {/* Simple Date Stamp Toggle */}
        <div className="pt-2 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!filterSettings.dateStamp}
              onChange={(e) => handleSliderChange('dateStamp', e.target.checked)}
              className="rounded accent-rose-500"
            />
            <span className="text-xs text-stone-700 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-orange-500" />
              <span>Cap Tanggal Kamera Retro</span>
            </span>
          </label>

          {filterSettings.dateStamp && (
            <input
              type="text"
              value={filterSettings.customDate || "'26 10 13"}
              onChange={(e) => handleSliderChange('customDate', e.target.value)}
              className="bg-stone-100 border border-stone-200 rounded-lg px-2 py-0.5 text-xs text-orange-600 font-digital w-20 text-center focus:outline-none"
            />
          )}
        </div>
      </div>

    </div>
  );
}
