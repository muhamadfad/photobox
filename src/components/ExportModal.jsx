import React, { useState } from 'react';
import { Download, Printer, Check, Sparkles, X, Image as ImageIcon, Loader2 } from 'lucide-react';
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
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const downloadImage = async (format = 'png') => {
    if (!targetRef.current || isExporting) return;

    const originalNode = targetRef.current;
    const parentNode = originalNode.parentElement;
    const prevParentTransform = parentNode ? parentNode.style.transform : '';
    const prevParentMargin = parentNode ? parentNode.style.margin : '';

    const hoverPrompts = Array.from(originalNode.querySelectorAll('[data-hover-prompt]'));
    const photoOverlays = Array.from(originalNode.querySelectorAll('[data-photo-overlay]'));
    const savedImgSrcs = [];

    try {
      setIsExporting(true);

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

      // 3. Temporarily replace heavy base64 img src with 1x1 pixel so SVG foreignObject is lightweight (~18KB)
      slotsData.forEach((slot) => {
        if (slot.imgEl && slot.originalSrc) {
          savedImgSrcs.push({ imgEl: slot.imgEl, src: slot.originalSrc });
          slot.imgEl.src = TINY_TRANSPARENT_GIF;
        }
      });
      photoOverlays.forEach((el) => {
        el.style.display = 'none';
      });

      const ratio = 2.5;
      const bgColor = format === 'jpeg' ? '#ffffff' : '#f8f7f4';

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
        console.warn('SVG foreignObject fallback triggered:', svgErr);
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

      // 4. Direct HTML5 Canvas 2D Photo Compositing: paint every photo directly onto canvas!
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

      // 6. Export final high-res Data URL
      const dataUrl =
        format === 'jpeg'
          ? canvas.toDataURL('image/jpeg', 0.95)
          : canvas.toDataURL('image/png');

      const link = document.createElement('a');
      const filename = `${templateName.toLowerCase().replace(/\s+/g, '-')}-photobooth-${Date.now()}.${format}`;
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      setDownloadSuccess(true);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });

      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Export error:', err);
      // Always restore DOM state on error
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
      setIsExporting(false);
      alert('Gagal mendownload gambar. Silakan coba lagi.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 max-w-md w-full shadow-2xl relative text-stone-800 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full bg-stone-100 hover:bg-stone-200 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Title */}
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center shadow-xs mb-3.5">
          <Sparkles className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold text-stone-800 mb-1">
          Simpan Photobooth Anda
        </h3>
        <p className="text-stone-500 text-xs mb-6 max-w-xs leading-relaxed">
          Export foto kualitas tinggi (Ultra-HD 300 DPI), siap cetak atau share ke Instagram & TikTok!
        </p>

        {/* Download Buttons */}
        <div className="w-full space-y-2.5">
          <button
            onClick={() => downloadImage('png')}
            disabled={isExporting}
            className="w-full py-3.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses High-Res...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Berhasil Tersimpan!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download PNG (Kualitas Maksimal)</span>
              </>
            )}
          </button>

          <button
            onClick={() => downloadImage('jpeg')}
            disabled={isExporting}
            className="w-full py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs flex items-center justify-center gap-2 border border-stone-200 transition disabled:opacity-50"
          >
            <ImageIcon className="w-4 h-4 text-stone-500" />
            <span>Download JPEG (Ukuran File Ringan)</span>
          </button>

          <button
            onClick={handlePrint}
            className="w-full py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs flex items-center justify-center gap-2 border border-stone-200 transition"
          >
            <Printer className="w-4 h-4 text-stone-500" />
            <span>Cetak Langsung (Print Photostrip)</span>
          </button>
        </div>

        <div className="mt-5 text-[11px] text-stone-400">
          Tip: Gunakan kertas foto glossy 4x6 atau 2x6 inci untuk hasil cetak asli seperti di mall!
        </div>

      </div>
    </div>
  );
}
