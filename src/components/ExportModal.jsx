import React, { useState } from 'react';
import { Download, Printer, Share2, Check, Sparkles, X, Image as ImageIcon } from 'lucide-react';
import { toPng, toJpeg } from 'html-to-image';
import confetti from 'canvas-confetti';

export default function ExportModal({
  isOpen,
  onClose,
  targetRef,
  templateName = 'Photobooth'
}) {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const downloadImage = async (format = 'png') => {
    if (!targetRef.current || isExporting) return;
    try {
      setIsExporting(true);
      const originalNode = targetRef.current;

      // 1. Ensure all images are fully loaded and decoded before capture
      const imgs = Array.from(originalNode.querySelectorAll('img'));
      await Promise.all(
        imgs.map(async (img) => {
          if (!img.complete) {
            await new Promise((res) => {
              img.onload = res;
              img.onerror = res;
            });
          }
          if ('decode' in img) {
            try {
              await img.decode();
            } catch (e) {
              // Ignore decode failures for SVGs or cached items
            }
          }
        })
      );

      // 2. Clone into an isolated offscreen container to bypass mobile scale transforms
      const clone = originalNode.cloneNode(true);
      clone.style.transform = 'none';
      clone.style.margin = '0';
      clone.style.position = 'fixed';
      clone.style.top = '-9999px';
      clone.style.left = '-9999px';
      clone.style.zIndex = '-9999';
      clone.style.opacity = '1';
      clone.style.pointerEvents = 'none';

      // Remove any hover prompts or editor buttons inside clone
      const hoverPrompts = clone.querySelectorAll('.group-hover\\:opacity-100, [title*="Ganti Foto"], [title*="Ambil Foto"]');
      hoverPrompts.forEach((el) => el.remove());

      // Ensure all images in clone have eager loading and crossOrigin
      const cloneImgs = Array.from(clone.querySelectorAll('img'));
      cloneImgs.forEach((img, i) => {
        img.loading = 'eager';
        img.crossOrigin = 'anonymous';
        if (imgs[i] && imgs[i].src) {
          img.src = imgs[i].src;
        }
      });

      document.body.appendChild(clone);

      // Allow browser layout engine to paint clone
      await new Promise((r) => setTimeout(r, 60));

      const width = clone.offsetWidth || originalNode.offsetWidth;
      const height = clone.offsetHeight || originalNode.offsetHeight;

      const options = {
        quality: 0.98,
        pixelRatio: window.devicePixelRatio && window.devicePixelRatio < 2 ? 2 : 2.5,
        backgroundColor: format === 'jpeg' ? '#ffffff' : null,
        width: width,
        height: height,
        skipFonts: true,
        cacheBust: false
      };

      // Quick warmup pass to prepare foreignObject rasterization
      await toPng(clone, { ...options, pixelRatio: 1 }).catch(() => {});

      let dataUrl;
      if (format === 'jpeg') {
        dataUrl = await toJpeg(clone, options);
      } else {
        dataUrl = await toPng(clone, options);
      }

      // Clean up offscreen clone
      if (clone.parentNode) {
        clone.parentNode.removeChild(clone);
      }

      if (!dataUrl || dataUrl.length < 500) {
        throw new Error('Hasil export kosong.');
      }

      // Create download link
      const link = document.createElement('a');
      const filename = `${templateName.toLowerCase().replace(/\s+/g, '-')}-photobooth-${Date.now()}.${format}`;
      link.download = filename;
      link.href = dataUrl;
      link.click();

      setIsExporting(false);
      setDownloadSuccess(true);
      
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });

      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Export error, attempting fallback:', err);
      // Clean up any stray clone
      const strayClone = document.querySelector('[style*="top: -9999px"]');
      if (strayClone) strayClone.remove();

      // Fallback: direct capture on targetRef.current
      try {
        const fallbackOptions = {
          quality: 0.95,
          pixelRatio: 2,
          skipFonts: true,
          backgroundColor: format === 'jpeg' ? '#ffffff' : null
        };
        const fallbackData = format === 'jpeg'
          ? await toJpeg(targetRef.current, fallbackOptions)
          : await toPng(targetRef.current, fallbackOptions);

        const link = document.createElement('a');
        link.download = `${templateName.toLowerCase().replace(/\s+/g, '-')}-photobooth-${Date.now()}.${format}`;
        link.href = fallbackData;
        link.click();
        setIsExporting(false);
        setDownloadSuccess(true);
        return;
      } catch (fallbackErr) {
        console.error('Fallback export error:', fallbackErr);
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
              <span className="inline-block animate-spin">⏳ Memproses High-Res...</span>
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
