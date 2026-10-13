import React, { useState } from 'react';
import { PRESET_FILTERS } from '../utils/filterEngine';
import {
  Sparkles,
  Sliders,
  Sun,
  Contrast,
  Palette,
  Flame,
  Eye,
  Calendar,
  RotateCcw,
  Info,
  Check,
  Wand2,
  Newspaper,
  Cpu
} from 'lucide-react';

export default function FilterControls({
  filterSettings,
  onChangeSettings,
  onReset
}) {
  const [activeTab, setActiveTab] = useState('presets');
  const [showTip, setShowTip] = useState(false);

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
    <div className="bg-white border border-stone-200/80 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-stone-800 font-extrabold text-sm tracking-tight flex items-center gap-1.5">
              <Wand2 className="w-4 h-4 text-rose-500" />
              <span>Intelligent Color & Studio ISP</span>
            </h3>
          </div>
          <p className="text-stone-400 text-xs mt-0.5">
            Koreksi warna kamera otomatis, penghalus kulit potret & simulasi lensa film analog
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            onClick={() => setShowTip(!showTip)}
            className="p-1.5 rounded-xl bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200/60 transition text-xs flex items-center gap-1"
            title="Info Teknologi Kamera"
          >
            <Info className="w-3.5 h-3.5 text-stone-500" />
          </button>

          <button
            onClick={onReset}
            className="p-1.5 rounded-xl bg-stone-100 text-stone-600 hover:text-rose-600 border border-stone-200/60 transition text-xs flex items-center gap-1"
            title="Reset ke setelan awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200/60">
            <button
              onClick={() => setActiveTab('presets')}
              className={`px-3 py-1 text-xs rounded-lg font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'presets'
                  ? 'bg-white text-stone-800 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Sparkles className="w-3 h-3 text-rose-500" />
              <span>Filter Studio</span>
            </button>
            <button
              onClick={() => setActiveTab('sliders')}
              className={`px-3 py-1 text-xs rounded-lg font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'sliders'
                  ? 'bg-white text-stone-800 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Sliders className="w-3 h-3 text-stone-500" />
              <span>Manual</span>
            </button>
          </div>
        </div>
      </div>

      {/* Intelligent ISP Hardware Controls Banner */}
      <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-stone-800">Smart Camera Engine</div>
            <div className="text-[10px] text-stone-400">Aktif saat memotret di kamera & upload galeri</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => handleSliderChange('aiAutoTone', filterSettings.aiAutoTone === false ? true : false)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition flex items-center gap-1 ${
              filterSettings.aiAutoTone !== false
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-500 border-stone-200'
            }`}
          >
            <Check className="w-3 h-3" />
            <span>Auto-HDR Tone</span>
          </button>

          <button
            onClick={() => handleSliderChange('aiSkinSmooth', filterSettings.aiSkinSmooth === false ? true : false)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition flex items-center gap-1 ${
              filterSettings.aiSkinSmooth !== false
                ? 'bg-rose-500 text-white border-rose-500'
                : 'bg-white text-stone-500 border-stone-200'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Beauty Skin</span>
          </button>

          <button
            onClick={() => handleSliderChange('aiStudioLight', filterSettings.aiStudioLight === false ? true : false)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition flex items-center gap-1 ${
              filterSettings.aiStudioLight !== false
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-white text-stone-500 border-stone-200'
            }`}
          >
            <Sun className="w-3 h-3" />
            <span>3D Key Light</span>
          </button>
        </div>
      </div>

      {/* Aesthetic Explanation Banner */}
      {showTip && (
        <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/60 text-xs text-rose-900 space-y-1">
          <p className="font-bold flex items-center gap-1.5 text-rose-800">
            <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>Cara Kerja Intelligent Studio Camera:</span>
          </p>
          <ul className="list-disc list-inside text-rose-700 space-y-0.5 text-[11px] pl-1">
            <li><strong>Auto-HDR Tone:</strong> Mengangkat bayangan wajah yang gelap tanpa membuat dahi over-exposed.</li>
            <li><strong>Beauty Skin:</strong> Melembutkan tekstur pori dan noise kamera HP namun menjaga mata tetap tajam.</li>
            <li><strong>3D Key Light:</strong> Memberi pencahayaan fokus di tengah wajah layaknya lampu softbox studio Korea.</li>
          </ul>
        </div>
      )}

      {/* Tab 1: Presets Cards */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
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
                className={`text-left p-3 rounded-2xl border transition duration-200 relative group overflow-hidden ${
                  isMatch
                    ? 'border-rose-400 bg-rose-50/50 ring-2 ring-rose-400/20 shadow-xs'
                    : 'border-stone-200/80 bg-stone-50/40 hover:bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: preset.swatch || '#fb7185' }}
                    />
                    <span className="font-bold text-xs text-stone-800 group-hover:text-rose-600 transition truncate">
                      {preset.name}
                    </span>
                  </div>
                  {isMatch ? (
                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  ) : (
                    preset.badge && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-stone-200/70 text-stone-600 shrink-0">
                        {preset.badge}
                      </span>
                    )
                  )}
                </div>
                <p className="text-[10px] text-stone-400 line-clamp-2 leading-tight">
                  {preset.tagline}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* Tab 2: Manual Tuning Sliders */}
      {activeTab === 'sliders' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
            
            {/* Soft Glow */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-stone-700 flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  <span>Soft Glow / Mulus</span>
                </span>
                <span className="text-rose-600 font-mono font-bold">{filterSettings.softGlow || 0}%</span>
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

            {/* Film Grain */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-stone-700 flex items-center gap-1.5 font-medium">
                  <Eye className="w-3.5 h-3.5 text-amber-500" />
                  <span>Film Grain 35mm</span>
                </span>
                <span className="text-amber-600 font-mono font-bold">{filterSettings.filmGrain || 0}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={filterSettings.filmGrain || 0}
                onChange={(e) => handleSliderChange('filmGrain', Number(e.target.value))}
                className="w-full accent-amber-500 bg-stone-200 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Warmth */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-stone-700 flex items-center gap-1.5 font-medium">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  <span>Suhu Warna</span>
                </span>
                <span className="text-orange-600 font-mono font-bold">{filterSettings.warmth || 0}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={filterSettings.warmth || 0}
                onChange={(e) => handleSliderChange('warmth', Number(e.target.value))}
                className="w-full accent-orange-500 bg-stone-200 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Brightness */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-stone-700 flex items-center gap-1.5 font-medium">
                  <Sun className="w-3.5 h-3.5 text-yellow-500" />
                  <span>Kecerahan</span>
                </span>
                <span className="text-yellow-600 font-mono font-bold">{filterSettings.brightness || 0}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={filterSettings.brightness || 0}
                onChange={(e) => handleSliderChange('brightness', Number(e.target.value))}
                className="w-full accent-yellow-500 bg-stone-200 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Contrast */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-stone-700 flex items-center gap-1.5 font-medium">
                  <Contrast className="w-3.5 h-3.5 text-blue-500" />
                  <span>Kontras</span>
                </span>
                <span className="text-blue-600 font-mono font-bold">{filterSettings.contrast || 0}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={filterSettings.contrast || 0}
                onChange={(e) => handleSliderChange('contrast', Number(e.target.value))}
                className="w-full accent-blue-500 bg-stone-200 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Saturation */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-stone-700 flex items-center gap-1.5 font-medium">
                  <Palette className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Saturasi</span>
                </span>
                <span className="text-emerald-600 font-mono font-bold">{filterSettings.saturation || 0}</span>
              </div>
              <input
                type="range"
                min="-100"
                max="50"
                value={filterSettings.saturation || 0}
                onChange={(e) => handleSliderChange('saturation', Number(e.target.value))}
                className="w-full accent-emerald-500 bg-stone-200 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

          </div>

          {/* Toggles & Extras */}
          <div className="pt-3 border-t border-stone-200/80 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-stone-300">
              <input
                type="checkbox"
                checked={!!filterSettings.halftone}
                onChange={(e) => handleSliderChange('halftone', e.target.checked)}
                className="rounded accent-rose-500"
              />
              <span className="text-xs text-stone-700 font-medium flex items-center gap-1.5">
                <Newspaper className="w-3.5 h-3.5 text-stone-600" />
                <span>Halftone Koran Vintage</span>
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-stone-300">
              <input
                type="checkbox"
                checked={!!filterSettings.dateStamp}
                onChange={(e) => handleSliderChange('dateStamp', e.target.checked)}
                className="rounded accent-rose-500"
              />
              <span className="text-xs text-stone-700 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-orange-500" />
                <span>Date Stamp 90s</span>
              </span>
            </label>

            {filterSettings.dateStamp && (
              <div className="flex items-center gap-1.5 bg-stone-100 px-2.5 py-1 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 font-mono">Teks:</span>
                <input
                  type="text"
                  value={filterSettings.customDate || "'26 10 13"}
                  onChange={(e) => handleSliderChange('customDate', e.target.value)}
                  className="bg-transparent text-xs text-orange-600 font-digital w-20 focus:outline-none"
                  placeholder="'26 10 13"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
