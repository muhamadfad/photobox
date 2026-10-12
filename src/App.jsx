import React, { useState, useRef } from 'react';
import Header from './components/Header';
import TemplateSelector from './components/TemplateSelector';
import FilterControls from './components/FilterControls';
import TemplateCustomizer from './components/TemplateCustomizer';
import StickerCanvas from './components/StickerCanvas';
import CameraBooth from './components/CameraBooth';
import ExportModal from './components/ExportModal';
import QRCodeModal from './components/QRCodeModal';
import PhotoboothCanvas from './components/PhotoboothCanvas';

// Data & Utilities
import { TEMPLATES_LIST } from './data/templatesData';
import { DEFAULT_FILTER_SETTINGS, PRESET_FILTERS } from './utils/filterEngine';
import { SAMPLE_PHOTOS } from './utils/samplePhotos';
import { Camera, Sparkles, Sliders, Layers, Smile, Download, QrCode, RefreshCw, Maximize2, Minimize2, Columns2 } from 'lucide-react';

export default function App() {
  const [activeTemplateId, setActiveTemplateId] = useState('theater');
  const [isTwin, setIsTwin] = useState(true);
  const [slotCount, setSlotCount] = useState(4); // 3 or 4 slots
  const [frameColor, setFrameColor] = useState(''); // Custom frame background color
  const [photos, setPhotos] = useState(SAMPLE_PHOTOS.map((p) => p.url));
  const [filterSettings, setFilterSettings] = useState(DEFAULT_FILTER_SETTINGS);
  const [stickers, setStickers] = useState([]); // Placed stickers on photostrip
  const [mobileZoom, setMobileZoom] = useState(false);
  
  // Custom text storage per template
  const [customData, setCustomData] = useState({});

  // Modals & Panels
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [targetSlot, setTargetSlot] = useState(0);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [activeTab, setActiveTab] = useState('template'); // 'template' | 'filters' | 'stickers' | 'text'

  const printAreaRef = useRef(null);
  const singleSlotInputRef = useRef(null);

  // Active Template Object from 30 templates
  const activeTemplate = TEMPLATES_LIST.find((t) => t.id === activeTemplateId) || TEMPLATES_LIST[0];

  // Photo handlers
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

  // Sticker handlers
  const handleAddSticker = (newSticker) => {
    setStickers((prev) => [...prev, newSticker]);
  };

  const handleRemoveSticker = (instanceId) => {
    setStickers((prev) => prev.filter((s) => s.instanceId !== instanceId));
  };

  const handleClearStickers = () => {
    setStickers([]);
  };

  // Single upload handler
  const handleDirectSingleUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handlePhotoCaptured(event.target.result, targetSlot);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-stone-800 flex flex-col font-sans antialiased selection:bg-rose-100 selection:text-rose-600">
      
      {/* Hidden file input for fast single frame upload */}
      <input
        ref={singleSlotInputRef}
        type="file"
        accept="image/*"
        onChange={handleDirectSingleUpload}
        className="hidden"
      />

      {/* Clean Cute Ant Design Header */}
      <Header
        onOpenBooth={() => {
          setTargetSlot(0);
          setIsCameraOpen(true);
        }}
        onResetSamplePhotos={handleResetSamplePhotos}
        onClearPhotos={handleClearPhotos}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenQR={() => setIsQROpen(true)}
        activeFilterName={
          Object.values(PRESET_FILTERS).find(
            (p) =>
              p.settings.softGlow === filterSettings.softGlow &&
              p.settings.filmGrain === filterSettings.filmGrain
          )?.name
        }
        activeTemplateName={activeTemplate.name}
      />

      {/* Main Studio Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 pb-24 sm:pb-8 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        
        {/* Left Control Panel (Options & Editors) */}
        <div className="lg:col-span-5 flex flex-col gap-4 order-2 lg:order-1">
          
          {/* Ant Design Style Segmented Control Tab Switcher */}
          <div className="grid grid-cols-4 bg-stone-200/70 p-1 rounded-2xl border border-stone-300/40 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('template')}
              className={`py-2 px-1 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 ${
                activeTab === 'template'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="text-[10px] sm:text-[11px]">Template</span>
            </button>
            <button
              onClick={() => setActiveTab('filters')}
              className={`py-2 px-1 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 ${
                activeTab === 'filters'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="text-[10px] sm:text-[11px]">Efek HP</span>
            </button>
            <button
              onClick={() => setActiveTab('stickers')}
              className={`py-2 px-1 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 ${
                activeTab === 'stickers'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Smile className="w-3.5 h-3.5 text-pink-500 shrink-0" />
              <span className="text-[10px] sm:text-[11px]">Stiker</span>
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`py-2 px-1 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 ${
                activeTab === 'text'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="text-[10px] sm:text-[11px]">Teks</span>
            </button>
          </div>

          {/* Tab 1: Template Selection (35 Templates with Visual Thumbnails) */}
          {activeTab === 'template' && (
            <TemplateSelector
              activeTemplateId={activeTemplateId}
              onSelectTemplate={setActiveTemplateId}
              isTwin={isTwin}
              onToggleTwin={setIsTwin}
              slotCount={slotCount}
              onToggleSlotCount={setSlotCount}
              frameColor={frameColor}
              onChangeFrameColor={setFrameColor}
            />
          )}

          {/* Tab 2: Aesthetic Filters for Phone Camera */}
          {activeTab === 'filters' && (
            <FilterControls
              filterSettings={filterSettings}
              onChangeSettings={setFilterSettings}
              onReset={() => setFilterSettings(DEFAULT_FILTER_SETTINGS)}
            />
          )}

          {/* Tab 3: Stickers & Decoration Tray */}
          {activeTab === 'stickers' && (
            <StickerCanvas
              stickers={stickers}
              onAddSticker={handleAddSticker}
              onClearStickers={handleClearStickers}
            />
          )}

          {/* Tab 4: Text & Details Customizer */}
          {activeTab === 'text' && (
            <TemplateCustomizer
              activeTemplateId={activeTemplateId}
              customData={customData}
              onChangeCustomData={setCustomData}
            />
          )}

          {/* Cute Studio Kiosk Guide Note */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-3.5 sm:p-4 shadow-xs text-xs text-stone-600">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-rose-500 flex items-center gap-1.5 text-xs">
                <span className="p-1 rounded-lg bg-rose-50 text-rose-500">
                  <Camera className="w-3.5 h-3.5" />
                </span>
                <span>Panduan Booth Foto Lucu</span>
              </span>
              <button
                onClick={() => setIsQROpen(true)}
                className="hidden sm:flex text-[11px] font-semibold text-rose-500 hover:text-rose-600 items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 hover:bg-rose-100 transition"
              >
                <QrCode className="w-3 h-3" />
                <span>Buka di HP</span>
              </button>
            </div>
            <p className="leading-relaxed text-[11px] text-stone-500">
              Gunakan tombol <strong>1 Foto Isi Semua</strong> di kamera jika ingin 1 kali selfie langsung otomatis masuk ke seluruh frame. Tambahkan dekorasi di tab <strong>Stiker</strong> dan sesuaikan warna frame di tab <strong>Template</strong>!
            </p>
          </div>

        </div>

        {/* Right Preview Canvas (The Photobooth Strip Result) */}
        <div className="lg:col-span-7 flex flex-col items-center order-1 lg:order-2 w-full">
          
          {/* Top Live Preview Bar */}
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 text-xs text-stone-500">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="font-bold text-stone-800 truncate max-w-[150px] sm:max-w-[200px]">
                {activeTemplate.name}
              </span>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-stone-200 shadow-xs font-medium text-stone-600 whitespace-nowrap">
                {slotCount} Foto • {isTwin ? 'Twin (2x)' : 'Single'}
              </span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => {
                  setTargetSlot(0);
                  setIsCameraOpen(true);
                }}
                className="px-3 py-1.5 rounded-full bg-white hover:bg-stone-50 text-stone-700 border border-stone-200/90 shadow-xs transition flex items-center gap-1.5 text-xs font-semibold"
              >
                <Camera className="w-3.5 h-3.5 text-rose-500" />
                <span>Kamera</span>
              </button>

              <button
                onClick={() => setIsExportOpen(true)}
                className="px-3.5 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white transition flex items-center gap-1.5 text-xs font-bold shadow-xs hover:shadow-sm whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Simpan Strip</span>
              </button>
            </div>
          </div>

          {/* Scrollable Printable Photobooth Board (Studio Desk Mat) */}
          <div className="w-full flex flex-col justify-center items-center py-5 sm:py-8 px-2 sm:px-6 bg-[#f0eee9] studio-mat rounded-3xl border border-stone-200/90 shadow-inner overflow-hidden relative min-h-[460px] sm:min-h-[540px]">
            
            {/* Mobile View Toggle Pill (Fit Screen vs 100% Zoom) */}
            <div className="sm:hidden absolute top-2.5 right-2.5 z-20">
              <button
                onClick={() => setMobileZoom(!mobileZoom)}
                className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-stone-200 shadow-xs text-[10px] font-bold text-stone-600 flex items-center gap-1 transition"
              >
                {mobileZoom ? <Minimize2 className="w-3 h-3 text-stone-500" /> : <Maximize2 className="w-3 h-3 text-stone-500" />}
                <span>{mobileZoom ? 'Fit Layar' : '100% Zoom'}</span>
              </button>
            </div>

            {/* Responsive Scaler Wrapper for Mobile Viewport */}
            <div className={`w-full flex justify-center items-center transition-all duration-300 ${
              mobileZoom ? 'overflow-x-auto py-2' : ''
            }`}>
              <div
                className="transition-transform duration-200 origin-top flex justify-center items-center"
                style={{
                  transform: !mobileZoom && typeof window !== 'undefined' && window.innerWidth < 640
                    ? (isTwin ? 'scale(0.66)' : 'scale(0.95)')
                    : 'none',
                  margin: !mobileZoom && typeof window !== 'undefined' && window.innerWidth < 640
                    ? (isTwin ? '-65px 0' : '0')
                    : '0'
                }}
              >
                {/* The Actual DOM Element Captured for High-Res PNG Export */}
                <div
                  ref={printAreaRef}
                  id="photobooth-print-area"
                  className="p-3 sm:p-5 rounded-2xl bg-white/40 inline-flex justify-center items-center transition-all duration-300"
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

          </div>

          {/* Quick slot thumb indicators below canvas */}
          <div className="w-full flex items-center justify-center gap-2 sm:gap-2.5 mt-3.5 sm:mt-4 flex-wrap">
            <span className="text-[11px] text-stone-500 mr-1 font-medium whitespace-nowrap">Ganti frame:</span>
            {photos.slice(0, slotCount).map((imgUrl, i) => (
              <button
                key={i}
                onClick={() => handlePhotoSlotClick(i)}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden border-2 border-stone-200 hover:border-rose-400 transition relative group shadow-xs bg-white shrink-0"
                title={`Ganti Foto ${i + 1}`}
              >
                {imgUrl ? (
                  <img src={imgUrl} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400 font-mono">
                    Kosong
                  </div>
                )}
                <span className="absolute inset-0 bg-stone-900/30 group-hover:bg-rose-500/40 flex items-center justify-center text-[10px] font-bold text-white transition">
                  {i + 1}
                </span>
              </button>
            ))}
          </div>

        </div>

      </main>

      {/* Mobile Sticky Floating Bottom Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-2xl safe-area-bottom">
        <button
          onClick={() => setIsTwin(!isTwin)}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 border transition ${
            isTwin
              ? 'bg-rose-50 text-rose-600 border-rose-200'
              : 'bg-stone-100 text-stone-600 border-stone-200'
          }`}
          title="Ganti Mode Strip"
        >
          <Columns2 className="w-3.5 h-3.5" />
          <span>{isTwin ? 'Twin (2x)' : 'Single'}</span>
        </button>

        <button
          onClick={() => {
            setTargetSlot(0);
            setIsCameraOpen(true);
          }}
          className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-rose-500/20 transition"
        >
          <Camera className="w-4 h-4" />
          <span>Mulai Foto</span>
        </button>

        <button
          onClick={() => setIsExportOpen(true)}
          className="px-3.5 py-2.5 rounded-xl bg-stone-900 hover:bg-black active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Simpan</span>
        </button>
      </div>

      {/* Interactive Camera Booth Modal */}
      <CameraBooth
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onPhotoCaptured={handlePhotoCaptured}
        onFillAllSlots={handleFillAllSlots}
        targetSlot={targetSlot}
        totalSlots={slotCount}
        onToggleSlotCount={setSlotCount}
        filterSettings={filterSettings}
      />

      {/* High-Res Export & Print Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        targetRef={printAreaRef}
        templateName={activeTemplate.name}
      />

      {/* QR Code Modal for Instant Smartphone Access */}
      <QRCodeModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
      />

    </div>
  );
}
