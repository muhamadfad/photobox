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
  Sun,
  Focus
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
  const [ringLightOn, setRingLightOn] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Bi-Directional Auto-Focus & Auto-Lighting Telemetry (17-Point GPU LUT Dehaze + Closed-Form Face Exposure)
  const [sceneInfo, setSceneInfo] = useState({
    luminance: 55,
    status: 'OPTIMAL',
    label: 'AF • Studio Auto-Jernih',
    boostNeeded: 0,
    contrastBoost: 8,
    saturationBoost: 12,
    gamma: 1.0,
    dehazeFloor: 0,
    tableR: '0 0.063 0.125 0.188 0.25 0.313 0.375 0.438 0.5 0.563 0.625 0.688 0.75 0.813 0.875 0.938 1',
    tableG: '0 0.063 0.125 0.188 0.25 0.313 0.375 0.438 0.5 0.563 0.625 0.688 0.75 0.813 0.875 0.938 1',
    tableB: '0 0.063 0.125 0.188 0.25 0.313 0.375 0.438 0.5 0.563 0.625 0.688 0.75 0.813 0.875 0.938 1'
  });
  const [manualExposure, setManualExposure] = useState(0); // -30 .. +30
  const [manualDehaze, setManualDehaze] = useState(12); // Default +12 extra dehaze for crisp blacks on hazy webcams
  const [focusPoint, setFocusPoint] = useState({ x: 0.5, y: 0.45 });
  const [focusState, setFocusState] = useState('locked'); // 'locking' | 'locked'
  const [showFocusBox, setShowFocusBox] = useState(true);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const focusTimerRef = useRef(null);

  useEffect(() => {
    if (typeof targetSlot === 'number') {
      setCurrentSlotIndex(targetSlot);
    }
  }, [targetSlot]);

  // Apply hardware-level Continuous Auto-Focus, Auto-Exposure & Auto-White-Balance
  const applyHardwareCameraEnhancements = async (mediaStream, point = { x: 0.5, y: 0.45 }) => {
    try {
      const track = mediaStream?.getVideoTracks?.()[0];
      if (!track || typeof track.getCapabilities !== 'function') return;

      const caps = track.getCapabilities();
      const advanced = {};

      if (Array.isArray(caps.focusMode)) {
        if (caps.focusMode.includes('continuous')) {
          advanced.focusMode = 'continuous';
        } else if (caps.focusMode.includes('single-shot')) {
          advanced.focusMode = 'single-shot';
        }
      }

      if (Array.isArray(caps.exposureMode) && caps.exposureMode.includes('continuous')) {
        advanced.exposureMode = 'continuous';
      }

      if (Array.isArray(caps.whiteBalanceMode) && caps.whiteBalanceMode.includes('continuous')) {
        advanced.whiteBalanceMode = 'continuous';
      }

      if (caps.pointsOfInterest && point) {
        advanced.pointsOfInterest = [{ x: point.x, y: point.y }];
      }

      if (Object.keys(advanced).length > 0) {
        await track.applyConstraints({ advanced: [advanced] });
      }
    } catch (e) {
      // Ignore unsupported hardware constraints on older webcams
    }
  };

  const triggerAutoFocusLock = (newPoint = { x: 0.5, y: 0.45 }) => {
    setFocusPoint(newPoint);
    setFocusState('locking');
    setShowFocusBox(true);

    if (focusTimerRef.current) clearTimeout(focusTimerRef.current);

    if (videoRef.current && videoRef.current.readyState >= 2) {
      const info = analyzeVideoScene(videoRef.current, newPoint, {
        exposure: manualExposure,
        dehaze: manualDehaze
      });
      setSceneInfo(info);
      if (stream) {
        applyHardwareCameraEnhancements(stream, newPoint);
      }
    }

    focusTimerRef.current = setTimeout(() => {
      setFocusState('locked');
    }, 350);
  };

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
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: false
      });
      setStream(mediaStream);
      applyHardwareCameraEnhancements(mediaStream, { x: 0.5, y: 0.45 });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {});
          setTimeout(() => {
            triggerAutoFocusLock({ x: 0.5, y: 0.45 });
          }, 250);
        };
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
      if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
    };
  }, [isOpen, facingMode]);

  // Continuous Real-Time Auto-Levels Dehaze & Face Exposure Analyzer (every 280ms)
  useEffect(() => {
    if (!isOpen || cameraError) return;
    if (videoRef.current && videoRef.current.readyState >= 2) {
      setSceneInfo(
        analyzeVideoScene(videoRef.current, focusPoint, {
          exposure: manualExposure,
          dehaze: manualDehaze
        })
      );
    }
    const interval = setInterval(() => {
      if (videoRef.current && videoRef.current.readyState >= 2) {
        const res = analyzeVideoScene(videoRef.current, focusPoint, {
          exposure: manualExposure,
          dehaze: manualDehaze
        });
        setSceneInfo(res);
      }
    }, 280);
    return () => clearInterval(interval);
  }, [isOpen, cameraError, focusPoint, manualExposure, manualDehaze]);

  const handleToggleFacing = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    setIsMirrored(nextMode === 'user');
    startCamera(nextMode);
  };

  // Interactive Tap-to-Focus & Face Exposure Metering on Viewfinder
  const handleViewfinderTap = (e) => {
    if (cameraError || isCountingDown) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = Math.min(0.88, Math.max(0.12, (e.clientX - rect.left) / rect.width));
    const clickY = Math.min(0.85, Math.max(0.15, (e.clientY - rect.top) / rect.height));
    triggerAutoFocusLock({ x: clickX, y: clickY });
  };

  // Capture frame with Full 17-Point Auto-Dehaze & S-Curve + Auto-Focus Sharpen
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

    const effectiveFocusPoint = {
      x: isMirrored ? 1 - focusPoint.x : focusPoint.x,
      y: focusPoint.y
    };
    processIntelligentCapture(ctx, canvas.width, canvas.height, {
      autoTone: true,
      skinSmooth: true,
      studioLight: true,
      autoFocusSharpen: true,
      focusPoint: effectiveFocusPoint,
      manualAdjust: {
        exposure: manualExposure,
        dehaze: manualDehaze
      }
    });

    setFlash(true);
    soundFX.playShutter();
    setTimeout(() => setFlash(false), 180);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.96);
    onPhotoCaptured(dataUrl, slotToFill);
    return dataUrl;
  };

  const startBurstSequence = async () => {
    if (isCountingDown || !videoRef.current) return;
    setIsCountingDown(true);

    for (let slot = 0; slot < totalSlots; slot++) {
      setCurrentSlotIndex(slot);
      triggerAutoFocusLock(focusPoint);
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
    triggerAutoFocusLock(focusPoint);
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
    triggerAutoFocusLock(focusPoint);
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
          studioLight: true,
          autoFocusSharpen: true
        });
        onPhotoCaptured(canvas.toDataURL('image/jpeg', 0.96), currentSlotIndex);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  const userContrast = filterSettings?.contrast || 0;
  const userSaturation = filterSettings?.saturation || 0;
  const totalContrast = 1 + (userContrast + (sceneInfo.contrastBoost ?? 8)) / 100;
  const totalSaturation = 1 + (userSaturation + (sceneInfo.saturationBoost ?? 14)) / 100;

  const liveVideoFilter = `url(#pikubooth-live-isp) contrast(${Math.max(1.0, Math.min(1.35, totalContrast)).toFixed(2)}) saturate(${Math.max(0, Math.min(1.55, totalSaturation)).toFixed(2)})`;

  return (
    <div
      className={`fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 transition-colors duration-300 ${
        ringLightOn ? 'bg-amber-50/90' : 'bg-stone-950/80'
      }`}
    >
      {/* Hardware-Accelerated 60fps GPU ISP: 17-Point Auto-Levels Dehaze & S-Curve LUT + Real-Time Optical Unsharp Mask */}
      <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
        <filter id="pikubooth-live-isp" colorInterpolationFilters="sRGB">
          <feComponentTransfer result="toned">
            <feFuncR type="table" tableValues={sceneInfo.tableR} />
            <feFuncG type="table" tableValues={sceneInfo.tableG} />
            <feFuncB type="table" tableValues={sceneInfo.tableB} />
          </feComponentTransfer>
          <feConvolveMatrix
            in="toned"
            order="3 3"
            kernelMatrix="0 -0.22 0 -0.22 1.88 -0.22 0 -0.22 0"
            preserveAlpha="true"
          />
        </filter>
      </svg>

      <div
        className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col text-stone-800 transition-shadow duration-300"
        style={{
          boxShadow: ringLightOn
            ? '0 0 80px 25px rgba(255, 243, 232, 0.95), 0 20px 50px rgba(0,0,0,0.2)'
            : undefined
        }}
      >
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
                  ? 'bg-amber-400 text-stone-950 border-amber-400 shadow-xs font-bold'
                  : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
              }`}
              title="Nyalakan hanya saat ruangan sangat gelap"
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Ring Light {ringLightOn ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Clean Viewfinder with Tap-to-Focus & Bi-Directional Auto-Lighting */}
        <div className="p-3 bg-stone-100/60">
          <div
            onClick={handleViewfinderTap}
            className="relative aspect-[4/3] bg-stone-900 rounded-2xl overflow-hidden flex items-center justify-center transition-all cursor-crosshair select-none"
            style={{
              boxShadow: ringLightOn
                ? 'inset 0 0 0 8px rgba(255, 245, 238, 0.9), 0 0 40px 10px rgba(255, 228, 210, 0.5)'
                : undefined
            }}
            title="Klik pada wajah untuk mengunci Auto-Fokus & menyesuaikan cahaya otomatis"
          >
            {flash && <div className="absolute inset-0 bg-white z-40" />}

            {isCountingDown && countdownNum > 0 && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/15">
                <span className="text-7xl sm:text-8xl font-black text-white font-mono drop-shadow-lg">
                  {countdownNum}
                </span>
              </div>
            )}

            {cameraError ? (
              <div className="p-6 text-center cursor-default">
                <CameraOff className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <p className="text-stone-300 text-xs mb-3">{cameraError}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Pilih dari Galeri</span>
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{
                    filter: liveVideoFilter,
                    transform: isMirrored ? 'scaleX(-1)' : 'none'
                  }}
                />

                {/* Interactive Auto-Focus & Auto-Exposure Reticle Box */}
                {showFocusBox && (
                  <div
                    className="absolute z-20 pointer-events-none transition-all duration-200"
                    style={{
                      left: `${focusPoint.x * 100}%`,
                      top: `${focusPoint.y * 100}%`,
                      transform: `translate(-50%, -50%) scale(${focusState === 'locking' ? 1.18 : 1})`
                    }}
                  >
                    <div
                      className={`w-16 h-16 rounded-xl border-2 relative flex items-center justify-center transition-colors ${
                        focusState === 'locking'
                          ? 'border-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.6)]'
                          : 'border-emerald-400/90 shadow-[0_0_10px_rgba(52,211,153,0.45)]'
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white/90" />
                      <Sun
                        className={`w-3.5 h-3.5 absolute -right-5 top-1/2 -translate-y-1/2 ${
                          focusState === 'locking' ? 'text-amber-300' : 'text-emerald-300'
                        }`}
                      />
                    </div>
                  </div>
                )}

                {/* Live Auto-Focus & Auto-Cahaya Status Pill */}
                <div className="absolute bottom-3 left-3 z-20 pointer-events-none flex items-center gap-1.5 bg-stone-900/75 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[10px] font-semibold border border-white/15">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      focusState === 'locking'
                        ? 'bg-amber-400 animate-ping'
                        : sceneInfo.status === 'BRIGHT'
                        ? 'bg-sky-400'
                        : sceneInfo.status === 'LOW_LIGHT'
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                  />
                  <span>{sceneInfo.label}</span>
                </div>
              </>
            )}

            {/* Simple Flip, Mirror & Re-Focus in Top-Left Corner */}
            {!cameraError && (
              <div
                className="absolute top-3 left-3 z-20 flex gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
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
                <button
                  onClick={() => triggerAutoFocusLock({ x: 0.5, y: 0.45 })}
                  className="px-2.5 py-1 rounded-full bg-stone-900/60 hover:bg-stone-900/80 text-white backdrop-blur-xs transition flex items-center gap-1 text-[10px] font-semibold"
                  title="Kunci Ulang Auto-Fokus & Cahaya"
                >
                  <Focus className="w-3 h-3 text-emerald-400" />
                  <span>Auto-Fokus</span>
                </button>
              </div>
            )}

            {/* Simple Timer Toggle in Top-Right Corner */}
            <div
              className="absolute top-3 right-3 z-20 flex bg-stone-900/60 backdrop-blur-xs rounded-full p-0.5 text-[11px] text-white"
              onClick={(e) => e.stopPropagation()}
            >
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

          {/* Quick Live Exposure & Anti-Fog Sliders for Any Room Lighting */}
          {!cameraError && (
            <div className="mt-2.5 px-2 py-2 bg-white rounded-xl border border-stone-200/80 grid grid-cols-2 gap-3 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-600 shrink-0">Cahaya</span>
                <input
                  type="range"
                  min="-25"
                  max="25"
                  value={manualExposure}
                  onChange={(e) => setManualExposure(Number(e.target.value))}
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <span className="font-mono text-[10px] text-stone-500 w-7 text-right">
                  {manualExposure > 0 ? `+${manualExposure}` : manualExposure}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-600 shrink-0">Anti-Kabut</span>
                <input
                  type="range"
                  min="0"
                  max="35"
                  value={manualDehaze}
                  onChange={(e) => setManualDehaze(Number(e.target.value))}
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-800"
                />
                <span className="font-mono text-[10px] text-stone-500 w-7 text-right">
                  +{manualDehaze}
                </span>
              </div>
            </div>
          )}
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
