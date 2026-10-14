import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  RefreshCw,
  Upload,
  Play,
  FlipHorizontal,
  X,
  CameraOff,
  Sun,
  Focus,
  Check,
  Trash2,
  Plus,
  Images,
  Maximize2,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import {
  analyzeVideoScene,
  processIntelligentCapture
} from '../utils/filterEngine';
import {
  EFFECT_CATEGORIES,
  FACE_EFFECTS,
  FaceEffectOverlay,
  renderFaceEffectToCanvas,
  detectFaceInVideo
} from '../utils/faceEffects';
import confetti from 'canvas-confetti';

export default function CameraBooth({
  onPhotoCaptured,
  onFillAllSlots,
  onClearSlots,
  photos = [],
  sessionPhotos = [],
  onAddSessionPhoto,
  onRemoveSessionPhoto,
  activeTemplate,
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

  // Full-Screen Studio Mode: 'camera' (Ambil Foto Full Layar) | 'select' (Review Hasil & Pilih Foto ke Template)
  const [viewMode, setViewMode] = useState('camera');
  // Optional enlarged photo preview inside the full-screen studio
  const [previewShot, setPreviewShot] = useState(null);

  // Non-Destructive Auto-Focus & Gentle Auto-Exposure Telemetry (Preserves 100% Native Camera Quality)
  const [sceneInfo, setSceneInfo] = useState({
    luminance: 58,
    status: 'OPTIMAL',
    label: 'AF • Kamera Natural HD',
    boostNeeded: 0,
    contrastBoost: 0,
    saturationBoost: 0,
    gamma: 1.0,
    dehazeFloor: 0,
    colorMatrix: '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0',
    tableR: '0 0.063 0.125 0.188 0.25 0.313 0.375 0.438 0.5 0.563 0.625 0.688 0.75 0.813 0.875 0.938 1',
    tableG: '0 0.063 0.125 0.188 0.25 0.313 0.375 0.438 0.5 0.563 0.625 0.688 0.75 0.813 0.875 0.938 1',
    tableB: '0 0.063 0.125 0.188 0.25 0.313 0.375 0.438 0.5 0.563 0.625 0.688 0.75 0.813 0.875 0.938 1'
  });
  const [manualExposure, setManualExposure] = useState(0); // -25 .. +25
  const [autoLight, setAutoLight] = useState(true);
  const [focusPoint, setFocusPoint] = useState({ x: 0.5, y: 0.5 });
  const [focusState, setFocusState] = useState('locked'); // 'locking' | 'locked'
  const [showFocusBox, setShowFocusBox] = useState(true);

  // AR Face Filter State (Instagram Butterfly, Flower Crown, etc.)
  const [selectedFaceEffect, setSelectedFaceEffect] = useState('butterfly_ig');
  const [showEffectsBar, setShowEffectsBar] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Real-Time Face Tracking & Calibration State
  const [faceAutoTracking, setFaceAutoTracking] = useState(true);
  const [detectedFace, setDetectedFace] = useState({
    cx: 0.50,
    cy: 0.62,
    fw: 0.24,
    fh: 0.32,
    top: 0.46,
    bottom: 0.78
  });
  const [faceScale, setFaceScale] = useState(1.0); // 0.6 to 1.6
  const [faceOffsetY, setFaceOffsetY] = useState(0); // -0.3 to +0.3
  const [faceOffsetX, setFaceOffsetX] = useState(0); // -0.3 to +0.3

  // Effective Dynamic AR Face Anchor (Combines real-time detection + manual nudges)
  const baseTop = detectedFace.top != null ? detectedFace.top : (detectedFace.cy - detectedFace.fh * 0.5);
  const baseBottom = detectedFace.bottom != null ? detectedFace.bottom : (detectedFace.cy + detectedFace.fh * 0.5);

  const faceAnchor = {
    cx: Math.max(0.08, Math.min(0.92, detectedFace.cx + faceOffsetX)),
    cy: Math.max(0.08, Math.min(0.92, detectedFace.cy + faceOffsetY)),
    fw: Math.max(0.12, Math.min(0.65, detectedFace.fw * faceScale)),
    fh: Math.max(0.16, Math.min(0.85, detectedFace.fh * faceScale)),
    top: Math.max(0.02, Math.min(0.85, baseTop + faceOffsetY)),
    bottom: Math.max(0.15, Math.min(0.98, baseBottom + faceOffsetY))
  };

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const focusTimerRef = useRef(null);

  useEffect(() => {
    if (typeof targetSlot === 'number') {
      setCurrentSlotIndex(targetSlot);
    }
  }, [targetSlot]);

  useEffect(() => {
    if (isOpen) {
      setViewMode('camera');
      setPreviewShot(null);
    }
  }, [isOpen]);

  // Keep video element synced with stream whenever switching between camera and selection views
  useEffect(() => {
    if (videoRef.current && stream && videoRef.current.srcObject !== stream) {
      videoRef.current.srcObject = stream;
    }
  }, [viewMode, stream]);

  // Apply hardware-level Continuous Auto-Focus, Auto-Exposure & Auto-White-Balance
  const applyHardwareCameraEnhancements = async (mediaStream, point = { x: 0.5, y: 0.5 }) => {
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

  const triggerAutoFocusLock = (point = focusPoint) => {
    setFocusPoint(point);
    setFocusState('locking');
    setShowFocusBox(true);

    if (stream) {
      applyHardwareCameraEnhancements(stream, point);
    }

    if (videoRef.current && videoRef.current.readyState >= 2) {
      setSceneInfo(
        analyzeVideoScene(videoRef.current, point, {
          exposure: manualExposure,
          autoLight
        })
      );
    }

    if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
    focusTimerRef.current = setTimeout(() => {
      setFocusState('locked');
    }, 420);
  };

  const startCamera = async (mode = facingMode) => {
    setCameraError(null);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    try {
      let mediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: mode,
            width: { ideal: 2560, min: 1280 },
            height: { ideal: 1920, min: 720 },
            aspectRatio: { ideal: 4 / 3 },
            frameRate: { ideal: 30 }
          },
          audio: false
        });
      } catch (firstErr) {
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: mode,
              width: { ideal: 1920 },
              height: { ideal: 1440 }
            },
            audio: false
          });
        } catch (secondErr) {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
        }
      }

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      await applyHardwareCameraEnhancements(mediaStream, { x: 0.5, y: 0.5 });
      triggerAutoFocusLock({ x: 0.5, y: 0.5 });
    } catch (err) {
      console.error('Camera Error:', err);
      setCameraError(
        'Kamera tidak dapat diakses. Pastikan izin kamera aktif atau gunakan tombol Upload Foto.'
      );
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

  // Continuous Real-Time Gentle Face Exposure Analyzer (every 300ms)
  useEffect(() => {
    if (!isOpen || cameraError || viewMode !== 'camera') return;
    if (videoRef.current && videoRef.current.readyState >= 2) {
      setSceneInfo(
        analyzeVideoScene(videoRef.current, focusPoint, {
          exposure: manualExposure,
          autoLight
        })
      );
    }
    const interval = setInterval(() => {
      if (videoRef.current && videoRef.current.readyState >= 2) {
        const res = analyzeVideoScene(videoRef.current, focusPoint, {
          exposure: manualExposure,
          autoLight
        });
        setSceneInfo(res);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [isOpen, cameraError, focusPoint, manualExposure, autoLight, viewMode]);

  // Continuous Real-Time Computer Vision Face Tracking (250ms interval)
  useEffect(() => {
    if (!isOpen || cameraError || viewMode !== 'camera' || !faceAutoTracking || selectedFaceEffect === 'none') return;

    let isCancelled = false;
    const interval = setInterval(async () => {
      if (!videoRef.current || videoRef.current.readyState < 2) return;
      try {
        const detected = await detectFaceInVideo(videoRef.current);
        if (detected && !isCancelled) {
          const targetCx = isMirrored ? 1 - detected.cx : detected.cx;
          setDetectedFace((prev) => ({
            cx: prev.cx * 0.72 + targetCx * 0.28,
            cy: prev.cy * 0.72 + detected.cy * 0.28,
            fw: prev.fw * 0.72 + detected.fw * 0.28,
            fh: prev.fh * 0.72 + detected.fh * 0.28,
            top: prev.top != null && detected.top != null ? prev.top * 0.72 + detected.top * 0.28 : detected.top,
            bottom: prev.bottom != null && detected.bottom != null ? prev.bottom * 0.72 + detected.bottom * 0.28 : detected.bottom
          }));
        }
      } catch (e) {}
    }, 250);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [isOpen, cameraError, viewMode, faceAutoTracking, selectedFaceEffect, isMirrored]);

  const handleToggleFacing = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    setIsMirrored(nextMode === 'user');
    startCamera(nextMode);
  };

  const handleViewfinderTap = (e) => {
    if (cameraError || isCountingDown) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = Math.min(0.88, Math.max(0.12, (e.clientX - rect.left) / rect.width));
    const clickY = Math.min(0.85, Math.max(0.15, (e.clientY - rect.top) / rect.height));
    triggerAutoFocusLock({ x: clickX, y: clickY });

    // Instantly snap filter anchor directly to where user tapped!
    setFaceAutoTracking(false);
    setDetectedFace((prev) => ({
      ...prev,
      cx: clickX,
      cy: clickY,
      top: clickY - prev.fh * 0.5,
      bottom: clickY + prev.fh * 0.5
    }));
    setFaceOffsetX(0);
    setFaceOffsetY(0);
  };

  // Capture frame at Ultra-HD 4:3 resolution preserving 100% native camera sharpness & colors
  const captureFrame = (slotToFill, shouldAssignSlot = true) => {
    if (!videoRef.current) return null;
    const video = videoRef.current;
    const vw = video.videoWidth || 1600;
    const vh = video.videoHeight || 1200;

    const targetRatio = 4 / 3;
    const videoRatio = vw / vh;
    let sx = 0;
    let sy = 0;
    let sw = vw;
    let sh = vh;

    if (videoRatio > targetRatio) {
      sw = vh * targetRatio;
      sx = (vw - sw) / 2;
    } else {
      sh = vw / targetRatio;
      sy = (vh - sh) / 2;
    }

    const outW = Math.min(2400, Math.max(1600, Math.round(sw)));
    const outH = Math.round(outW * 0.75);

    const canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.save();
    if (isMirrored) {
      ctx.translate(outW, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, outW, outH);
    ctx.restore();

    const effectiveFocusPoint = {
      x: isMirrored ? 1 - focusPoint.x : focusPoint.x,
      y: focusPoint.y
    };
    processIntelligentCapture(ctx, outW, outH, {
      autoTone: true,
      focusPoint: effectiveFocusPoint,
      manualAdjust: {
        exposure: manualExposure,
        autoLight
      }
    });

    // Bake AR Face Filter onto captured high-res canvas (Instagram Butterfly, Flower Crown, etc.)
    if (selectedFaceEffect && selectedFaceEffect !== 'none') {
      renderFaceEffectToCanvas(ctx, outW, outH, selectedFaceEffect, faceAnchor);
    }

    setFlash(true);
    soundFX.playShutter();
    setTimeout(() => setFlash(false), 180);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.99);
    if (onAddSessionPhoto) {
      onAddSessionPhoto(dataUrl);
    }
    if (shouldAssignSlot && typeof slotToFill === 'number' && onPhotoCaptured) {
      onPhotoCaptured(dataUrl, slotToFill);
    }
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
      captureFrame(slot, true);
      await new Promise((r) => setTimeout(r, 800));
    }

    setIsCountingDown(false);
    soundFX.playCelebration();
    confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
    // Automatically open the Full-Screen Review & Template Selection view so the user can see their photos, take more, or swap slots!
    setViewMode('select');
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
    captureFrame(currentSlotIndex, true);
    setCurrentSlotIndex((prev) => (prev + 1) % totalSlots);
    setIsCountingDown(false);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 2200;
          let w = img.naturalWidth || 1600;
          let h = img.naturalHeight || 1200;
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
          const dataUrl = canvas.toDataURL('image/jpeg', 0.99);
          if (onAddSessionPhoto) {
            onAddSessionPhoto(dataUrl);
          }
          const targetIdx = (currentSlotIndex + idx) % totalSlots;
          onPhotoCaptured(dataUrl, targetIdx);
          if (idx === files.length - 1) {
            setCurrentSlotIndex((targetIdx + 1) % totalSlots);
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  // Assign any taken photo from the session gallery into the currently active Template Slot (and advance slot)
  const handleSelectPhotoForSlot = (photoUrl, explicitSlotIndex = currentSlotIndex) => {
    if (!photoUrl || !onPhotoCaptured) return;
    onPhotoCaptured(photoUrl, explicitSlotIndex);
    setCurrentSlotIndex((explicitSlotIndex + 1) % totalSlots);
  };

  if (!isOpen) return null;

  const isIOSWebKit =
    typeof navigator !== 'undefined' &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

  const userBrightness = filterSettings?.brightness || 0;
  const userContrast = filterSettings?.contrast || 0;
  const userSaturation = filterSettings?.saturation || 0;
  const totalBrightness = 1 + (userBrightness + (sceneInfo.boostNeeded ?? 0)) / 100;
  const totalContrast = 1 + (userContrast + (sceneInfo.contrastBoost ?? 0)) / 100;
  const totalSaturation = 1 + (userSaturation + (sceneInfo.saturationBoost ?? 0)) / 100;

  const liveVideoFilter = isIOSWebKit
    ? `brightness(${Math.max(0.85, Math.min(1.4, totalBrightness)).toFixed(2)}) contrast(${Math.max(0.9, Math.min(1.35, totalContrast)).toFixed(2)}) saturate(${Math.max(0, Math.min(1.45, totalSaturation)).toFixed(2)})`
    : `url(#pikubooth-live-isp) brightness(${(1 + userBrightness / 100).toFixed(2)}) contrast(${Math.max(0.9, Math.min(1.38, totalContrast)).toFixed(2)}) saturate(${Math.max(0, Math.min(1.48, totalSaturation)).toFixed(2)})`;

  const activeSlotsList = [...Array(totalSlots)].map((_, i) => photos[i] || null);

  return (
    <div
      className={`fixed inset-0 z-50 w-screen h-dvh flex flex-col overflow-hidden transition-colors duration-300 ${
        ringLightOn ? 'bg-amber-50 text-stone-900' : 'bg-stone-950 text-white'
      }`}
      style={{
        boxShadow: ringLightOn
          ? 'inset 0 0 90px 35px rgba(255, 244, 228, 0.95)'
          : undefined
      }}
    >
      {/* Pure Color-Neutral Exposure LUT + Row-Sum-1 Anti-Yellow Matrix */}
      <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
        <filter id="pikubooth-live-isp" colorInterpolationFilters="sRGB">
          <feComponentTransfer>
            <feFuncR type="table" tableValues={sceneInfo.tableR} />
            <feFuncG type="table" tableValues={sceneInfo.tableG} />
            <feFuncB type="table" tableValues={sceneInfo.tableB} />
          </feComponentTransfer>
          <feColorMatrix
            type="matrix"
            values={sceneInfo.colorMatrix || '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0'}
          />
        </filter>
      </svg>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* FULL-SCREEN TOP STUDIO HEADER */}
      <header
        className={`shrink-0 px-3 sm:px-6 py-2.5 sm:py-3 border-b flex items-center justify-between gap-2 ${
          ringLightOn
            ? 'bg-white/90 border-amber-200 text-stone-900'
            : 'bg-stone-900/90 border-white/10 text-white'
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              ringLightOn
                ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                : 'bg-white/10 hover:bg-white/15 text-stone-200'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kembali ke Template</span>
            <span className="sm:hidden">Tutup</span>
          </button>

          <div className="hidden md:flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-tight">
              piku<span className="text-rose-500">booth.</span> Studio
            </span>
            {activeTemplate?.name && (
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                  ringLightOn ? 'bg-stone-100 text-stone-600' : 'bg-white/10 text-stone-300'
                }`}
              >
                Template: {activeTemplate.name} ({totalSlots} Slot)
              </span>
            )}
          </div>
        </div>

        {/* Center Mode Switcher: 1. Kamera Full Layar vs 2. Review & Pilih Foto ke Template */}
        <div
          className={`flex items-center p-1 rounded-2xl text-xs font-bold ${
            ringLightOn ? 'bg-stone-200/80' : 'bg-black/50 border border-white/10'
          }`}
        >
          <button
            onClick={() => setViewMode('camera')}
            className={`px-3 sm:px-4 py-1.5 rounded-xl flex items-center gap-1.5 transition ${
              viewMode === 'camera'
                ? 'bg-rose-500 text-white shadow-xs'
                : ringLightOn
                ? 'text-stone-600 hover:text-stone-900'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>1. Ambil Foto</span>
          </button>

          <button
            onClick={() => setViewMode('select')}
            className={`px-3 sm:px-4 py-1.5 rounded-xl flex items-center gap-1.5 transition ${
              viewMode === 'select'
                ? 'bg-rose-500 text-white shadow-xs'
                : ringLightOn
                ? 'text-stone-600 hover:text-stone-900'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Images className="w-3.5 h-3.5" />
            <span>2. Pilih Foto ({sessionPhotos.length})</span>
          </button>
        </div>

        {/* Right Controls: Ring Light & Finish Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRingLightOn(!ringLightOn)}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
              ringLightOn
                ? 'bg-amber-400 text-stone-950 border-amber-400 font-bold shadow-xs'
                : 'bg-white/10 text-stone-200 border-white/15 hover:bg-white/15'
            }`}
            title="Lampu layar tambahan untuk ruangan gelap"
          >
            <Sun className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ring Light {ringLightOn ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Selesai</span>
          </button>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* VIEW 1: FULL-SCREEN CAMERA STUDIO + LIVE GALLERY & SLOT SIDEBAR       */}
      {/* ===================================================================== */}
      <div
        className={`flex-1 min-h-0 flex flex-col lg:flex-row gap-3 sm:gap-4 p-2.5 sm:p-4 overflow-y-auto lg:overflow-hidden ${
          viewMode === 'camera' ? '' : 'hidden'
        }`}
      >
        {/* Main Full-Screen Camera Stage */}
        <div className="flex-1 min-h-0 flex flex-col justify-between gap-2.5">
          {/* Huge 4:3 Viewfinder Container */}
          <div className="flex-1 min-h-[260px] flex items-center justify-center overflow-hidden">
            <div
              onClick={handleViewfinderTap}
              className="relative w-full h-full max-h-full aspect-[4/3] max-w-[1080px] mx-auto bg-stone-900 rounded-2xl sm:rounded-3xl overflow-hidden flex items-center justify-center cursor-crosshair select-none border border-white/10 shadow-2xl"
              style={{
                boxShadow: ringLightOn
                  ? '0 0 0 10px rgba(255, 248, 235, 0.95), 0 20px 60px rgba(0,0,0,0.25)'
                  : undefined
              }}
              title="Klik pada wajah untuk mengunci Auto-Fokus & menyesuaikan cahaya otomatis"
            >
              {flash && <div className="absolute inset-0 bg-white z-40" />}

              {isCountingDown && countdownNum > 0 && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/25 backdrop-blur-[1px]">
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white/90 bg-black/50 px-3 py-1 rounded-full mb-2">
                    Siap Pose • Slot #{currentSlotIndex + 1}
                  </span>
                  <span className="text-7xl sm:text-9xl font-black text-white font-mono drop-shadow-2xl">
                    {countdownNum}
                  </span>
                </div>
              )}

              {cameraError ? (
                <div className="p-6 text-center cursor-default">
                  <CameraOff className="w-10 h-10 text-stone-400 mx-auto mb-2.5" />
                  <p className="text-stone-300 text-xs sm:text-sm mb-4 max-w-md mx-auto">
                    {cameraError}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Foto dari Perangkat</span>
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

                  {/* AR Real-Time Animated Face Effect Overlay */}
                  {selectedFaceEffect !== 'none' && (
                    <FaceEffectOverlay
                      effectId={selectedFaceEffect}
                      anchor={faceAnchor}
                      isMirrored={isMirrored}
                    />
                  )}

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
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 relative flex items-center justify-center transition-colors ${
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

                  {/* Floating Instagram-Style AR Face Filter Carousel with Category Tabs */}
                  {showEffectsBar && (
                    <div
                      className="absolute bottom-11 sm:bottom-12 inset-x-0 z-30 px-2 sm:px-4 flex flex-col items-center gap-1.5 pointer-events-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Top Bar: Category Tabs + Active Filter Indicator */}
                      <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-full">
                        {/* Active filter name pill */}
                        <div className="bg-black/80 backdrop-blur-md text-white/95 px-3 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold border border-white/15 flex items-center gap-1.5 shadow-lg">
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          <span>
                            Filter:{' '}
                            <strong className="text-rose-400">
                              {FACE_EFFECTS.find((f) => f.id === selectedFaceEffect)?.name || 'Normal'}
                            </strong>
                          </span>
                          {selectedFaceEffect !== 'none' && (
                            <span className="text-stone-300 text-[10px] hidden sm:inline">• Klik layar untuk pas-kan posisi</span>
                          )}
                        </div>

                        {/* Category Filter Pills */}
                        <div className="flex items-center gap-1 p-0.5 bg-black/75 backdrop-blur-md rounded-xl border border-white/15 overflow-x-auto no-scrollbar shadow-md">
                          {EFFECT_CATEGORIES.map((cat) => {
                            const isCatActive = selectedCategory === cat.id;
                            const count =
                              cat.id === 'all'
                                ? FACE_EFFECTS.length - 1
                                : FACE_EFFECTS.filter((e) => e.category === cat.id).length;
                            return (
                              <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                                  isCatActive
                                    ? 'bg-rose-500 text-white shadow-2xs'
                                    : 'text-stone-300 hover:text-white hover:bg-white/10'
                                }`}
                              >
                                <span>{cat.icon} {cat.label}</span>
                                <span className="opacity-70 text-[9px] ml-0.5">({count})</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Filter Buttons Carousel */}
                      <div className="flex items-center gap-1.5 p-1 bg-black/75 backdrop-blur-md rounded-2xl border border-white/20 max-w-full overflow-x-auto no-scrollbar shadow-2xl">
                        {(selectedCategory === 'all'
                          ? FACE_EFFECTS
                          : FACE_EFFECTS.filter((e) => e.id === 'none' || e.category === selectedCategory)
                        ).map((eff) => {
                          const isSelected = selectedFaceEffect === eff.id;
                          return (
                            <button
                              key={eff.id}
                              onClick={() => setSelectedFaceEffect(eff.id)}
                              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                                isSelected
                                  ? 'bg-rose-500 text-white shadow-md scale-105 ring-2 ring-rose-400/60'
                                  : 'text-stone-300 hover:text-white hover:bg-white/10'
                              }`}
                              title={eff.description}
                            >
                              <span className="text-base leading-none">{eff.badge}</span>
                              <span className="text-[11px]">{eff.shortLabel}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Interactive Calibration & Face Fit Controls */}
                      {selectedFaceEffect !== 'none' && (
                        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 p-1 px-2 bg-black/80 backdrop-blur-md rounded-xl border border-white/20 text-white text-[10px] sm:text-[11px] shadow-lg max-w-full">
                          <span className="font-bold text-amber-300">Posisi:</span>
                          <button
                            onClick={() => {
                              setFaceAutoTracking(false);
                              setFaceOffsetY((prev) => prev - 0.03);
                            }}
                            className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 font-bold active:scale-95 transition"
                            title="Geser Efek Naik"
                          >
                            ▲ Naik
                          </button>
                          <button
                            onClick={() => {
                              setFaceAutoTracking(false);
                              setFaceOffsetY((prev) => prev + 0.03);
                            }}
                            className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 font-bold active:scale-95 transition"
                            title="Geser Efek Turun"
                          >
                            ▼ Turun
                          </button>
                          <button
                            onClick={() => {
                              setFaceAutoTracking(false);
                              setFaceOffsetX((prev) => prev - 0.03);
                            }}
                            className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 font-bold active:scale-95 transition"
                            title="Geser Efek Kiri"
                          >
                            ◀ Kiri
                          </button>
                          <button
                            onClick={() => {
                              setFaceAutoTracking(false);
                              setFaceOffsetX((prev) => prev + 0.03);
                            }}
                            className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 font-bold active:scale-95 transition"
                            title="Geser Efek Kanan"
                          >
                            ▶ Kanan
                          </button>

                          <div className="h-3 w-px bg-white/20 mx-0.5 hidden sm:block" />

                          <span className="font-bold text-amber-300">Ukuran:</span>
                          <button
                            onClick={() => setFaceScale((prev) => Math.max(0.6, Number((prev - 0.1).toFixed(2))))}
                            className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 font-bold active:scale-95 transition"
                            title="Kecilkan Ukuran Efek"
                          >
                            − Kecil
                          </button>
                          <span className="font-mono text-amber-300 w-7 text-center font-bold">
                            {Math.round(faceScale * 100)}%
                          </span>
                          <button
                            onClick={() => setFaceScale((prev) => Math.min(1.6, Number((prev + 0.1).toFixed(2))))}
                            className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 font-bold active:scale-95 transition"
                            title="Besarkan Ukuran Efek"
                          >
                            + Besar
                          </button>

                          <div className="h-3 w-px bg-white/20 mx-0.5 hidden sm:block" />

                          <button
                            onClick={() => {
                              setFaceOffsetX(0);
                              setFaceOffsetY(0);
                              setFaceScale(1.0);
                              setFaceAutoTracking(true);
                            }}
                            className="px-2 py-0.5 rounded-md bg-rose-500 hover:bg-rose-600 text-white font-bold active:scale-95 transition flex items-center gap-1 shadow-xs"
                            title="Kembalikan Posisi Otomatis ke Wajah"
                          >
                            <RefreshCw className="w-2.5 h-2.5" />
                            <span>Auto-Pas</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Live Auto-Focus & Auto-Cahaya Status Pill */}
                  <div className="absolute bottom-3 left-3 z-20 pointer-events-none flex items-center gap-1.5 bg-stone-900/75 backdrop-blur-xs text-white px-3 py-1 rounded-full text-[11px] font-semibold border border-white/15">
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

                  {/* Active Slot Indicator Pill in Bottom-Right */}
                  <div className="absolute bottom-3 right-3 z-20 pointer-events-none bg-stone-900/75 backdrop-blur-xs text-white px-3 py-1 rounded-full text-[11px] font-bold border border-white/15">
                    Target: Slot #{currentSlotIndex + 1} dari {totalSlots}
                  </div>
                </>
              )}

              {/* Top-Left Camera Controls: Flip, Mirror, Re-Focus, Filter Toggle */}
              {!cameraError && (
                <div
                  className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={handleToggleFacing}
                    className="p-2.5 rounded-full bg-stone-900/65 hover:bg-stone-900/85 text-white backdrop-blur-xs transition"
                    title="Putar Kamera"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsMirrored(!isMirrored)}
                    className="p-2.5 rounded-full bg-stone-900/65 hover:bg-stone-900/85 text-white backdrop-blur-xs transition"
                    title="Mirror"
                  >
                    <FlipHorizontal className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => triggerAutoFocusLock({ x: 0.5, y: 0.5 })}
                    className="px-3 py-1.5 rounded-full bg-stone-900/65 hover:bg-stone-900/85 text-white backdrop-blur-xs transition flex items-center gap-1.5 text-xs font-semibold"
                    title="Kunci Ulang Auto-Fokus & Cahaya"
                  >
                    <Focus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Auto-Fokus</span>
                  </button>
                  <button
                    onClick={() => setShowEffectsBar(!showEffectsBar)}
                    className={`px-3 py-1.5 rounded-full backdrop-blur-xs transition flex items-center gap-1.5 text-xs font-semibold ${
                      selectedFaceEffect !== 'none'
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'bg-stone-900/65 hover:bg-stone-900/85 text-white'
                    }`}
                    title="Buka / Tutup Pilihan Filter Wajah"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Filter {selectedFaceEffect !== 'none' ? 'Aktif' : ''}</span>
                  </button>
                </div>
              )}

              {/* Top-Right Timer Toggle */}
              <div
                className="absolute top-3 right-3 z-20 flex bg-stone-900/65 backdrop-blur-xs rounded-full p-0.5 text-xs text-white border border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                {[3, 5].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setDelaySec(sec)}
                    className={`px-2.5 py-1 rounded-full font-mono transition ${
                      delaySec === sec ? 'bg-white text-stone-900 font-bold' : 'text-stone-300'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Camera Control Dock (Exposure + Shutter Buttons) */}
          <div
            className={`shrink-0 rounded-2xl p-2.5 sm:p-3 border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 ${
              ringLightOn
                ? 'bg-white border-amber-200 text-stone-800'
                : 'bg-stone-900/90 border-white/10 text-white'
            }`}
          >
            {/* Exposure Mode & Slider */}
            {!cameraError && (
              <div className="flex items-center gap-2.5 flex-1 max-w-md">
                <div
                  className={`flex items-center p-0.5 rounded-xl shrink-0 ${
                    ringLightOn ? 'bg-stone-100' : 'bg-black/50 border border-white/10'
                  }`}
                >
                  <button
                    onClick={() => setAutoLight(true)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                      autoLight
                        ? 'bg-rose-500 text-white shadow-2xs'
                        : ringLightOn
                        ? 'text-stone-500'
                        : 'text-stone-400'
                    }`}
                  >
                    Auto-Cahaya
                  </button>
                  <button
                    onClick={() => {
                      setAutoLight(false);
                      setManualExposure(0);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                      !autoLight
                        ? 'bg-rose-500 text-white shadow-2xs'
                        : ringLightOn
                        ? 'text-stone-500'
                        : 'text-stone-400'
                    }`}
                  >
                    Asli Kamera
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-1">
                  <span className="text-[11px] font-semibold opacity-75 shrink-0">Cahaya</span>
                  <input
                    type="range"
                    min="-25"
                    max="25"
                    value={manualExposure}
                    onChange={(e) => setManualExposure(Number(e.target.value))}
                    className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                  <span className="font-mono text-[10px] opacity-75 w-7 text-right">
                    {manualExposure > 0 ? `+${manualExposure}` : manualExposure}
                  </span>
                </div>
              </div>
            )}

            {/* Primary Shutter & Gallery Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                onClick={() => setShowEffectsBar(!showEffectsBar)}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                  selectedFaceEffect !== 'none'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : ringLightOn
                    ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    : 'bg-white/10 hover:bg-white/15 text-white'
                }`}
                title="Pilih Efek Filter Wajah (Kupu-kupu, Bunga, Kucing, dll)"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Efek:</span>
                <span>{FACE_EFFECTS.find((f) => f.id === selectedFaceEffect)?.shortLabel || 'Filter'}</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                  ringLightOn
                    ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    : 'bg-white/10 hover:bg-white/15 text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-rose-400" />
                <span>Upload</span>
              </button>

              <button
                onClick={triggerSingleShot}
                disabled={isCountingDown}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50 ${
                  ringLightOn
                    ? 'bg-stone-900 hover:bg-black text-white'
                    : 'bg-white text-stone-950 hover:bg-stone-200'
                }`}
              >
                <Camera className="w-4 h-4 text-rose-500" />
                <span>Jepret 1 Foto (Slot #{currentSlotIndex + 1})</span>
              </button>

              <button
                onClick={startBurstSequence}
                disabled={isCountingDown}
                className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Auto {totalSlots}x Foto</span>
              </button>

              {sessionPhotos.length > 0 && (
                <button
                  onClick={() => setViewMode('select')}
                  className="px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Images className="w-3.5 h-3.5" />
                  <span>Pilih Foto ({sessionPhotos.length})</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right / Bottom Live Tray: Template Slots + Taken Session Photos */}
        <aside
          className={`w-full lg:w-80 xl:w-96 shrink-0 rounded-2xl p-3 border flex flex-col gap-3 lg:overflow-y-auto ${
            ringLightOn
              ? 'bg-white border-amber-200 text-stone-800'
              : 'bg-stone-900/90 border-white/10 text-white'
          }`}
        >
          {/* Section A: Template Slots */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold">
                Slot Template ({totalSlots} Frame)
              </span>
              <span className="text-[10px] opacity-65">
                Klik slot untuk pilih target foto
              </span>
            </div>

            <div className="grid grid-cols-4 lg:grid-cols-2 gap-2">
              {activeSlotsList.map((slotUrl, idx) => {
                const isSelected = currentSlotIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setCurrentSlotIndex(idx)}
                    className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 cursor-pointer transition group ${
                      isSelected
                        ? 'border-rose-500 ring-2 ring-rose-500/40'
                        : 'border-white/15 hover:border-white/35'
                    }`}
                  >
                    {slotUrl ? (
                      <img
                        src={slotUrl}
                        alt={`Slot ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-stone-800/70 flex items-center justify-center text-[10px] text-stone-400 font-semibold">
                        Kosong
                      </div>
                    )}
                    <div
                      className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                        isSelected
                          ? 'bg-rose-500 text-white'
                          : 'bg-black/65 text-white'
                      }`}
                    >
                      Slot #{idx + 1}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section B: All Taken Photos in Session (Unlimited Takes!) */}
          <div className="flex-1 flex flex-col min-h-0 border-t border-white/10 pt-2.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold">
                Hasil Jepretan Kamu ({sessionPhotos.length})
              </span>
              {sessionPhotos.length > 0 && (
                <button
                  onClick={() => setViewMode('select')}
                  className="text-[11px] font-bold text-rose-400 hover:text-rose-300 underline"
                >
                  Buka Layar Pilih Foto
                </button>
              )}
            </div>

            {sessionPhotos.length === 0 ? (
              <div className="flex-1 min-h-[100px] rounded-xl border border-dashed border-white/15 flex flex-col items-center justify-center p-4 text-center">
                <Camera className="w-5 h-5 text-stone-500 mb-1.5" />
                <p className="text-[11px] text-stone-400">
                  Belum ada foto yang dijepret di sesi ini. Tekan <b>Jepret 1 Foto</b> atau <b>Auto {totalSlots}x</b> sebanyak yang kamu mau!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-2 gap-2 overflow-y-auto max-h-56 lg:max-h-none pr-0.5">
                {[...sessionPhotos].reverse().map((shot, rIdx) => {
                  const shotNumber = sessionPhotos.length - rIdx;
                  const usedInSlots = activeSlotsList
                    .map((u, sIdx) => (u === shot.url ? sIdx + 1 : null))
                    .filter(Boolean);

                  return (
                    <div
                      key={shot.id}
                      onClick={() => handleSelectPhotoForSlot(shot.url, currentSlotIndex)}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/15 hover:border-rose-400 cursor-pointer group"
                      title={`Klik untuk masukkan ke Slot #${currentSlotIndex + 1}`}
                    >
                      <img
                        src={shot.url}
                        alt={`Take ${shotNumber}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-white">
                        Take #{shotNumber}
                      </div>
                      {usedInSlots.length > 0 && (
                        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-emerald-500 text-[9px] font-bold text-white">
                          Slot {usedInSlots.join(', ')}
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewShot({ ...shot, number: shotNumber });
                        }}
                        className="absolute top-1 right-1 p-1 rounded bg-black/65 hover:bg-black text-white opacity-85 group-hover:opacity-100"
                        title="Lihat ukuran besar"
                      >
                        <Maximize2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ===================================================================== */}
      {/* VIEW 2: FULL-SCREEN PHOTO REVIEW, RETAKE & TEMPLATE SLOT SELECTOR     */}
      {/* ===================================================================== */}
      {viewMode === 'select' && (
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 p-3 sm:p-6 overflow-y-auto lg:overflow-hidden">
          {/* Left Panel: Active Template Slots Preview & Assignment */}
          <div
            className={`w-full lg:w-96 shrink-0 rounded-2xl p-4 border flex flex-col justify-between gap-4 lg:overflow-y-auto ${
              ringLightOn
                ? 'bg-white border-amber-200 text-stone-900'
                : 'bg-stone-900/90 border-white/10 text-white'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-extrabold">
                  Susunan Foto di Template
                </h2>
                {onClearSlots && (
                  <button
                    onClick={() => {
                      onClearSlots();
                      setCurrentSlotIndex(0);
                    }}
                    className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold"
                  >
                    Kosongkan Slot
                  </button>
                )}
              </div>
              <p className="text-[11px] opacity-70 mb-3">
                Pilih nomor slot di bawah, lalu klik foto mana saja dari galeri jepretanmu untuk dimasukkan ke dalam template <b>{activeTemplate?.name || 'Pilihanmu'}</b>.
              </p>

              {/* Template Slots Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {activeSlotsList.map((slotUrl, idx) => {
                  const isSelected = currentSlotIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setCurrentSlotIndex(idx)}
                      className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 cursor-pointer transition ${
                        isSelected
                          ? 'border-rose-500 ring-2 ring-rose-500/40'
                          : 'border-white/15 hover:border-white/35'
                      }`}
                    >
                      {slotUrl ? (
                        <img
                          src={slotUrl}
                          alt={`Slot ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-stone-800/80 flex flex-col items-center justify-center text-stone-400 p-2 text-center">
                          <span className="text-xs font-bold">Slot #{idx + 1}</span>
                          <span className="text-[10px] opacity-75">Klik foto di galeri</span>
                        </div>
                      )}

                      <div
                        className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                          isSelected
                            ? 'bg-rose-500 text-white'
                            : 'bg-black/70 text-white'
                        }`}
                      >
                        Slot #{idx + 1} {isSelected ? '• Aktif' : ''}
                      </div>

                      {slotUrl && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPhotoCaptured(null, idx);
                            setCurrentSlotIndex(idx);
                          }}
                          className="absolute top-2 right-2 p-1 rounded-md bg-black/65 hover:bg-rose-600 text-white transition"
                          title="Keluarkan foto dari slot ini"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions in Slot Panel: Take More Photos or Finish */}
            <div className="flex flex-col gap-2 pt-3 border-t border-white/10">
              <button
                onClick={() => setViewMode('camera')}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-2 border border-white/15 transition"
              >
                <Camera className="w-4 h-4 text-rose-400" />
                <span>+ Ambil Foto Lagi (Take Tambahan)</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg transition"
              >
                <Check className="w-4 h-4" />
                <span>Selesai & Masukkan ke Template</span>
              </button>
            </div>
          </div>

          {/* Right Panel: Full Gallery of All Taken Photos */}
          <div
            className={`flex-1 min-h-0 rounded-2xl p-4 border flex flex-col ${
              ringLightOn
                ? 'bg-white border-amber-200 text-stone-900'
                : 'bg-stone-900/90 border-white/10 text-white'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <h2 className="text-sm sm:text-base font-extrabold">
                  Galeri Hasil Jepretan Sesi Ini ({sessionPhotos.length} Foto)
                </h2>
                <p className="text-xs opacity-70">
                  Klik pada foto mana saja untuk memasukkannya ke <b>Slot #{currentSlotIndex + 1}</b>, atau klik <b>+ Ambil Foto Lagi</b> jika ingin menambah pose baru.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold flex items-center gap-1.5 border border-white/15 transition"
                >
                  <Upload className="w-3.5 h-3.5 text-rose-400" />
                  <span>Upload Foto</span>
                </button>
                <button
                  onClick={() => setViewMode('camera')}
                  className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Take Foto Lagi</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                {/* Card to Take More Photos */}
                <button
                  onClick={() => setViewMode('camera')}
                  className="aspect-[4/3] rounded-2xl border-2 border-dashed border-rose-500/50 hover:border-rose-400 bg-rose-500/10 hover:bg-rose-500/15 flex flex-col items-center justify-center gap-1.5 p-4 text-center transition cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md">
                    <Camera className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold text-rose-300">
                    + Ambil Foto Lagi
                  </span>
                  <span className="text-[10px] text-stone-400">
                    Tambah jepretan baru tanpa menghapus foto sebelumnya
                  </span>
                </button>

                {[...sessionPhotos].reverse().map((shot, rIdx) => {
                  const shotNumber = sessionPhotos.length - rIdx;
                  const usedInSlots = activeSlotsList
                    .map((u, sIdx) => (u === shot.url ? sIdx + 1 : null))
                    .filter(Boolean);

                  return (
                    <div
                      key={shot.id}
                      onClick={() => handleSelectPhotoForSlot(shot.url, currentSlotIndex)}
                      className={`relative aspect-[4/3] rounded-2xl overflow-hidden border-2 cursor-pointer transition group ${
                        usedInSlots.length > 0
                          ? 'border-emerald-400 ring-2 ring-emerald-400/30'
                          : 'border-white/15 hover:border-rose-400'
                      }`}
                    >
                      <img
                        src={shot.url}
                        alt={`Take ${shotNumber}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-black/75 text-[10px] font-bold text-white">
                          Take #{shotNumber}
                        </span>
                        {usedInSlots.length > 0 && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-[10px] font-extrabold text-white">
                            Di Slot {usedInSlots.join(', ')}
                          </span>
                        )}
                      </div>

                      {/* Top-Right Zoom & Delete Buttons */}
                      <div
                        className="absolute top-2 right-2 flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setPreviewShot({ ...shot, number: shotNumber })}
                          className="p-1.5 rounded-lg bg-black/70 hover:bg-black text-white transition"
                          title="Perbesar Foto"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                        {onRemoveSessionPhoto && (
                          <button
                            onClick={() => onRemoveSessionPhoto(shot.id)}
                            className="p-1.5 rounded-lg bg-black/70 hover:bg-rose-600 text-white transition"
                            title="Hapus Jepretan Ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Bottom Action Bar on Photo Card */}
                      <div
                        className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/85 via-black/50 to-transparent flex items-center justify-between gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleSelectPhotoForSlot(shot.url, currentSlotIndex)}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold text-center transition"
                        >
                          Masukkan ke Slot #{currentSlotIndex + 1}
                        </button>
                        {onFillAllSlots && (
                          <button
                            onClick={() => onFillAllSlots(shot.url)}
                            className="py-1.5 px-2 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[10px] font-semibold transition"
                            title="Pakai foto ini untuk semua slot"
                          >
                            Semua Slot
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* FULL-SCREEN SINGLE PHOTO LIGHTBOX PREVIEW (PERBESAR FOTO)             */}
      {/* ===================================================================== */}
      {previewShot && (
        <div
          onClick={() => setPreviewShot(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full flex flex-col items-center gap-3"
          >
            <div className="w-full flex items-center justify-between text-white">
              <span className="text-sm font-bold">
                Preview Take #{previewShot.number} ({previewShot.createdAt})
              </span>
              <button
                onClick={() => setPreviewShot(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <img
              src={previewShot.url}
              alt="Preview"
              className="max-h-[72dvh] w-auto rounded-2xl border border-white/20 shadow-2xl object-contain"
            />

            <div className="flex flex-wrap items-center justify-center gap-2">
              {[...Array(totalSlots)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleSelectPhotoForSlot(previewShot.url, idx);
                    setPreviewShot(null);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition"
                >
                  Masukkan ke Slot #{idx + 1}
                </button>
              ))}
              <button
                onClick={() => {
                  setPreviewShot(null);
                  setViewMode('camera');
                }}
                className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition"
              >
                Ambil Foto Lagi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
