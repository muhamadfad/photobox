import React, { useState, useEffect } from 'react';
import { Download, Printer, Check, X, Loader2 } from 'lucide-react';
import { toCanvas } from 'html-to-image';
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
  const [blobUrl, setBlobUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const safeFilename = `${templateName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')}-photobooth.png`;

  // Pre-generate the high-res image as soon as the modal opens so iOS download is 100% synchronous & instant
  useEffect(() => {
    if (!isOpen) {
      setPreviewUrl(null);
      setImageFile(null);
      setDownloadSuccess(false);
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
        setBlobUrl(null);
      }
      return;
    }

    let cancelled = false;

    const renderPhotoboothCanvas = async () => {
      if (!targetRef?.current) return;

      const originalNode = targetRef.current;
      const parentNode = originalNode.parentElement;
      const prevParentTransform = parentNode ? parentNode.style.transform : '';
      const prevParentMargin = parentNode ? parentNode.style.margin : '';

      const hoverPrompts = Array.from(originalNode.querySelectorAll('[data-hover-prompt]'));
      const photoOverlays = Array.from(originalNode.querySelectorAll('[data-photo-overlay]'));
      const savedImgSrcs = [];

      try {
        setIsGenerating(true);

        // 1. Temporarily unscale mobile wrapper so layout is 1:1 true pixel coordinates
        if (parentNode) {
          parentNode.style.transform = 'none';
          parentNode.style.margin = '0';
        }

        // Hide interactive hover prompts during capture
        hoverPrompts.forEach((el) => {
          el.style.display = 'none';
        });

        // Wait one frame for browser layout to settle at 1:1 scale
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

        const rootRect = originalNode.getBoundingClientRect();
        const rootWidth = Math.round(rootRect.width) || originalNode.offsetWidth || 580;
        const rootHeight = Math.round(rootRect.height) || originalNode.offsetHeight || 760;

        // 2. Measure every photo slot & preload its HTMLImageElement for direct Canvas 2D blitting
        const slotNodes = Array.from(originalNode.querySelectorAll('[data-photo-slot]'));
        const slotsData = await Promise.all(
          slotNodes.map(async (slotEl) => {
            const rect = slotEl.getBoundingClientRect();
            const imgEl = slotEl.querySelector('img');
            const cs = window.getComputedStyle(slotEl);
            const radius = parseFloat(cs.borderRadius) || 2;
            const src = imgEl ? imgEl.getAttribute('src') || imgEl.src : null;

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
              x: rect.left - rootRect.left,
              y: rect.top - rootRect.top,
              width: rect.width,
              height: rect.height,
              radius
            };
          })
        );

        // Measure floating badges / placed stickers so they can be layered above photos
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

        // 3. Temporarily replace heavy base64 img src with 1x1 pixel so SVG foreignObject is lightweight
        slotsData.forEach((slot) => {
          if (slot.imgEl && slot.originalSrc) {
            savedImgSrcs.push({ imgEl: slot.imgEl, src: slot.originalSrc });
            slot.imgEl.src = TINY_TRANSPARENT_GIF;
          }
        });
        photoOverlays.forEach((el) => {
          el.style.display = 'none';
        });

        // Use 2x Retina resolution so iOS Safari WebKit never hits canvas memory limits
        const ratio = 2;
        const bgColor = '#f8f7f4';

        let canvas;
        try {
          canvas = await toCanvas(originalNode, {
            quality: 0.98,
            pixelRatio: ratio,
            width: rootWidth,
            height: rootHeight,
            backgroundColor: bgColor,
            skipFonts: true,
            cacheBust: false,
            style: {
              transform: 'none',
              margin: '0',
              position: 'relative',
              top: '0px',
              left: '0px'
            }
          });
        } catch (svgErr) {
          canvas = document.createElement('canvas');
          canvas.width = Math.round(rootWidth * ratio);
          canvas.height = Math.round(rootHeight * ratio);
          const fbCtx = canvas.getContext('2d');
          fbCtx.fillStyle = bgColor;
          fbCtx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Restore DOM immediately after template capture
        savedImgSrcs.forEach(({ imgEl, src }) => {
          imgEl.src = src;
        });
        photoOverlays.forEach((el) => {
          el.style.display = '';
        });

        // 4. Direct HTML5 Canvas 2D Photo Compositing: paint every photo directly onto canvas
        const ctx = canvas.getContext('2d');
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

        // 5. Re-stamp any floating badges or placed stickers on top of the photos
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

        // Restore mobile wrapper scale and hover prompts
        if (parentNode) {
          parentNode.style.transform = prevParentTransform;
          parentNode.style.margin = prevParentMargin;
        }
        hoverPrompts.forEach((el) => {
          el.style.display = '';
        });

        if (cancelled) return;

        // 6. Generate both Preview DataURL and Blob URL (iOS Safari requires Blob URL instead of large DataURL)
        const dataUrl = canvas.toDataURL('image/png');
        setPreviewUrl(dataUrl);

        canvas.toBlob((blob) => {
          if (!blob || cancelled) return;
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
          try {
            const file = new File([blob], safeFilename, { type: 'image/png' });
            setImageFile(file);
          } catch (e) {
            // Older browsers without File constructor
          }
        }, 'image/png');

        setIsGenerating(false);
      } catch (err) {
        console.error('Export error:', err);
        savedImgSrcs.forEach(({ imgEl, src }) => {
          imgEl.src = src;
        });
        photoOverlays.forEach((el) => {
          el.style.display = '';
        });
        hoverPrompts.forEach((el) => {
          el.style.display = '';
        });
        if (parentNode) {
          parentNode.style.transform = prevParentTransform;
          parentNode.style.margin = prevParentMargin;
        }
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

  const handleDownloadClick = async (e) => {
    // On iOS, if Web Share API with files is supported, offer native "Save Image" sheet on iOS,
    // otherwise let the native <a href={blobUrl} download> trigger synchronously!
    if (isIOS && imageFile && navigator.canShare && navigator.canShare({ files: [imageFile] })) {
      e.preventDefault();
      try {
        await navigator.share({
          files: [imageFile],
          title: templateName
        });
        triggerSuccessFeedback();
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return;
        // If share failed, fall back to direct blob download
        if (blobUrl || previewUrl) {
          const link = document.createElement('a');
          link.href = blobUrl || previewUrl;
          link.download = safeFilename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    }
    triggerSuccessFeedback();
  };

  const triggerSuccessFeedback = () => {
    setDownloadSuccess(true);
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.55 }
    });
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-6 max-w-sm w-full shadow-2xl relative text-stone-800 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-2 text-stone-400 hover:text-stone-700 rounded-full bg-stone-100 hover:bg-stone-200 transition"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-base sm:text-lg font-extrabold text-stone-900 mb-0.5">
          Simpan Hasil Foto
        </h3>
        <p className="text-stone-500 text-xs mb-3">
          Kualitas HD siap simpan ke galeri atau cetak
        </p>

        {/* Live Rendered Image Preview Box (Supports Long-Press Save on iOS) */}
        <div className="w-full bg-stone-100 border border-stone-200/80 rounded-2xl p-3 mb-4 flex flex-col items-center justify-center min-h-[210px] max-h-[280px] overflow-hidden">
          {isGenerating || !previewUrl ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-stone-500">
              <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
              <span className="text-xs font-medium">Menyiapkan foto kualitas HD...</span>
            </div>
          ) : (
            <img
              src={previewUrl}
              alt="Hasil Photobooth HD"
              className="max-h-[245px] w-auto object-contain rounded-lg shadow-sm select-auto"
            />
          )}
        </div>

        {/* Single Clear Primary Download Button */}
        <div className="w-full space-y-2">
          {isGenerating || (!blobUrl && !previewUrl) ? (
            <button
              disabled
              className="w-full py-3.5 px-4 rounded-xl bg-rose-500/60 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-wait"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memproses Foto...</span>
            </button>
          ) : (
            <a
              href={blobUrl || previewUrl}
              download={safeFilename}
              onClick={handleDownloadClick}
              className="w-full py-3.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition no-underline"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Berhasil Disimpan!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Simpan Foto (Kualitas HD)</span>
                </>
              )}
            </a>
          )}

          {/* Print option only shown on desktop/tablet screens */}
          <button
            onClick={() => window.print()}
            className="hidden sm:flex w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-semibold text-xs items-center justify-center gap-1.5 border border-stone-200/80 transition"
          >
            <Printer className="w-3.5 h-3.5 text-stone-500" />
            <span>Cetak Langsung (Print)</span>
          </button>
        </div>

        <p className="mt-3 text-[11px] text-stone-400 leading-snug">
          {isIOS
            ? 'Tip iPhone/iOS: Klik tombol di atas lalu pilih "Save Image", atau tekan & tahan gambar preview untuk simpan ke Galeri.'
            : 'Foto otomatis tersimpan dalam resolusi tinggi (HD PNG).'}
        </p>

      </div>
    </div>
  );
}
