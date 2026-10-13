import React, { useState, useRef } from 'react';
import Header from './components/Header';
import TemplateSelector from './components/TemplateSelector';
import FilterControls from './components/FilterControls';
import TemplateCustomizer from './components/TemplateCustomizer';
import StickerCanvas from './components/StickerCanvas';
import CameraBooth from './components/CameraBooth';
import ExportModal from './components/ExportModal';
import PhotoboothCanvas from './components/PhotoboothCanvas';

import { TEMPLATES_LIST } from './data/templatesData';
import { DEFAULT_FILTER_SETTINGS } from './utils/filterEngine';
import { SAMPLE_PHOTOS } from './utils/samplePhotos';
import {
  Sparkles,
  Layers,
  Smile,
  RefreshCw,
  Trash2,
  Maximize2,
  Minimize2
} from 'lucide-react';

export default function App() {
  const [activeTemplateId, setActiveTemplateId] = useState('theater');
  const [isTwin, setIsTwin] = useState(true);
  const [slotCount, setSlotCount] = useState(4);
  const [frameColor, setFrameColor] = useState('');
  const [photos, setPhotos] = useState(SAMPLE_PHOTOS.map((p) => p.url));
  const [filterSettings, setFilterSettings] = useState(DEFAULT_FILTER_SETTINGS);
  const [stickers, setStickers] = useState([]);
  const [mobileZoom, setMobileZoom] = useState(false);
  const [customData, setCustomData] = useState({});

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [targetSlot, setTargetSlot] = useState(0);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('template'); // 'template' | 'filters' | 'decor'

  const printAreaRef = useRef(null);

  const activeTemplate =
    TEMPLATES_LIST.find((t) => t.id === activeTemplateId) || TEMPLATES_LIST[0];

  const handlePhotoCaptured = (dataUrl, slotIndex) => {
    setPhotos((prev) => {
      const updated = [...prev];
      const index = typeof slotIndex === 'number' ? slotIndex : targetSlot;
      updated[index] = dataUrl;
      return updated;
    });
  };

  const handleFillAllSlots = (dataUrl) => {
    setPhotos(new Array(slotCount).fill(dataUrl));
  };

  const handleClearPhotos = () => {
    setPhotos(new Array(slotCount).fill(null));
  };

  const handleResetSamplePhotos = () => {
    setPhotos(SAMPLE_PHOTOS.slice(0, slotCount).map((p) => p.url));
  };

  const handlePhotoSlotClick = (slotIndex) => {
    setTargetSlot(slotIndex);
    setIsCameraOpen(true);
  };

  const handleAddSticker = (newSticker) => {
    setStickers((prev) => [...prev, newSticker]);
  };

  const handleRemoveSticker = (instanceId) => {
    setStickers((prev) => prev.filter((s) => s.instanceId !== instanceId));
  };

  const handleClearStickers = () => {
    setStickers([]);
  };

  return (
    <div className="min-h-screen bg-[#f7f6f2] text-stone-800 flex flex-col font-sans antialiased selection:bg-rose-100 selection:text-rose-600">
      
      {/* Minimal Header */}
      <Header
        onOpenBooth={() => {
          setTargetSlot(0);
          setIsCameraOpen(true);
        }}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Clean 2-Column Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6 pb-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Control Column (Simple 3-Step Tabs) */}
        <div className="lg:col-span-5 flex flex-col gap-3.5 order-2 lg:order-1">
          
          {/* 3 Clean Step Tabs */}
          <div className="grid grid-cols-3 bg-stone-200/70 p-1 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('template')}
              className={`py-2 px-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === 'template'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>Template</span>
            </button>

            <button
              onClick={() => setActiveTab('filters')}
              className={`py-2 px-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === 'filters'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Filter</span>
            </button>

            <button
              onClick={() => setActiveTab('decor')}
              className={`py-2 px-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === 'decor'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Smile className="w-3.5 h-3.5 text-pink-500 shrink-0" />
              <span>Hias & Teks</span>
            </button>
          </div>

          {/* Tab 1: Visual Template Picker */}
          {activeTab === 'template' && (
            <TemplateSelector
              activeTemplateId={activeTemplateId}
              onSelectTemplate={setActiveTemplateId}
              onToggleSlotCount={setSlotCount}
              frameColor={frameColor}
              onChangeFrameColor={setFrameColor}
            />
          )}

          {/* Tab 2: 1-Tap Filter Controls */}
          {activeTab === 'filters' && (
            <FilterControls
              filterSettings={filterSettings}
              onChangeSettings={setFilterSettings}
              onReset={() => setFilterSettings(DEFAULT_FILTER_SETTINGS)}
            />
          )}

          {/* Tab 3: Combined Stickers & Text */}
          {activeTab === 'decor' && (
            <div className="space-y-3.5">
              <StickerCanvas
                stickers={stickers}
                onAddSticker={handleAddSticker}
                onClearStickers={handleClearStickers}
              />
              <TemplateCustomizer
                activeTemplateId={activeTemplateId}
                customData={customData}
                onChangeCustomData={setCustomData}
              />
            </div>
          )}

        </div>

        {/* Right Preview Column */}
        <div className="lg:col-span-7 flex flex-col items-center order-1 lg:order-2 w-full">
          
          {/* Single Clean Strip Format Bar */}
          <div className="w-full flex items-center justify-between gap-2 pb-2.5 text-xs">
            <div className="flex items-center gap-1.5">
              {/* Single vs Twin */}
              <div className="flex items-center bg-stone-200/70 p-0.5 rounded-xl">
                <button
                  onClick={() => setIsTwin(false)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                    !isTwin ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                  }`}
                >
                  Single
                </button>
                <button
                  onClick={() => setIsTwin(true)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                    isTwin ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                  }`}
                >
                  Twin 2x
                </button>
              </div>

              {/* 3 vs 4 Photos */}
              <div className="flex items-center bg-stone-200/70 p-0.5 rounded-xl">
                <button
                  onClick={() => setSlotCount(3)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                    slotCount === 3 ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                  }`}
                >
                  3 Foto
                </button>
                <button
                  onClick={() => setSlotCount(4)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                    slotCount === 4 ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                  }`}
                >
                  4 Foto
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleResetSamplePhotos}
                className="px-2.5 py-1 rounded-xl bg-white hover:bg-stone-100 text-stone-600 border border-stone-200/80 text-[11px] font-medium flex items-center gap-1 transition"
                title="Muat Ulang Foto Contoh"
              >
                <RefreshCw className="w-3 h-3" />
                <span className="hidden sm:inline">Sample</span>
              </button>
              <button
                onClick={handleClearPhotos}
                className="p-1.5 rounded-xl bg-white hover:bg-rose-50 text-stone-500 hover:text-rose-600 border border-stone-200/80 transition"
                title="Kosongkan Frame"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Studio Preview Mat */}
          <div className="w-full flex flex-col justify-center items-center py-5 sm:py-7 px-2 sm:px-6 bg-[#efede7] studio-mat rounded-3xl border border-stone-200/80 shadow-inner overflow-hidden relative min-h-[450px] sm:min-h-[520px]">
            
            {/* Mobile Fit vs 100% Toggle */}
            <div className="sm:hidden absolute top-2.5 right-2.5 z-20">
              <button
                onClick={() => setMobileZoom(!mobileZoom)}
                className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-stone-200 text-[10px] font-semibold text-stone-600 flex items-center gap-1"
              >
                {mobileZoom ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                <span>{mobileZoom ? 'Fit' : 'Zoom'}</span>
              </button>
            </div>

            <div className={`w-full flex justify-center items-center ${mobileZoom ? 'overflow-x-auto py-2' : ''}`}>
              <div
                className="shrink-0 min-w-max transition-transform duration-200 origin-top flex justify-center items-center"
                style={{
                  transform:
                    !mobileZoom && typeof window !== 'undefined' && window.innerWidth < 640
                      ? isTwin
                        ? 'scale(0.62)'
                        : 'scale(0.92)'
                      : 'none',
                  margin:
                    !mobileZoom && typeof window !== 'undefined' && window.innerWidth < 640
                      ? isTwin
                        ? '-85px 0'
                        : '0'
                      : '0'
                }}
              >
                <div
                  ref={printAreaRef}
                  id="photobooth-print-area"
                  className="shrink-0 min-w-max p-3 sm:p-5 rounded-2xl bg-white/40 inline-flex justify-center items-center"
                >
                  <PhotoboothCanvas
                    template={activeTemplate}
                    photos={photos}
                    slotCount={slotCount}
                    isTwin={isTwin}
                    filterSettings={filterSettings}
                    customData={customData}
                    frameColor={frameColor}
                    stickers={stickers}
                    onPhotoClick={handlePhotoSlotClick}
                    onRemoveSticker={handleRemoveSticker}
                  />
                </div>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-stone-400">
              Klik pada foto di atas untuk mengganti tiap frame
            </p>
          </div>

        </div>

      </main>

      {/* Camera Modal */}
      <CameraBooth
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onPhotoCaptured={handlePhotoCaptured}
        onFillAllSlots={handleFillAllSlots}
        targetSlot={targetSlot}
        totalSlots={slotCount}
        filterSettings={filterSettings}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        targetRef={printAreaRef}
        templateName={activeTemplate.name}
        filterSettings={filterSettings}
      />

    </div>
  );
}
