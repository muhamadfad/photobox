import React from 'react';
import { getFilterStyle } from '../../utils/filterEngine';

export default function BoardingPassTemplate({
  photos,
  filterSettings,
  customData = {},
  isTwin = false, // Default false because Boarding Pass is wider 2x2 card format
  onPhotoClick
}) {
  const {
    airline = 'DETIK AIR',
    origin = 'USA',
    destination = 'CN',
    flight = 'GF 6815',
    gate = '15',
    seat = '18A',
    departure = '10:15 AM',
    passenger = 'BEST FRIENDS',
    destinationFull = 'CHINA',
    date = 'AUG 16, 2026',
    studioName = 'DETIK RUPA'
  } = customData;

  const filterStyle = getFilterStyle(filterSettings);

  const renderSinglePass = (keyPrefix) => (
    <div
      key={keyPrefix}
      className="relative w-[340px] sm:w-[380px] bg-[#fbf9f5] rounded-3xl overflow-hidden shadow-2xl border border-neutral-300 flex flex-col select-none"
      style={{
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
      }}
    >
      {/* Top Header Bar */}
      <div className="bg-[#601322] text-white px-5 py-2.5 flex items-center justify-between font-mono font-bold tracking-wider text-sm">
        <div className="flex items-center gap-2">
          <span>{airline}</span>
          <span>✈️</span>
        </div>
        <div className="text-xs tracking-widest uppercase">
          {origin} ✈️ {destination}
        </div>
      </div>

      {/* Flight Boarding Stub Info */}
      <div className="p-4 bg-white border-b border-dashed border-neutral-300">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-4xl font-black font-sans tracking-tight text-neutral-900 flex items-center gap-2">
              <span>{origin}</span>
              <span className="text-xl text-neutral-400">✈️</span>
              <span>{destination}</span>
            </div>
            
            {/* Barcode representation */}
            <div className="mt-2 flex items-center gap-0.5">
              {[3, 1, 4, 1, 5, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 1, 4, 3, 1, 2, 3].map((w, idx) => (
                <div
                  key={idx}
                  className="h-6 bg-neutral-900"
                  style={{ width: `${w}px` }}
                />
              ))}
            </div>
          </div>

          {/* Ticket metadata right column */}
          <div className="text-right text-[10px] font-mono leading-tight">
            <div className="text-neutral-400 uppercase text-[8px]">NAME</div>
            <div className="font-bold text-neutral-800 uppercase tracking-wider mb-1 truncate max-w-[110px]">
              {passenger}
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-1">
              <div>
                <span className="text-[7px] text-neutral-400 block">FLIGHT</span>
                <span className="font-bold text-neutral-900">{flight}</span>
              </div>
              <div>
                <span className="text-[7px] text-neutral-400 block">GATE</span>
                <span className="font-bold text-neutral-900">{gate}</span>
              </div>
              <div>
                <span className="text-[7px] text-neutral-400 block">SEAT</span>
                <span className="font-bold text-neutral-900">{seat}</span>
              </div>
            </div>

            <div className="mt-1">
              <span className="text-[7px] text-neutral-400 block">DEPARTURE</span>
              <span className="font-bold text-red-600 bg-red-50 px-1 py-0.5 rounded border border-red-200">
                {departure}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2x2 Photo Grid Section */}
      <div className="p-3 bg-[#fbf9f5] flex">
        {/* Vertical side banner */}
        <div className="flex items-center justify-center pr-2 py-4">
          <span
            className="text-[10px] font-mono font-bold tracking-widest text-neutral-600 uppercase"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            {studioName} —
          </span>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-2 gap-2 flex-1">
          {[0, 1, 2, 3].map((idx) => {
            const photoUrl = photos[idx];
            return (
              <div
                key={idx}
                onClick={() => onPhotoClick && onPhotoClick(idx)}
                className="group relative aspect-[4/3] bg-neutral-900 border border-neutral-300 rounded overflow-hidden cursor-pointer shadow-sm"
              >
                {photoUrl ? (
                  <div className="w-full h-full relative overflow-hidden">
                    <img
                      src={photoUrl}
                      alt={`Flight Grid Photo ${idx + 1}`}
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
                    <span>Seat {idx + 1}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 bg-[#601322] text-white text-[10px] px-2 py-0.5 rounded shadow">
                    Ganti Foto
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rounded Footer Pill Bar */}
      <div className="p-3 bg-[#fbf9f5] pt-0">
        <div className="bg-[#601322] text-white rounded-2xl px-4 py-2 flex items-center justify-between text-[9px] font-mono">
          <div className="flex items-center gap-1.5">
            <span>🌐</span>
            <span className="text-neutral-300">DESTINATION</span>
            <span className="font-bold">{destinationFull}</span>
          </div>
          <div className="flex items-center gap-1.5 border-x border-white/20 px-2">
            <span>✈️</span>
            <span className="text-neutral-300">DATE</span>
            <span className="font-bold">{date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>📷</span>
            <span className="font-bold">{studioName}</span>
          </div>
        </div>
      </div>

    </div>
  );

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-2">
      {renderSinglePass('boarding-pass-1')}
      {isTwin && renderSinglePass('boarding-pass-2')}
    </div>
  );
}
