import React from 'react';
import { getFilterStyle } from '../../utils/filterEngine';

export default function AirmailPostcardTemplate({
  photos,
  filterSettings,
  customData = {},
  isTwin = true,
  slotCount = 4,
  onPhotoClick
}) {
  const {
    recipient = 'My Beloved One',
    brand = 'MEENIE BOX!',
    stampText = 'APPROVED',
    postmark = 'AIR MAIL • EXPRESS'
  } = customData;

  const filterStyle = getFilterStyle(filterSettings);
  const activeSlots = [...Array(slotCount)].map((_, i) => i);

  const renderSingleStrip = (keyPrefix) => (
    <div
      key={keyPrefix}
      className="relative w-[300px] sm:w-[320px] p-2.5 rounded-2xl shadow-2xl airmail-border select-none"
      style={{
        boxShadow: '0 20px 40px rgba(0,0,0,0.45)'
      }}
    >
      {/* Inner Cream Vintage Card */}
      <div className="relative bg-[#f8f5ee] rounded-xl p-3 flex flex-col h-full border border-amber-950/15 overflow-hidden">
        
        {/* Envelope sticker decoration (top right) */}
        <div className="absolute top-2 right-2 z-20 pointer-events-none transform rotate-6">
          <div className="bg-white border border-neutral-300 shadow-md px-2 py-1 rounded text-[9px] font-mono flex items-center gap-1">
            <span className="text-red-500">✉️</span>
            <span className="text-neutral-600 font-semibold text-[8px]">PAR AVION</span>
          </div>
        </div>

        {/* Dynamic Stamp-Framed Photos (3 or 4) */}
        <div className="flex flex-col gap-2.5 my-1 flex-1 relative z-10">
          {activeSlots.map((idx) => {
            const photoUrl = photos[idx];
            return (
              <div key={idx} className="relative">
                {/* Dotted perforation separator between stamps */}
                {idx > 0 && (
                  <div className="absolute -top-1.5 left-2 right-2 border-t-2 border-dotted border-neutral-300/80 pointer-events-none" />
                )}

                {/* Postage Stamp Border Frame */}
                <div
                  onClick={() => onPhotoClick && onPhotoClick(idx)}
                  className="group relative p-1.5 bg-white rounded shadow-md border border-neutral-200 cursor-pointer"
                  style={{
                    boxShadow: '0 3px 8px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(0,0,0,0.05)'
                  }}
                >
                  <div className="relative aspect-[4/3] w-full bg-neutral-900 overflow-hidden rounded-sm">
                    {photoUrl ? (
                      <div className="w-full h-full relative overflow-hidden">
                        <img
                          src={photoUrl}
                          alt={`Stamp Photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                          style={filterStyle}
                        />
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
                          <div className="absolute right-2 bottom-1 font-digital text-[#ff7b00] text-sm drop-shadow pointer-events-none">
                            {filterSettings.customDate || "'26 10 12"}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 font-mono text-xs">
                        <span>Stamp {idx + 1}</span>
                        <span className="text-[10px]">Klik untuk isi</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-neutral-800 text-white text-[10px] font-sans px-2 py-0.5 rounded shadow">
                        Ganti Foto
                      </span>
                    </div>
                  </div>
                </div>

                {/* Kraft Parcel Sticker between slot 2 and 3 */}
                {idx === 2 && (
                  <div className="absolute -bottom-3 right-4 z-20 pointer-events-none transform -rotate-3">
                    <div className="bg-[#c29b6e] text-[#4a3520] border border-[#8b653c] px-2 py-0.5 rounded shadow text-[9px] font-mono font-bold flex items-center gap-1">
                      <span>📦</span>
                      <span className="text-[8px]">SPECIAL DELIVERY</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Vintage Postcard Footer Details */}
        <div className="mt-2 pt-2 border-t border-dashed border-neutral-400 relative">
          
          <div className="flex items-start justify-between gap-2">
            
            {/* Dried flower stamp & wax seal aesthetic graphic */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-12 bg-[#efe6d5] border border-[#a89078] p-0.5 rounded shadow-inner flex flex-col items-center justify-center text-center">
                <span className="text-sm">🌸</span>
                <span className="text-[6px] text-neutral-500 font-serif">USA 20c</span>
              </div>
              <div className="w-5 h-5 -mt-2 rounded-full bg-[#c59b27] border border-[#8f6d13] shadow-md flex items-center justify-center text-[8px] text-amber-950 font-bold">
                ★
              </div>
            </div>

            {/* SEND TO: lines */}
            <div className="flex-1 pl-1">
              <div className="text-[10px] font-stamp font-bold text-neutral-700 tracking-wider">
                SEND TO:
              </div>
              <div className="text-xs font-cursive text-neutral-800 border-b border-neutral-400 py-0.5 font-bold">
                {recipient}
              </div>
              <div className="border-b border-neutral-400 h-3" />
            </div>

            {/* Red APPROVED ink rubber stamp */}
            <div className="transform -rotate-12 select-none pointer-events-none">
              <div className="border-2 border-dashed border-red-700 text-red-700 px-2 py-0.5 font-stamp font-black text-xs tracking-widest rounded shadow-sm opacity-85">
                {stampText}
              </div>
              <div className="text-[7px] text-blue-900 font-mono tracking-tighter text-center mt-0.5">
                {postmark}
              </div>
            </div>

          </div>

          {/* Logo brand footer */}
          <div className="mt-2 flex items-center justify-between text-neutral-500 text-[10px] font-stamp border-t border-neutral-300 pt-1">
            <span className="font-black text-neutral-800 text-xs tracking-tighter">{brand}</span>
            <span className="text-[8px] font-mono tracking-widest">AIRMAIL POSTAGE PAID</span>
          </div>

        </div>

      </div>
    </div>
  );

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-2">
      {renderSingleStrip('airmail-strip-1')}
      {isTwin && renderSingleStrip('airmail-strip-2')}
    </div>
  );
}
