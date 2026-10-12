import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, X, Smartphone, Copy, Check } from 'lucide-react';

export default function QRCodeModal({ isOpen, onClose }) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // Auto-detect the best URL to open on smartphone
  const targetUrl = window.location.origin.includes('localhost')
    ? 'http://192.168.100.12:5180/'
    : window.location.href;

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(targetUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#1c1917',
          light: '#ffffff'
        }
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR code error', err));
    }
  }, [isOpen, targetUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative text-stone-800 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full bg-stone-100 hover:bg-stone-200 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 border border-sky-100 flex items-center justify-center shadow-xs mb-3">
          <Smartphone className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-stone-800 mb-1">
          Scan QR untuk Buka di HP
        </h3>
        <p className="text-stone-500 text-xs mb-4 leading-relaxed">
          Arahkan kamera HP ke kode QR ini untuk berfoto dan mengunduh photostrip langsung dari ponsel!
        </p>

        {/* QR Code Image */}
        <div className="p-3 bg-white rounded-2xl shadow-xs mb-4 border border-stone-200">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR Code" className="w-48 h-48 rounded-xl" />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-stone-400 text-xs">
              Membuat QR Code...
            </div>
          )}
        </div>

        {/* Link box */}
        <div className="w-full bg-stone-50 p-2.5 rounded-xl border border-stone-200 flex items-center justify-between text-xs font-mono text-stone-600 mb-2">
          <span className="truncate max-w-[200px]">{targetUrl}</span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-700 flex items-center gap-1 text-[11px] font-sans font-semibold transition"
            title="Salin Link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600">Disalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin</span>
              </>
            )}
          </button>
        </div>

        <p className="text-[10px] text-stone-400">
          *Pastikan laptop dan HP terhubung ke jaringan Wi-Fi yang sama
        </p>

      </div>
    </div>
  );
}
