import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  RefreshCw,
  Upload,
  Play,
  FlipHorizontal,
  X,
  Zap,
  CameraOff,
  Sun
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import {
  getFilterStyle,
  analyzeVideoScene,
  processIntelligentCapture
} from '../utils/filterEngine';
import confetti from 'canvas-confetti';

export default function CameraBooth({
  onPhotoCaptured,
  onFillAllSlots,
  targetSlot,
  totalSlots = 4,
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
  const [ringLightOn, setRingLightOn] = useState(true);
  const [cameraError, setCameraError] = useState(null);
  const [sceneBoost, setSceneBoost] = useState(0);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (typeof targetSlot === 'number') {
      setCurrentSlotIndex(targetSlot);
    }
  }, [targetSlot]);

  const startCamera = async (facing = facingMode) => {
    try {
      setCameraError(null);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      setCameraError('Kamera tidak tersedia. Silakan pilih foto dari galeri HP / PC Anda.');
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, facingMode]);

  // Automatic background scene analyzer for low-light boost
  useEffect(() => {
    if (!isOpen || cameraError) return;
    const interval = setInterval(() => {
      if (videoRef.current && videoRef.current.readyState >= 2) {
        const res = analyzeVideoScene(videoRef.current);
        setSceneBoost(res.boostNeeded || 0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, cameraError]);

  const handleToggleFacing = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    setIsMirrored(nextMode === 'user');
    startCamera(nextMode);
  };

  // Capture frame with automatic Intelligent ISP enhancement
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

    // Automatic Intelligent ISP (Auto-HDR, Beauty Skin Smooth, 3D Studio Key Light)
    processIntelligentCapture(ctx, canvas.width, canvas.height, {
      autoTone: true,
      skinSmooth: true,
      studioLight: true
    });

    setFlash(true);
    soundFX.playShutter();
    setTimeout(() => setFlash(false), 180);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    onPhotoCaptured(dataUrl, slotToFill);
    return dataUrl;
  };

  const startBurstSequence = async () => {
    if (isCountingDown || !videoRef.current) return;
    setIsCountingDown(true);

    for (let slot = 0; slot < totalSlots; slot++) {
      setCurrentSlotIndex(slot);
      for (let sec = delaySec; sec > 0; sec--) {
        setCountdownNum(sec);
        soundFX.playBeep(false);
        await new Promise((r) => setTimeout(r, 1000));
      }
      setCountdownNum(0);
      captureFrame(slot);
      await new Promise((r) => setTimeout(r, 800));
    }

    setIsCountingDown(false);
    soundFX.playCelebration();
    confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
  };

  const triggerSingleShot = async () => {
    if (isCountingDown) return;
    setIsCountingDown(true);
    for (let sec = delaySec; sec > 0; sec--) {
      setCountdownNum(sec);
      soundFX.playBeep(false);
      await new Promise((r) => setTimeout(r, 1000));
    }
    setCountdownNum(0);
    captureFrame(currentSlotIndex);
    setIsCountingDown(false);
  };

  const triggerFillAllShots = async () => {
    if (isCountingDown) return;
    setIsCountingDown(true);
    for (let sec = delaySec; sec > 0; sec--) {
      setCountdownNum(sec);
      soundFX.playBeep(false);
      await new Promise((r) => setTimeout(r, 1000));
    }
    setCountdownNum(0);
    const dataUrl = captureFrame(currentSlotIndex);
    if (dataUrl && onFillAllSlots) {
      onFillAllSlots(dataUrl);
    }
    setIsCountingDown(false);
    soundFX.playCelebration();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
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
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  const filterStyle = getFilterStyle(filterSettings);
  const liveAiBoost = sceneBoost > 0 ? `brightness(${1 + sceneBoost / 140}) contrast(1.04)` : '';

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col text-stone-800">
        
        {/* Clean Minimal Camera Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900 text-sm">Kamera Studio</span>
            <div className="flex items-center gap-1 ml-1">
              {[...Array(totalSlots)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlotIndex(i)}
                  className={`w-6 h-6 rounded-lg text-xs font-bold transition ${
                    currentSlotIndex === i
                      ? 'bg-rose-500 text-white'
                      : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setRingLightOn(!ringLightOn)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 border transition ${
                ringLightOn
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-stone-100 text-stone-500 border-stone-200'
              }`}
              title="Lampu Layar Studio"
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ring Light</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Clean Viewfinder */}
        <div className="p-3 bg-stone-100/60">
          <div
            className="relative aspect-[4/3] bg-stone-900 rounded-2xl overflow-hidden flex items-center justify-center transition-all"
            style={{
              boxShadow: ringLightOn
                ? 'inset 0 0 0 8px rgba(255, 220, 205, 0.85), 0 0 40px 10px rgba(255, 195, 175, 0.45)'
                : undefined
            }}
          >
            {flash && <div className="absolute inset-0 bg-white z-40" />}

            {isCountingDown && countdownNum > 0 && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20">
                <span className="text-7xl sm:text-8xl font-black text-white font-mono drop-shadow-lg">
                  {countdownNum}
                </span>
              </div>
            )}

            {cameraError ? (
              <div className="p-6 text-center">
                <CameraOff className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <p className="text-stone-300 text-xs mb-3">{cameraError}</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Pilih dari Galeri</span>
                </button>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{
                  filter: `${filterStyle.filter || ''} ${liveAiBoost}`.trim(),
                  transform: isMirrored ? 'scaleX(-1)' : 'none'
                }}
              />
            )}

            {/* Simple Flip & Mirror in Top-Left Corner */}
            {!cameraError && (
              <div className="absolute top-3 left-3 z-20 flex gap-1.5">
                <button
                  onClick={handleToggleFacing}
                  className="p-2 rounded-full bg-stone-900/60 hover:bg-stone-900/80 text-white backdrop-blur-xs transition"
                  title="Putar Kamera"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsMirrored(!isMirrored)}
                  className="p-2 rounded-full bg-stone-900/60 hover:bg-stone-900/80 text-white backdrop-blur-xs transition"
                  title="Mirror"
                >
                  <FlipHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Simple Timer Toggle in Top-Right Corner */}
            <div className="absolute top-3 right-3 z-20 flex bg-stone-900/60 backdrop-blur-xs rounded-full p-0.5 text-[11px] text-white">
              {[3, 5].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setDelaySec(sec)}
                  className={`px-2 py-0.5 rounded-full font-mono transition ${
                    delaySec === sec ? 'bg-white text-stone-900 font-bold' : 'text-stone-300'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Clean Action Bar */}
        <div className="p-3.5 bg-white border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Upload className="w-3.5 h-3.5 text-rose-500" />
            <span>Upload</span>
          </button>

          <div className="flex items-center gap-1.5 flex-1 sm:flex-initial justify-end">
            <button
              onClick={triggerSingleShot}
              disabled={isCountingDown}
              className="px-3 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>1 Foto</span>
            </button>

            <button
              onClick={triggerFillAllShots}
              disabled={isCountingDown}
              className="px-3 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
              title="1 kali foto otomatis masuk ke semua frame"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>1x Isi Semua</span>
            </button>

            <button
              onClick={startBurstSequence}
              disabled={isCountingDown}
              className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Auto {totalSlots}x</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
