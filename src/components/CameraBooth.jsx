import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  RefreshCw,
  Upload,
  Play,
  Volume2,
  VolumeX,
  FlipHorizontal,
  X,
  Zap,
  CameraOff,
  Sparkles,
  Sun,
  UserCheck,
  Wand2
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import {
  getFilterStyle,
  analyzeVideoScene,
  processIntelligentCapture
} from '../utils/filterEngine';
import confetti from 'canvas-confetti';

const POSE_GUIDES = [
  { title: 'Pose 1: Peace / V-Sign', hint: 'Miringkan kepala sedikit & buat V-sign di dekat pipi' },
  { title: 'Pose 2: Cheek Heart', hint: 'Bentuk hati di pipi atau senyum manis menghadap lensa' },
  { title: 'Pose 3: Cool Side Look', hint: 'Lirik ke samping seolah candid dengan ekspresi tenang' },
  { title: 'Pose 4: Expressive Freestyle', hint: 'Gaya paling seru, tertawa lepas, atau kacamata imajiner!' }
];

const RING_LIGHTS = [
  { id: 'peach', name: 'Warm Peach', color: 'rgba(255, 198, 178, 0.85)', glow: '0 0 65px 22px rgba(255, 180, 155, 0.65)' },
  { id: 'white', name: 'Studio White', color: 'rgba(255, 255, 255, 0.92)', glow: '0 0 70px 24px rgba(255, 255, 255, 0.75)' },
  { id: 'rose', name: 'Soft Rose', color: 'rgba(255, 182, 205, 0.85)', glow: '0 0 65px 22px rgba(244, 114, 182, 0.6)' },
  { id: 'off', name: 'Off', color: 'transparent', glow: 'none' }
];

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
  const [facingMode, setFacingMode] = useState('user');
  const [isMirrored, setIsMirrored] = useState(true);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdownNum, setCountdownNum] = useState(0);
  const [flash, setFlash] = useState(false);
  const [currentSlotIndex, setCurrentSlotIndex] = useState(targetSlot ?? 0);
  const [delaySec, setDelaySec] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cameraError, setCameraError] = useState(null);

  // Intelligent Camera States
  const [aiIspEnabled, setAiIspEnabled] = useState(true);
  const [ringLightId, setRingLightId] = useState('peach');
  const [showPoseGuide, setShowPoseGuide] = useState(true);
  const [sceneStatus, setSceneStatus] = useState({
    luminance: 68,
    status: 'OPTIMAL',
    label: 'AI Studio Portrait Ready',
    boostNeeded: 0
  });

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (typeof targetSlot === 'number') {
      setCurrentSlotIndex(targetSlot);
    }
  }, [targetSlot]);

  // Start webcam with HD studio constraints
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
        videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Kamera tidak dapat diakses atau diblokir browser. Anda tetap bisa upload foto dari galeri.');
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

  // Real-time Intelligent Scene & Lighting Analyzer loop
  useEffect(() => {
    if (!isOpen || cameraError) return;
    const interval = setInterval(() => {
      if (videoRef.current && videoRef.current.readyState >= 2) {
        const result = analyzeVideoScene(videoRef.current);
        setSceneStatus(result);
      }
    }, 900);
    return () => clearInterval(interval);
  }, [isOpen, cameraError]);

  const handleToggleFacing = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    setIsMirrored(nextMode === 'user');
    startCamera(nextMode);
  };

  const cycleRingLight = () => {
    const idx = RING_LIGHTS.findIndex((r) => r.id === ringLightId);
    const next = RING_LIGHTS[(idx + 1) % RING_LIGHTS.length];
    setRingLightId(next.id);
  };

  // Capture single frame from video to canvas with Intelligent ISP Processing
  const captureFrame = (slotToFill) => {
    if (!videoRef.current) return null;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 960;
    const ctx = canvas.getContext('2d');

    ctx.save();
    if (isMirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Run Intelligent ISP (Auto-HDR Shadow Lift, Portrait Skin Smoothing, 3D Studio Key Light)
    if (aiIspEnabled) {
      processIntelligentCapture(ctx, canvas.width, canvas.height, {
        autoTone: filterSettings?.aiAutoTone !== false,
        skinSmooth: filterSettings?.aiSkinSmooth !== false,
        studioLight: filterSettings?.aiStudioLight !== false
      });
    }

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

    for (let slot = 0; slot < totalSlots; slot++) {
      setCurrentSlotIndex(slot);

      for (let sec = delaySec; sec > 0; sec--) {
        setCountdownNum(sec);
        if (soundEnabled) soundFX.playBeep(false);
        await new Promise((r) => setTimeout(r, 1000));
      }

      setCountdownNum(0);
      captureFrame(slot);
      await new Promise((r) => setTimeout(r, 850));
    }

    setIsCountingDown(false);
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

  // 1 Shot that automatically fills ALL slots on the strip
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

  // File upload handler with optional Intelligent ISP enhancement
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const rawUrl = event.target.result;
      if (!aiIspEnabled) {
        onPhotoCaptured(rawUrl, currentSlotIndex);
        return;
      }
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1600;
        let w = img.naturalWidth || 1200;
        let h = img.naturalHeight || 900;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        processIntelligentCapture(ctx, w, h, {
          autoTone: true,
          skinSmooth: true,
          studioLight: true
        });
        onPhotoCaptured(canvas.toDataURL('image/jpeg', 0.95), currentSlotIndex);
      };
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  const filterStyle = getFilterStyle(filterSettings);
  const activeRingLight = RING_LIGHTS.find((r) => r.id === ringLightId) || RING_LIGHTS[0];
  const currentPose = POSE_GUIDES[currentSlotIndex % POSE_GUIDES.length];

  // Live preview adaptive boost when room is dark
  const liveAiPreviewBoost =
    aiIspEnabled && sceneStatus.boostNeeded > 0
      ? `brightness(${1 + sceneStatus.boostNeeded / 140}) contrast(1.04)`
      : '';

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-stone-200/90 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-stone-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Clean Studio Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-stone-100 bg-[#fbfbfa]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-extrabold text-stone-800 text-xs sm:text-sm tracking-tight">
              Intelligent Studio Cam
            </span>
            <span className="text-[10px] sm:text-xs text-rose-600 font-bold bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/60">
              Frame {currentSlotIndex + 1} / {totalSlots}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Toggle Smart AI ISP */}
            <button
              onClick={() => setAiIspEnabled(!aiIspEnabled)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 border transition ${
                aiIspEnabled
                  ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                  : 'bg-stone-100 text-stone-500 border-stone-200'
              }`}
              title="Intelligent Auto-HDR, Portrait Skin Smooth & 3D Studio Relighting"
            >
              <Wand2 className="w-3 h-3" />
              <span>AI Beauty & HDR {aiIspEnabled ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 sm:p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition"
              title="Suara Shutter"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-stone-700" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition"
              title="Tutup Kamera"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewfinder Area with Studio Ring Light */}
        <div className="p-2.5 sm:p-4 bg-stone-100/70 relative">
          <div
            className="relative aspect-[4/3] sm:aspect-[16/10] bg-stone-900 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center transition-all duration-300"
            style={{
              boxShadow:
                activeRingLight.id !== 'off'
                  ? `inset 0 0 0 ${isCountingDown ? '14px' : '8px'} ${activeRingLight.color}, ${activeRingLight.glow}`
                  : undefined
            }}
          >
            {/* Studio Ring Light Physical Screen Illumination Border */}
            {activeRingLight.id !== 'off' && (
              <div
                className="absolute inset-0 pointer-events-none z-20 rounded-2xl transition-all duration-300"
                style={{
                  border: `${isCountingDown ? '12px' : '6px'} solid ${activeRingLight.color}`,
                  boxShadow: `inset 0 0 45px ${activeRingLight.color}`
                }}
              />
            )}

            {/* Flash Effect Overlay */}
            {flash && (
              <div className="absolute inset-0 bg-white z-40 transition-opacity duration-150" />
            )}

            {/* Countdown Display Overlay */}
            {isCountingDown && countdownNum > 0 && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/25 backdrop-blur-[1px]">
                <span className="text-7xl sm:text-8xl font-black text-white font-mono drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
                  {countdownNum}
                </span>
                <span className="mt-2 px-3 py-1 rounded-full bg-white/90 text-stone-900 font-bold text-xs shadow">
                  {currentPose.title}
                </span>
              </div>
            )}

            {/* Live Video Stream */}
            {cameraError ? (
              <div className="p-6 text-center max-w-md bg-stone-900/90 rounded-2xl m-4">
                <CameraOff className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                <p className="text-rose-300 text-xs mb-3">{cameraError}</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-bold inline-flex items-center gap-2 shadow-sm transition"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Foto dari Galeri HP / PC</span>
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
                    filter: `${filterStyle.filter || ''} ${liveAiPreviewBoost}`.trim(),
                    transform: isMirrored ? 'scaleX(-1)' : 'none'
                  }}
                />

                {/* Real-time Aesthetic Overlays on Viewfinder */}
                {filterSettings?.halftone && (
                  <div className="absolute inset-0 newsprint-overlay pointer-events-none" />
                )}
                {filterSettings?.filmGrain > 0 && (
                  <div
                    className="absolute inset-0 film-grain-overlay pointer-events-none"
                    style={{
                      opacity: (filterSettings.filmGrain / 100) * 0.4
                    }}
                  />
                )}
                {filterSettings?.dateStamp && (
                  <div className="absolute right-4 bottom-3 font-digital text-[#ff7b00] text-xl drop-shadow pointer-events-none">
                    {filterSettings.customDate || "'26 10 13"}
                  </div>
                )}

                {/* Intelligent Pose Guide Banner (Bottom Center) */}
                {showPoseGuide && !isCountingDown && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 max-w-[90%] bg-stone-900/75 backdrop-blur-md text-white px-3.5 py-1.5 rounded-2xl border border-white/15 shadow-lg flex items-center gap-2 pointer-events-none">
                    <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <div className="text-left">
                      <div className="text-[10px] font-bold text-rose-300 leading-tight">
                        {currentPose.title}
                      </div>
                      <div className="text-[10px] text-stone-200 leading-tight hidden sm:block">
                        {currentPose.hint}
                      </div>
                    </div>
                  </div>
                )}

                {/* Viewfinder Framing Guides */}
                <div className="absolute inset-0 pointer-events-none border border-white/15 m-5 sm:m-6 rounded-2xl flex flex-col justify-between">
                  <div className="flex justify-between p-2">
                    <div className="w-3 h-3 border-t-2 border-l-2 border-white/60" />
                    <div className="w-3 h-3 border-t-2 border-r-2 border-white/60" />
                  </div>
                  <div className="flex justify-between p-2">
                    <div className="w-3 h-3 border-b-2 border-l-2 border-white/60" />
                    <div className="w-3 h-3 border-b-2 border-r-2 border-white/60" />
                  </div>
                </div>
              </div>
            )}

            {/* Top-Left Camera Controls */}
            <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5">
              <button
                onClick={handleToggleFacing}
                className="px-2.5 py-1.5 rounded-full bg-stone-900/70 hover:bg-stone-900/90 text-white backdrop-blur-md text-xs flex items-center gap-1.5 border border-white/15 shadow-xs transition"
                title="Ganti Kamera Depan/Belakang"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold hidden sm:inline">Flip</span>
              </button>
              <button
                onClick={() => setIsMirrored(!isMirrored)}
                className="px-2.5 py-1.5 rounded-full bg-stone-900/70 hover:bg-stone-900/90 text-white backdrop-blur-md text-xs flex items-center gap-1.5 border border-white/15 shadow-xs transition"
                title="Mirror Kiri-Kanan"
              >
                <FlipHorizontal className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold hidden sm:inline">Mirror</span>
              </button>
              <button
                onClick={cycleRingLight}
                className="px-2.5 py-1.5 rounded-full bg-stone-900/70 hover:bg-stone-900/90 text-white backdrop-blur-md text-xs flex items-center gap-1.5 border border-white/15 shadow-xs transition"
                title="Ubah Warna Ring Light Layar"
              >
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-[11px] font-semibold">Ring: {activeRingLight.name}</span>
              </button>
              <button
                onClick={() => setShowPoseGuide(!showPoseGuide)}
                className={`px-2.5 py-1.5 rounded-full backdrop-blur-md text-xs flex items-center gap-1 border shadow-xs transition ${
                  showPoseGuide
                    ? 'bg-rose-500/85 text-white border-rose-300/40'
                    : 'bg-stone-900/70 text-stone-300 border-white/15'
                }`}
                title="Panduan Gaya Pose Otomatis"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold hidden sm:inline">Pose Guide</span>
              </button>
            </div>

            {/* Top-Right Live Intelligent Scene Sensor Badge */}
            {!cameraError && (
              <div className="absolute top-3 right-3 z-20 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-900/75 backdrop-blur-md border border-white/15 text-[10px] font-medium text-stone-200">
                <span
                  className={`w-2 h-2 rounded-full ${
                    sceneStatus.status === 'LOW_LIGHT'
                      ? 'bg-amber-400 animate-pulse'
                      : 'bg-emerald-400'
                  }`}
                />
                <span>{sceneStatus.label}</span>
                <span className="text-stone-400 font-mono">({sceneStatus.luminance}%)</span>
              </div>
            )}
          </div>
        </div>

        {/* Slot Selection Pills & Timer Toggle */}
        <div className="px-3 sm:px-5 py-2.5 bg-[#fbfbfa] border-t border-stone-100 flex items-center justify-between gap-2 text-xs overflow-x-auto">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {onToggleSlotCount && (
              <div className="flex items-center gap-0.5 bg-stone-200/70 p-0.5 rounded-xl border border-stone-300/40">
                <button
                  onClick={() => onToggleSlotCount(3)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition ${
                    totalSlots === 3 ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  3 Frame
                </button>
                <button
                  onClick={() => onToggleSlotCount(4)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition ${
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
                className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 border border-stone-200 transition"
                title="Upload foto dari galeri HP atau komputer (Otomatis dipercantik AI ISP)"
              >
                <Upload className="w-3.5 h-3.5 text-rose-500" />
                <span>Upload Galeri</span>
              </button>

              <span className="sm:hidden text-[10px] font-mono text-stone-500">
                {sceneStatus.label}
              </span>
            </div>

            {/* Main Shutter Buttons */}
            <div className="grid grid-cols-3 sm:flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
              <button
                onClick={triggerSingleShot}
                disabled={isCountingDown}
                className="px-2 sm:px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] sm:text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 border border-stone-200 transition disabled:opacity-50 text-center"
                title="Ambil foto 1 kali untuk frame ini"
              >
                <Camera className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                <span className="whitespace-nowrap">Frame {currentSlotIndex + 1}</span>
              </button>

              <button
                onClick={triggerFillAllShots}
                disabled={isCountingDown}
                className="px-2 sm:px-3.5 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-[11px] sm:text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 shadow-xs transition disabled:opacity-50 text-center"
                title="Sekali jepret langsung mengisi semua frame!"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                <span className="whitespace-nowrap">1x Isi Semua</span>
              </button>

              <button
                onClick={startBurstSequence}
                disabled={isCountingDown}
                className="px-2 sm:px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-[11px] sm:text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 shadow-sm shadow-rose-500/20 transition disabled:opacity-50 text-center"
                title={`Mengambil ${totalSlots} pose berturut-turut`}
              >
                <Play className="w-3.5 h-3.5 fill-white shrink-0" />
                <span className="whitespace-nowrap">Auto {totalSlots}x Pose</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
