import React, { useState, useEffect } from 'react';
import { Download, Printer, Check, X, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { toSvg, toCanvas } from 'html-to-image';
import { drawPhotoWithFiltersToCanvas } from '../utils/filterEngine';
import confetti from 'canvas-confetti';

const TINY_TRANSPARENT_GIF =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export default function ExportModal({
  isOpen,
  onClose,
  targetRef,
  templateName = 'Photobooth',
  filterSettings
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [pngBlobUrl, setPngBlobUrl] = useState(null);
  const [jpegBlobUrl, setJpegBlobUrl] = useState(null);
  const [pngFile, setPngFile] = useState(null);
  const [jpegFile, setJpegFile] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(null); // 'png' | 'jpeg' | null

  const baseSlug =
    templateName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'pikubooth';
  const pngFilename = `${baseSlug}-pikubooth-hd.png`;
  const jpegFilename = `${baseSlug}-pikubooth.jpg`;

  // Pre-generate both Ultra-HD PNG and JPEG Blobs as soon as modal opens
  // so clicking Download PNG Maksimal or Download JPEG is 100% instant & synchronous (works on iOS Safari & Android & PC)
  useEffect(() => {
    if (!isOpen) {
      setPreviewUrl(null);
      setPngFile(null);
      setJpegFile(null);
      setDownloadSuccess(null);
      if (pngBlobUrl) {
        URL.revokeObjectURL(pngBlobUrl);
        setPngBlobUrl(null);
      }
      if (jpegBlobUrl) {
        URL.revokeObjectURL(jpegBlobUrl);
        setJpegBlobUrl(null);
      }
      return;
    }

    let cancelled = false;

    const renderPhotoboothCanvas = async () => {
      if (!targetRef?.current) return;

      const originalNode = targetRef.current;
      const parentNode = originalNode.parentElement;
      const prevParentStyle = parentNode ? parentNode.getAttribute('style') : null;
      const prevOriginalStyle = originalNode.getAttribute('style');

      const hoverPrompts = Array.from(originalNode.querySelectorAll('[data-hover-prompt]'));
      const photoOverlays = Array.from(originalNode.querySelectorAll('[data-photo-overlay]'));
      const savedImgSrcs = [];
      const lockedDivs = [];

      const restoreDomState = () => {
        savedImgSrcs.forEach(({ imgEl, src }) => {
          imgEl.src = src;
        });
        lockedDivs.forEach(({ el, prevStyle }) => {
          if (prevStyle === null) {
            el.removeAttribute('style');
          } else {
            el.setAttribute('style', prevStyle);
          }
        });
        photoOverlays.forEach((el) => {
          el.style.display = '';
        });
        hoverPrompts.forEach((el) => {
          el.style.display = '';
        });
        if (prevOriginalStyle === null) {
          originalNode.removeAttribute('style');
        } else {
          originalNode.setAttribute('style', prevOriginalStyle);
        }
        if (parentNode) {
          if (prevParentStyle === null) {
            parentNode.removeAttribute('style');
          } else {
            parentNode.setAttribute('style', prevParentStyle);
          }
        }
      };

      try {
        setIsGenerating(true);

        // 1. Detach originalNode from mobile flexbox & scale wrapper so it renders at true 1:1 unclipped dimensions at (0, 0)
        if (parentNode) {
          parentNode.style.transition = 'none';
          parentNode.style.transform = 'none';
          parentNode.style.margin = '0px';
        }

        originalNode.style.transition = 'none';
        originalNode.style.transform = 'none';
        originalNode.style.position = 'fixed';
        originalNode.style.top = '0px';
        originalNode.style.left = '0px';
        originalNode.style.zIndex = '-10';
        originalNode.style.margin = '0px';
        originalNode.style.width = 'max-content';
        originalNode.style.height = 'max-content';
        originalNode.style.minWidth = 'max-content';
        originalNode.style.maxWidth = 'none';
        originalNode.style.maxHeight = 'none';
        originalNode.style.flexShrink = '0';

        // Hide interactive hover prompts during capture
        hoverPrompts.forEach((el) => {
          el.style.display = 'none';
        });

        // Force synchronous browser layout reflow + wait two frames for mobile WebKit
        void originalNode.offsetHeight;
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

        const rootRect = originalNode.getBoundingClientRect();
        const rootWidth = Math.round(rootRect.width || originalNode.offsetWidth || 540);
        const rootHeight = Math.round(rootRect.height || originalNode.offsetHeight || 760);

        // 2. Measure every photo slot at true 1:1 coordinates WHILE the real 4:3 photos are still loaded
        const slotNodes = Array.from(originalNode.querySelectorAll('[data-photo-slot]'));
        const slotsData = await Promise.all(
          slotNodes.map(async (slotEl) => {
            const rect = slotEl.getBoundingClientRect();
            const imgEl = slotEl.querySelector('img');
            const cs = window.getComputedStyle(slotEl);
            const radius = parseFloat(cs.borderRadius) || 2;
            const src = imgEl ? imgEl.getAttribute('src') || imgEl.src : null;

            const exactX = rect.left - rootRect.left;
            const exactY = rect.top - rootRect.top;
            const exactW = rect.width;
            const exactH = rect.height;

            let loadedImg = null;
            if (src && src !== TINY_TRANSPARENT_GIF) {
              loadedImg = await new Promise((resolve) => {
                const im = new Image();
                im.crossOrigin = 'anonymous';
                im.onload = () => resolve(im);
                im.onerror = () => {
                  if (imgEl && imgEl.complete && imgEl.naturalWidth > 0) {
                    resolve(imgEl);
                  } else {
                    resolve(null);
                  }
                };
                im.src = src;
              });
            }

            return {
              slotEl,
              imgEl,
              originalSrc: src,
              loadedImg,
              x: exactX,
              y: exactY,
              width: exactW,
              height: exactH,
              radius
            };
          })
        );

        // Measure floating badges / placed stickers at true 1:1 coordinates
        const floatingNodes = Array.from(originalNode.querySelectorAll('[data-floating-overlay]'));
        const floatingData = floatingNodes.map((el) => {
          const rect = el.getBoundingClientRect();
          return {
            el,
            x: rect.left - rootRect.left,
            y: rect.top - rootRect.top,
            width: rect.width,
            height: rect.height
          };
        });

        // 3. Freeze exact pixel width & height on all layout divs BEFORE swapping img.src to 1x1 GIF
        // This guarantees iOS Safari <foreignObject> never changes aspect-[4/3] slots into 1:1 squares or shifts headers!
        const allChildDivs = Array.from(originalNode.querySelectorAll('div')).filter(
          (el) =>
            !el.hasAttribute('data-floating-overlay') &&
            !el.hasAttribute('data-hover-prompt') &&
            !el.hasAttribute('data-photo-overlay')
        );
        const divMeasurements = allChildDivs.map((el) => {
          const r = el.getBoundingClientRect();
          return {
            el,
            prevStyle: el.getAttribute('style'),
            w: r.width,
            h: r.height
          };
        });
        divMeasurements.forEach(({ el, prevStyle, w, h }) => {
          if (w > 0 && h > 0) {
            lockedDivs.push({ el, prevStyle });
            el.style.width = `${w}px`;
            el.style.height = `${h}px`;
            el.style.minWidth = `${w}px`;
            el.style.maxWidth = `${w}px`;
            el.style.minHeight = `${h}px`;
            el.style.maxHeight = `${h}px`;
            el.style.flexShrink = '0';
            el.style.flexGrow = '0';
            el.style.boxSizing = 'border-box';
          }
        });

        // 4. Replace heavy base64 img src with 1x1 pixel so SVG foreignObject is lightweight
        slotsData.forEach((slot) => {
          if (slot.imgEl && slot.originalSrc) {
            savedImgSrcs.push({ imgEl: slot.imgEl, src: slot.originalSrc });
            slot.imgEl.src = TINY_TRANSPARENT_GIF;
          }
        });
        photoOverlays.forEach((el) => {
          el.style.display = 'none';
        });

        // Ultra-HD 4K Retina ratio (4.2x for Single Strip = ~1150px wide, 3.6x for Twin Strip = ~1920px wide)
        const ratio = rootWidth < 360 ? 4.2 : 3.6;
        const targetW = Math.round(rootWidth * ratio);
        const targetH = Math.round(rootHeight * ratio);
        const bgColor = '#f8f7f4';

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, targetW, targetH);

        try {
          const svgOptions = {
            quality: 1.0,
            pixelRatio: ratio,
            width: rootWidth,
            height: rootHeight,
            canvasWidth: targetW,
            canvasHeight: targetH,
            backgroundColor: bgColor,
            skipFonts: false,
            cacheBust: false,
            style: {
              position: 'relative',
              top: '0px',
              left: '0px',
              transform: 'none',
              transition: 'none',
              margin: '0px',
              width: `${rootWidth}px`,
              height: `${rootHeight}px`,
              minWidth: `${rootWidth}px`,
              maxWidth: `${rootWidth}px`,
              minHeight: `${rootHeight}px`,
              maxHeight: `${rootHeight}px`,
              flexShrink: '0',
              boxSizing: 'border-box'
            }
          };

          let svgDataUrl;
          try {
            svgDataUrl = await toSvg(originalNode, svgOptions);
          } catch (fontErr) {
            svgDataUrl = await toSvg(originalNode, { ...svgOptions, skipFonts: true });
          }

          // Upgrade SVG intrinsic width & height to targetW x targetH while keeping viewBox="0 0 rootWidth rootHeight"
          // This forces iOS Safari WebKit & Chrome to rasterize <foreignObject> vectorially at 4x Retina instead of upscaling 1x!
          const hiResSvgUrl = svgDataUrl
            .replace(`width%3D%22${rootWidth}%22`, `width%3D%22${targetW}%22`)
            .replace(`height%3D%22${rootHeight}%22`, `height%3D%22${targetH}%22`);

          const svgImg = await new Promise((resolve, reject) => {
            const im = new Image();
            im.crossOrigin = 'anonymous';
            im.onload = () => resolve(im);
            im.onerror = reject;
            im.src = hiResSvgUrl;
          });

          ctx.drawImage(svgImg, 0, 0, targetW, targetH);
        } catch (svgErr) {
          try {
            const fbCanvas = await toCanvas(originalNode, {
              quality: 1.0,
              pixelRatio: ratio,
              width: rootWidth,
              height: rootHeight,
              backgroundColor: bgColor,
              skipFonts: true
            });
            ctx.drawImage(fbCanvas, 0, 0, targetW, targetH);
          } catch (e) {}
        }

        // 5. Direct HTML5 Canvas 2D Photo Compositing: paint every photo at exact Ultra-HD slot coordinates
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        for (const slot of slotsData) {
          if (slot.loadedImg && slot.width > 0 && slot.height > 0) {
            drawPhotoWithFiltersToCanvas(
              ctx,
              slot.loadedImg,
              slot.x * ratio,
              slot.y * ratio,
              slot.width * ratio,
              slot.height * ratio,
              slot.radius * ratio,
              filterSettings
            );
          }
        }

        // 6. Re-stamp any floating badges or placed stickers on top of the photos
        for (const item of floatingData) {
          if (item.width > 0 && item.height > 0) {
            try {
              const floatCanvas = await toCanvas(item.el, {
                pixelRatio: ratio,
                skipFonts: true,
                cacheBust: false,
                style: {
                  position: 'static',
                  left: '0px',
                  top: '0px',
                  right: 'auto',
                  bottom: 'auto',
                  margin: '0px',
                  transform: 'none'
                }
              });
              ctx.drawImage(
                floatCanvas,
                item.x * ratio,
                item.y * ratio,
                item.width * ratio,
                item.height * ratio
              );
            } catch (e) {
              // Ignore individual sticker capture errors
            }
          }
        }

        // Restore DOM state immediately after capture
        restoreDomState();

        if (cancelled) return;

        // 7. Generate Preview + Both PNG (Kualitas Maksimal) & JPEG (Ukuran Ringan) Blob URLs
        const dataUrl = canvas.toDataURL('image/png');
        setPreviewUrl(dataUrl);

        canvas.toBlob((blob) => {
          if (!blob || cancelled) return;
          const url = URL.createObjectURL(blob);
          setPngBlobUrl(url);
          try {
            setPngFile(new File([blob], pngFilename, { type: 'image/png' }));
          } catch (e) {}
        }, 'image/png');

        canvas.toBlob(
          (blob) => {
            if (!blob || cancelled) return;
            const url = URL.createObjectURL(blob);
            setJpegBlobUrl(url);
            try {
              setJpegFile(new File([blob], jpegFilename, { type: 'image/jpeg' }));
            } catch (e) {}
          },
          'image/jpeg',
          0.98
        );

        setIsGenerating(false);
      } catch (err) {
        console.error('Export error:', err);
        restoreDomState();
        if (!cancelled) {
          setIsGenerating(false);
        }
      }
    };

    renderPhotoboothCanvas();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isIOS =
    typeof navigator !== 'undefined' &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

  const handleDownloadClick = async (e, formatType) => {
    const fileToShare = formatType === 'jpeg' ? jpegFile : pngFile;
    const fallbackUrl = formatType === 'jpeg' ? jpegBlobUrl || previewUrl : pngBlobUrl || previewUrl;
    const filename = formatType === 'jpeg' ? jpegFilename : pngFilename;

    if (isIOS && fileToShare && navigator.canShare && navigator.canShare({ files: [fileToShare] })) {
      e.preventDefault();
      try {
        await navigator.share({
          files: [fileToShare],
          title: templateName
        });
        triggerSuccessFeedback(formatType);
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return;
        if (fallbackUrl) {
          const link = document.createElement('a');
          link.href = fallbackUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    }
    triggerSuccessFeedback(formatType);
  };

  const triggerSuccessFeedback = (formatType) => {
    setDownloadSuccess(formatType);
    confetti({
      particleCount: 95,
      spread: 80,
      origin: { y: 0.55 }
    });
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl relative text-stone-800 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full bg-stone-100 hover:bg-stone-200 transition"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Title */}
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center shadow-xs mb-2.5">
          <Sparkles className="w-6 h-6" />
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-stone-800 mb-1">
          Simpan Photobooth Anda
        </h3>
        <p className="text-stone-500 text-xs mb-3.5 max-w-xs leading-relaxed">
          Export foto kualitas tinggi (Ultra-HD 300 DPI), siap cetak atau share ke Instagram & TikTok!
        </p>

        {/* Compact Live Preview Box */}
        <div className="w-full bg-stone-100 border border-stone-200/80 rounded-2xl p-2.5 mb-4 flex flex-col items-center justify-center min-h-[140px] max-h-[185px] overflow-hidden">
          {isGenerating || !previewUrl ? (
            <div className="flex flex-col items-center justify-center gap-2 py-5 text-stone-500">
              <Loader2 className="w-5 h-5 animate-spin text-rose-500" />
              <span className="text-xs font-medium">Menyiapkan kualitas maksimal (Ultra-HD)...</span>
            </div>
          ) : (
            <img
              src={previewUrl}
              alt="Preview Photobooth"
              className="max-h-[160px] w-auto object-contain rounded-lg shadow-xs select-auto"
            />
          )}
        </div>

        {/* Complete Download & Print Buttons */}
        <div className="w-full space-y-2.5">
          {/* 1. Download PNG (Kualitas Maksimal) */}
          {isGenerating || (!pngBlobUrl && !previewUrl) ? (
            <button
              disabled
              className="w-full py-3.5 px-4 rounded-xl bg-rose-500/60 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-wait"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memproses High-Res...</span>
            </button>
          ) : (
            <a
              href={pngBlobUrl || previewUrl}
              download={pngFilename}
              onClick={(e) => handleDownloadClick(e, 'png')}
              className="w-full py-3.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition no-underline"
            >
              {downloadSuccess === 'png' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>PNG Berhasil Tersimpan!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PNG (Kualitas Maksimal)</span>
                </>
              )}
            </a>
          )}

          {/* 2. Download JPEG (Ukuran File Ringan) */}
          {isGenerating || (!jpegBlobUrl && !previewUrl) ? (
            <button
              disabled
              className="w-full py-3 px-4 rounded-xl bg-stone-100 text-stone-400 font-semibold text-xs flex items-center justify-center gap-2 border border-stone-200 cursor-wait"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Download JPEG (Ukuran File Ringan)</span>
            </button>
          ) : (
            <a
              href={jpegBlobUrl || previewUrl}
              download={jpegFilename}
              onClick={(e) => handleDownloadClick(e, 'jpeg')}
              className="w-full py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-[0.99] text-stone-700 font-semibold text-xs flex items-center justify-center gap-2 border border-stone-200 transition no-underline"
            >
              {downloadSuccess === 'jpeg' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">JPEG Berhasil Tersimpan!</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 text-stone-500" />
                  <span>Download JPEG (Ukuran File Ringan)</span>
                </>
              )}
            </a>
          )}

          {/* 3. Cetak Langsung (Print Photostrip) - Visible on ALL devices */}
          <button
            onClick={handlePrint}
            className="w-full py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-[0.99] text-stone-700 font-semibold text-xs flex items-center justify-center gap-2 border border-stone-200 transition"
          >
            <Printer className="w-4 h-4 text-stone-500" />
            <span>Cetak Langsung (Print Photostrip)</span>
          </button>
        </div>

        <div className="mt-4 text-[11px] text-stone-400 leading-snug">
          Tip: Gunakan kertas foto glossy 4x6 atau 2x6 inci untuk hasil cetak asli seperti di studio!
        </div>

      </div>
    </div>
  );
}

