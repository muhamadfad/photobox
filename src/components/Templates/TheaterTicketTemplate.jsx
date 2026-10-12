import React from 'react';
import { getFilterStyle } from '../../utils/filterEngine';

export default function TheaterTicketTemplate({
  photos,
  filterSettings,
  customData = {},
  isTwin = true,
  slotCount = 4,
  onPhotoClick
}) {
  const {
    title = 'Theather Show',
    row = 'B2',
    show = '02',
    date = 'Sunday, 29 March',
    time = '20.00',
    ribbon = 'SAVE THE BEST MOMENT ★ SAVE THE BEST MOMENT',
    studioName = 'kafastudio.'
  } = customData;

  const filterStyle = getFilterStyle(filterSettings);
  const activeSlots = [...Array(slotCount)].map((_, i) => i);

  const renderSingleStrip = (keyPrefix) => (
    <div
      key={keyPrefix}
      className="relative w-[300px] sm:w-[320px] bg-[#54121d] p-3 text-[#54121d] shadow-2xl rounded-sm flex flex-col select-none"
      style={{
        boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.08)'
      }}
    >
      {/* Decorative perforated scallop edge cutouts */}
      <div className="absolute left-0 top-12 bottom-12 w-3 flex flex-col justify-between pointer-events-none z-10">
        {[...Array(14)].map((_, i) => (
          <div key={i} className="w-3 h-3 bg-neutral-900 rounded-r-full -ml-1.5" />
        ))}
      </div>
      <div className="absolute right-0 top-12 bottom-12 w-3 flex flex-col justify-between pointer-events-none z-10">
        {[...Array(14)].map((_, i) => (
          <div key={i} className="w-3 h-3 bg-neutral-900 rounded-l-full -mr-1.5 ml-auto" />
        ))}
      </div>

      {/* Ticket Body Card (Ivory / Cream) */}
      <div className="relative bg-[#fdfbf3] rounded-lg border-2 border-[#54121d] p-3 flex flex-col h-full overflow-hidden">
        
        {/* Ticket Header */}
        <div className="text-center pb-2 border-b-2 border-[#54121d]">
          <div className="flex justify-center items-center gap-1 text-[#54121d] text-xs font-serif tracking-widest mb-0.5">
            <span>★</span>
            <span className="text-[10px]">★</span>
            <span>★</span>
          </div>
          <h1 className="font-cursive text-3xl sm:text-4xl text-[#54121d] font-bold leading-tight drop-shadow-sm">
            {title}
          </h1>

          {/* Ticket metadata table */}
          <div className="mt-2 grid grid-cols-3 border-t border-[#54121d] text-[11px] font-serif uppercase tracking-tight divide-x divide-[#54121d]">
            <div className="py-0.5 px-1 text-center">
              <span className="block text-[9px] text-[#54121d]/70 font-sans">Row</span>
              <span className="font-bold text-sm text-[#54121d]">{row}</span>
            </div>
            <div className="py-0.5 px-1 text-center">
              <span className="block text-[9px] text-[#54121d]/70 font-sans">Show</span>
              <span className="font-bold text-sm text-[#54121d]">{show}</span>
            </div>
            <div className="py-0.5 px-1 text-center">
              <span className="block text-[9px] text-[#54121d]/70 font-sans">{date}</span>
              <span className="font-bold text-sm text-[#54121d]">{time}</span>
            </div>
          </div>
        </div>

        {/* Photo Frames Stack (3 or 4) */}
        <div className="my-2.5 flex flex-col gap-2 flex-1">
          {activeSlots.map((idx) => {
            const photoUrl = photos[idx];
            return (
              <div
                key={idx}
                onClick={() => onPhotoClick && onPhotoClick(idx)}
                className="group relative w-full aspect-[4/3] bg-neutral-900 border-2 border-[#54121d] overflow-hidden cursor-pointer shadow-inner"
              >
                {photoUrl ? (
                  <div className="w-full h-full relative overflow-hidden">
                    <img
                      src={photoUrl}
                      alt={`Booth Shot ${idx + 1}`}
                      className="w-full h-full object-cover transition duration-300"
                      style={filterStyle}
                    />
                    {/* Halftone / Grain / Date Stamp CSS Overlays */}
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
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#54121d]/40 font-mono text-xs">
                    <span>Frame {idx + 1}</span>
                    <span className="text-[10px]">Klik untuk isi</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-[#54121d]/0 group-hover:bg-[#54121d]/20 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 bg-[#54121d] text-white text-[10px] font-sans px-2 py-0.5 rounded shadow">
                    Ganti Foto
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ticket Footer Banner */}
        <div className="pt-1.5 border-t-2 border-[#54121d] text-center">
          <div className="border-y border-[#54121d] py-0.5 my-1">
            <p className="text-[9px] font-serif uppercase tracking-wider font-bold text-[#54121d]">
              {ribbon}
            </p>
          </div>
          <div className="pt-1">
            <span className="font-serif italic text-2xl font-black tracking-tight text-[#54121d]">
              {studioName}
            </span>
          </div>
        </div>

      </div>
    </div>
  );

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-2">
      {renderSingleStrip('theater-strip-1')}
      {isTwin && renderSingleStrip('theater-strip-2')}
    </div>
  );
}
