import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Upload, Play, CheckCircle, Volume2, VolumeX, FlipHorizontal, X, Zap, CameraOff } from 'lucide-react';
import { soundFX } from '../utils/audio';
import { getFilterStyle } from '../utils/filterEngine';
import confetti from 'canvas-confetti';

export default function CameraBooth({
  onPhotoCaptured,
  onFillAllSlots,
  targetSlot,
  totalSlots = 4,
  onToggleSlotCount,
  filterSettings,
  onClose,
  isOpen
}) {
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('user'); // 'user' | 'environment'
  const [isMirrored, setIsMirrored] = useState(true);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdownNum, setCountdownNum] = useState(0);
  const [flash, setFlash] = useState(false);
  const [currentSlotIndex, setCurrentSlotIndex] = useState(targetSlot ?? 0);
  const [isAutoBurst, setIsAutoBurst] = useState(false);
  const [delaySec, setDelaySec] = useState(3); // 3s default
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // Sync internal slot index with external targetSlot
  useEffect(() => {
    if (typeof targetSlot === 'number') {
      setCurrentSlotIndex(targetSlot);
    }
  }, [targetSlot]);

  // Start webcam
  const startCamera = async (facing = facingMode) => {
    try {
      setCameraError(null);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      const constraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Kamera tidak dapat diakses atau diblokir browser. Anda tetap bisa upload foto langsung.');
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, facingMode]);

  // Flip camera front/back
  const handleToggleFacing = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    setIsMirrored(nextMode === 'user');
    startCamera(nextMode);
  };

  // Capture single frame from video to canvas
  const captureFrame = (slotToFill) => {
    if (!videoRef.current) return null;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');

    ctx.save();
    if (isMirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Flash screen effect
    setFlash(true);
    if (soundEnabled) soundFX.playShutter();
    setTimeout(() => setFlash(false), 200);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    onPhotoCaptured(dataUrl, slotToFill);
    return dataUrl;
  };

  // Automated Multi-Shot Photobooth Sequence
  const startBurstSequence = async () => {
    if (isCountingDown || !videoRef.current) return;
    setIsCountingDown(true);
    setIsAutoBurst(true);

    for (let slot = 0; slot < totalSlots; slot++) {
      setCurrentSlotIndex(slot);

      // Countdown loop
      for (let sec = delaySec; sec > 0; sec--) {
        setCountdownNum(sec);
        if (soundEnabled) soundFX.playBeep(false);
        await new Promise((r) => setTimeout(r, 1000));
      }

      // Shutter snap
      setCountdownNum(0);
      captureFrame(slot);
      await new Promise((r) => setTimeout(r, 800)); // pause between shots
    }

    // Finished sequence!
    setIsCountingDown(false);
    setIsAutoBurst(false);
    if (soundEnabled) soundFX.playCelebration();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Single shot trigger for current active slot
  const triggerSingleShot = async () => {
    if (isCountingDown) return;
    setIsCountingDown(true);
    for (let sec = delaySec; sec > 0; sec--) {
      setCountdownNum(sec);
      if (soundEnabled) soundFX.playBeep(false);
      await new Promise((r) => setTimeout(r, 1000));
    }
    setCountdownNum(0);
    captureFrame(currentSlotIndex);
    setIsCountingDown(false);
  };

  // 1 Shot that automatically fills ALL slots on the strip!
  const triggerFillAllShots = async () => {
    if (isCountingDown) return;
    setIsCountingDown(true);
    for (let sec = delaySec; sec > 0; sec--) {
      setCountdownNum(sec);
      if (soundEnabled) soundFX.playBeep(false);
      await new Promise((r) => setTimeout(r, 1000));
    }
    setCountdownNum(0);
    const dataUrl = captureFrame(currentSlotIndex);
    if (dataUrl && onFillAllSlots) {
      onFillAllSlots(dataUrl);
    }
    setIsCountingDown(false);
    if (soundEnabled) soundFX.playCelebration();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // File upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onPhotoCaptured(event.target.result, currentSlotIndex);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  const filterStyle = getFilterStyle(filterSettings);

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-stone-200/90 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-stone-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Ant Design Style Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-100 bg-[#fbfbfa]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-bold text-stone-800 text-sm">Booth Kamera Live</span>
            <span className="text-xs text-rose-600 font-semibold bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
              Frame {currentSlotIndex + 1} dari {totalSlots}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition"
              title="Suara Shutter"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-stone-700" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition"
              title="Tutup Kamera"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewfinder Area */}
        <div className="p-3 sm:p-4 bg-stone-100/60">
          <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-stone-900 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
            
            {/* Flash Effect Overlay */}
            {flash && (
              <div className="absolute inset-0 bg-white z-40 transition-opacity duration-150" />
            )}

            {/* Countdown Display Overlay */}
            {isCountingDown && countdownNum > 0 && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/30 backdrop-blur-xs">
                <span className="text-8xl sm:text-9xl font-black text-white font-mono drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] animate-ping">
                  {countdownNum}
                </span>
              </div>
            )}

            {/* Live Video Stream with Aesthetic Live Filter */}
            {cameraError ? (
              <div className="p-6 text-center max-w-md bg-stone-900/90 rounded-2xl m-4">
                <CameraOff className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                <p className="text-rose-300 text-xs mb-3">{cameraError}</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-bold inline-flex items-center gap-2 shadow-sm transition"
                >
                  <Upload className="w-4 h-4" />
                  Upload Foto dari Galeri HP / PC
                </button>
              </div>
            ) : (
              <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transition duration-150"
                  style={{
                    ...filterStyle,
                    transform: isMirrored ? 'scaleX(-1)' : 'none'
                  }}
                />

                {/* Real-time Aesthetic Overlays on Viewfinder */}
                {filterSettings?.halftone && (
                  <div className="absolute inset-0 newsprint-overlay pointer-events-none" />
                )}
                {filterSettings?.filmGrain > 0 && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                      opacity: (filterSettings.filmGrain / 100) * 0.35,
                      mixBlendMode: 'overlay'
                    }}
                  />
                )}
                {filterSettings?.dateStamp && (
                  <div className="absolute right-4 bottom-3 font-digital text-[#ff7b00] text-xl drop-shadow pointer-events-none">
                    {filterSettings.customDate || "'26 10 12"}
                  </div>
                )}

                {/* Viewfinder crosshairs / rule of thirds guides */}
                <div className="absolute inset-0 pointer-events-none border border-white/20 m-6 rounded-2xl flex flex-col justify-between">
                  <div className="flex justify-between p-2">
                    <div className="w-3 h-3 border-t-2 border-l-2 border-white/70" />
                    <div className="w-3 h-3 border-t-2 border-r-2 border-white/70" />
                  </div>
                  <div className="flex justify-between p-2">
                    <div className="w-3 h-3 border-b-2 border-l-2 border-white/70" />
                    <div className="w-3 h-3 border-b-2 border-r-2 border-white/70" />
                  </div>
                </div>
              </div>
            )}

            {/* Camera adjustments floating controls */}
            <div className="absolute top-3 left-3 z-20 flex gap-2">
              <button
                onClick={handleToggleFacing}
                className="px-2.5 py-1.5 rounded-full bg-white/85 hover:bg-white text-stone-800 backdrop-blur text-xs flex items-center gap-1.5 border border-white/40 shadow-xs transition"
                title="Ganti Kamera Depan/Belakang"
              >
                <RefreshCw className="w-3.5 h-3.5 text-stone-700" />
                <span className="text-[11px] font-semibold hidden sm:inline">Flip Cam</span>
              </button>
              <button
                onClick={() => setIsMirrored(!isMirrored)}
                className="px-2.5 py-1.5 rounded-full bg-white/85 hover:bg-white text-stone-800 backdrop-blur text-xs flex items-center gap-1.5 border border-white/40 shadow-xs transition"
                title="Mirror Kiri-Kanan"
              >
                <FlipHorizontal className="w-3.5 h-3.5 text-stone-700" />
                <span className="text-[11px] font-semibold hidden sm:inline">Mirror</span>
              </button>
            </div>
          </div>
        </div>

        {/* Slot Selection Pills & Format Toggle */}
        <div className="px-3 sm:px-5 py-2.5 sm:py-3 bg-[#fbfbfa] border-t border-stone-100 flex items-center justify-between gap-2 text-xs overflow-x-auto">
          
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Slot Count Switcher (3 vs 4) */}
            {onToggleSlotCount && (
              <div className="flex items-center gap-0.5 sm:gap-1 bg-stone-200/70 p-0.5 sm:p-1 rounded-xl border border-stone-300/40">
                <button
                  onClick={() => onToggleSlotCount(3)}
                  className={`px-2 sm:px-2.5 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition ${
                    totalSlots === 3 ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  3 Frame
                </button>
                <button
                  onClick={() => onToggleSlotCount(4)}
                  className={`px-2 sm:px-2.5 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition ${
                    totalSlots === 4 ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  4 Frame
                </button>
              </div>
            )}

            <div className="flex items-center gap-1">
              {[...Array(totalSlots)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlotIndex(i)}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl font-mono text-[11px] sm:text-xs font-bold transition flex items-center justify-center shrink-0 ${
                    currentSlotIndex === i
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Delay Selection */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-stone-500 text-[10px] sm:text-[11px] font-semibold hidden sm:inline">Timer:</span>
            <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200/60">
              {[3, 5, 10].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setDelaySec(sec)}
                  className={`px-1.5 sm:px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-mono transition ${
                    delaySec === sec
                      ? 'bg-white text-stone-900 font-bold shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-stone-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
            {/* Upload Button */}
            <div className="w-full sm:w-auto flex justify-between sm:justify-start items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 sm:py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 border border-stone-200 transition"
                title="Upload foto dari galeri HP atau komputer"
              >
                <Upload className="w-3.5 h-3.5 text-rose-500" />
                <span>Galeri HP / PC</span>
              </button>

              <span className="sm:hidden text-[10px] font-mono text-stone-400">
                Frame {currentSlotIndex + 1}/{totalSlots}
              </span>
            </div>

            {/* Main Shutter Buttons */}
            <div className="grid grid-cols-3 sm:flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
              
              {/* 1 Foto Manual (Hanya untuk Slot Tertentu) */}
              <button
                onClick={triggerSingleShot}
                disabled={isCountingDown}
                className="px-2 sm:px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] sm:text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 border border-stone-200 transition disabled:opacity-50 text-center"
                title="Ambil foto 1 kali untuk frame ini"
              >
                <Camera className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                <span className="whitespace-nowrap">Frame {currentSlotIndex + 1}</span>
              </button>

              {/* 1 Foto Otomatis Masuk Semua Slot */}
              <button
                onClick={triggerFillAllShots}
                disabled={isCountingDown}
                className="px-2 sm:px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 text-[11px] sm:text-xs font-black flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 shadow-xs transition disabled:opacity-50 text-center"
                title="Sekali jepret langsung mengisi semua frame!"
              >
                <Zap className="w-3.5 h-3.5 text-stone-950 fill-stone-950 shrink-0" />
                <span className="whitespace-nowrap">Isi Semua</span>
              </button>

              {/* Auto Burst Sequence Button */}
              <button
                onClick={startBurstSequence}
                disabled={isCountingDown}
                className="px-2 sm:px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-[11px] sm:text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 shadow-sm transition disabled:opacity-50 text-center"
                title={`Mengambil ${totalSlots} pose berturut-turut`}
              >
                <Play className="w-3.5 h-3.5 fill-white shrink-0" />
                <span className="whitespace-nowrap">Auto {totalSlots}x</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
