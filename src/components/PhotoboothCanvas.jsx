import React from 'react';
import { getFilterStyle } from '../utils/filterEngine';
import { Scissors, Music, Disc, Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Heart, Cloud, Camera, Sparkles } from 'lucide-react';

export default function PhotoboothCanvas({
  template,
  photos = [],
  slotCount = 4,
  isTwin = true,
  filterSettings,
  customData = {},
  frameColor,
  stickers = [],
  onPhotoClick,
  onRemoveSticker
}) {
  const filterStyle = getFilterStyle(filterSettings);
  const currentTheme = template?.theme || 'theater';
  const custom = { ...(template?.customFields || {}), ...(customData[template?.id] || {}) };
  const effectiveBg = frameColor || template?.defaultBg || '#18181b';

  // 3-photo layouts from real studio references
  const is3PhotoTheme = [
    'denim_1989',
    'special_day_ticket',
    'spotify_fool',
    'poserbox_playlist',
    'cherish_cat',
    'woodz_day',
    'phetoria_sage',
    'vintage_mahogany',
    'boarding_flight'
  ].includes(currentTheme);

  const currentSlotsCount = is3PhotoTheme && slotCount === 4 ? 3 : slotCount;
  const activeSlots = [...Array(currentSlotsCount)].map((_, i) => i);

  // Render a single photostrip unit
  const renderSingleStrip = (keyPrefix) => {
    // Dynamic styling for alternating twin strips
    const stripEffectiveBg =
      currentTheme === 'spotify_fool'
        ? (keyPrefix === 'strip-2' ? '#f7f3ea' : '#441119')
        : currentTheme === 'poserbox_playlist'
        ? (keyPrefix === 'strip-2' ? '#ffffff' : '#38383a')
        : currentTheme === 'woodz_day'
        ? (keyPrefix === 'strip-2' ? '#18181b' : '#ffffff')
        : effectiveBg;

    const stripCardBg =
      currentTheme === 'spotify_fool'
        ? (keyPrefix === 'strip-2' ? '#f7f3ea' : '#441119')
        : currentTheme === 'poserbox_playlist'
        ? (keyPrefix === 'strip-2' ? '#ffffff' : '#2c2c2e')
        : currentTheme === 'woodz_day'
        ? (keyPrefix === 'strip-2' ? '#18181b' : '#ffffff')
        : (template?.cardBg || '#ffffff');

    const stripTextColor =
      currentTheme === 'spotify_fool'
        ? (keyPrefix === 'strip-2' ? '#441119' : '#ffffff')
        : currentTheme === 'poserbox_playlist'
        ? (keyPrefix === 'strip-2' ? '#2c2c2e' : '#ffffff')
        : currentTheme === 'woodz_day'
        ? (keyPrefix === 'strip-2' ? '#ffffff' : '#18181b')
        : (template?.textColor || '#111827');

    return (
      <div
        key={keyPrefix}
        className={`relative w-[235px] sm:w-[255px] md:w-[270px] shrink-0 p-2.5 sm:p-3 text-neutral-900 rounded-2xl shadow-xl flex flex-col select-none transition-colors duration-300 ${
          currentTheme === 'roblox_xxl'
            ? 'border-4 border-white'
            : currentTheme === 'poserbox_playlist' && keyPrefix === 'strip-2'
            ? 'border border-stone-300'
            : ''
        }`}
        style={{
          backgroundColor: stripEffectiveBg,
          boxShadow: '0 20px 40px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.15)',
          ...(currentTheme === 'vintage_mahogany' && {
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 2px, transparent 2px, transparent 6px)'
          }),
          ...(currentTheme === 'woodz_day' && keyPrefix === 'strip-1' && {
            backgroundImage: 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
            backgroundSize: '16px 16px'
          })
        }}
      >
        {/* ================= SPECIAL TEMPLATE FRAME ACCENTS ================= */}

        {/* 1. Theater Ticket & Special Day Ticket: Scalloped ticket notch cutouts */}
        {(currentTheme === 'theater' || currentTheme === 'special_day_ticket') && (
          <>
            <div className="absolute left-0 top-12 bottom-12 w-3 flex flex-col justify-between pointer-events-none z-10">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-[#f0eee9] rounded-r-full -ml-1.5 shadow-inner" />
              ))}
            </div>
            <div className="absolute right-0 top-12 bottom-12 w-3 flex flex-col justify-between pointer-events-none z-10">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-[#f0eee9] rounded-l-full -mr-1.5 ml-auto shadow-inner" />
              ))}
            </div>
          </>
        )}

        {/* 2. Denim Stitch Border Accent */}
        {currentTheme === 'denim_1989' && (
          <div className="absolute inset-1.5 border-2 border-dashed border-sky-300/40 rounded-xl pointer-events-none z-10" />
        )}

        {/* 3. Retro 90s Checkerboard Accent along left border */}
        {currentTheme === 'retro_90s_pop' && (
          <div className="absolute left-0 top-0 bottom-0 w-3 flex flex-col z-0 rounded-l-2xl overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div key={i} className={`w-full flex-1 ${i % 2 === 0 ? 'bg-[#facc15]' : 'bg-[#7a1721]'}`} />
            ))}
          </div>
        )}

        {/* 4. Airmail Hazard Slant Stripes */}
        {currentTheme === 'airmail' && (
          <div className="absolute inset-0 rounded-2xl pointer-events-none p-1.5 airmail-border -z-0" />
        )}

        {/* Inner Card Container */}
        <div
          className={`relative rounded-xl p-3 flex flex-col h-full overflow-hidden z-10 ${
            currentTheme === 'retro_90s_pop' ? 'ml-2' : ''
          }`}
          style={{
            backgroundColor: stripCardBg,
            color: stripTextColor
          }}
        >
          {/* ================= TEMPLATE HEADERS ================= */}

          {/* POSERBOX'S PLAYLIST HEADER */}
          {currentTheme === 'poserbox_playlist' && (
            <div className="text-left pb-1.5 border-b border-current/20 mb-1 flex items-center justify-between">
              <span className="font-serif italic font-bold text-xs tracking-wide">
                {custom.header || "Poserbox's Playlist"}
              </span>
              <div className="h-0.5 w-16 bg-current opacity-40 rounded" />
            </div>
          )}

          {/* CHERISH MIDNIGHT CAT HEADER */}
          {currentTheme === 'cherish_cat' && (
            <div className="flex items-center justify-between pb-1 border-b border-sky-400/20 mb-1 text-[10px] font-mono text-sky-200">
              <span>{custom.handle || '@cherishphotobox'}</span>
              <span className="text-xs">✨</span>
            </div>
          )}

          {/* IT'S WOODZ DAY K-POP HEADER */}
          {currentTheme === 'woodz_day' && (
            <div>
              {keyPrefix === 'strip-2' ? (
                <div className="text-left pb-1 border-b border-white/40 mb-1 text-white font-mono text-[9px] uppercase flex justify-between">
                  <span className="font-bold">{custom.idolName || 'CHO SEUNGYOUN'}, {custom.idolDate || 'AUGUST 5TH'}</span>
                  <span>★</span>
                </div>
              ) : (
                <div className="flex items-center justify-between pb-1 border-b border-stone-300 mb-1">
                  <span className="text-[8px] font-mono font-bold bg-black text-white px-1.5 py-0.5 rounded">PHOTO PLACE</span>
                  <div className="flex items-center gap-1 text-[10px]">
                    <span>👟</span>
                    <span className="text-[7.5px] font-mono text-stone-600 font-bold">SUNSET CHASER</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PHETORIA SAGE GREEN HEADER */}
          {currentTheme === 'phetoria_sage' && (
            <div className="text-center pb-1 border-b border-white/20 mb-1 flex items-center justify-between text-white/90">
              <span className="text-[8px] font-mono tracking-widest uppercase">RETROBOOTH</span>
              <span className="text-xs">♡</span>
              <span className="text-[8px] font-mono tracking-widest uppercase">VINTAGE MEMORIES</span>
            </div>
          )}

          {/* VINTAGE MAHOGANY & BRASS LAMPS HEADER */}
          {currentTheme === 'vintage_mahogany' && (
            <div className="text-center pb-1.5 border-b border-amber-500/30 mb-1">
              <div className="flex items-center justify-between text-[8px] font-serif text-amber-200/80 uppercase tracking-widest">
                <span>EST. 2026</span>
                <span className="text-sm">💡</span>
                <span>PHOTO PLACE</span>
              </div>
            </div>
          )}

          {/* SUA FOTO CANDY TICKET HEADER */}
          {currentTheme === 'suafoto_ticket' && (
            <div className="border-b-2 border-[#7c121d] pb-1 mb-1">
              <div className="flex items-center justify-between">
                <h2 className="font-cursive text-2xl font-bold text-[#7c121d] leading-none">
                  {custom.brand || "Sua Foto's"}
                </h2>
                <span className="text-[8px] font-bold bg-[#7c121d] text-white px-1.5 py-0.5 rounded">
                  MAKASSAR
                </span>
              </div>
              <div className="text-[8px] font-mono font-black text-[#7c121d] mt-0.5 tracking-wider">
                {custom.ticketTitle || 'SUAFOTO GOLDEN TICKET'}
              </div>
            </div>
          )}

          {/* FLIGHT TICKET IDN BOARDING PASS HEADER */}
          {currentTheme === 'boarding_flight' && (
            <div className="pb-1 border-b border-dashed border-stone-400 mb-1 font-mono text-[9px]">
              <div className="bg-[#1e385c] text-white px-2 py-0.5 rounded flex justify-between font-bold mb-1">
                <span>{keyPrefix === 'strip-2' ? (custom.flight2 || 'IDN ➔ SGP') : (custom.flight1 || 'IDN ➔ USA')}</span>
                <span>✈ BOARDING PASS</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>GATE: {keyPrefix === 'strip-2' ? (custom.gate2 || '07') : (custom.gate1 || '14')}</span>
                <span>SEAT: {keyPrefix === 'strip-2' ? (custom.seat2 || '11B') : (custom.seat1 || '30A')}</span>
              </div>
            </div>
          )}

          {/* PHOTOLOOKUP 2026 NAVY STARS HEADER */}
          {currentTheme === 'photolookup_cream' && (
            <div className="text-center pb-1 border-b border-stone-300 mb-1">
              <div className="flex justify-center items-center gap-1 text-[8px] text-red-600 font-bold mb-0.5">
                <span>★</span>
                <span className="font-mono text-stone-800 font-black">{custom.year || '2026'}</span>
                <span>★</span>
              </div>
              <h3 className="font-serif font-black text-xl tracking-widest text-[#0f172a] uppercase leading-none">
                {custom.brand || 'PHOTOLOOKUP'}
              </h3>
            </div>
          )}

          {/* POLAROID MOSAIC HEADER */}
          {currentTheme === 'polaroid_mosaic' && (
            <div className="text-center pb-1 border-b border-stone-200 mb-1 text-xs font-serif text-stone-700 italic">
              polaroid instant collection
            </div>
          )}

          {/* SELFIT STUDIO MINIMAL HEADER */}
          {currentTheme === 'selfit_minimal' && (
            <div className="text-left pb-1 border-b border-stone-200 mb-1">
              <h3 className="font-serif italic text-lg font-bold text-stone-800">
                {custom.brand || 'selfit photostudio.'}
              </h3>
              <span className="text-[8px] text-stone-400 font-sans">{custom.subtitle || 'simple quiet moments'}</span>
            </div>
          )}

          {/* 1989 TAYLOR'S DENIM HEADER */}
          {currentTheme === 'denim_1989' && (
            <div className="text-center pb-2 relative">
              <div className="flex items-center justify-center gap-3 text-white">
                <span className="text-xs opacity-75">☆</span>
                <h2 className="font-serif tracking-[0.25em] text-lg font-black uppercase text-white drop-shadow">
                  {custom.brand || 'MOMENKU'}
                </h2>
                <span className="text-xs opacity-75">☆</span>
              </div>
            </div>
          )}

          {/* ROBLOX XXL STARRY LYRICS HEADER */}
          {currentTheme === 'roblox_xxl' && (
            <div className="bg-white text-[#0b192e] px-2.5 py-1 rounded-sm text-[10px] font-bold flex items-center justify-between mb-1.5 shadow-xs font-mono">
              <span className="truncate">{custom.lyric1 || 'I still remember, I will forever'}</span>
              <Sparkles className="w-3 h-3 text-[#0b192e] shrink-0 ml-1" />
            </div>
          )}

          {/* SPECIAL DAY CINEMA TICKET HEADER */}
          {currentTheme === 'special_day_ticket' && (
            <div>
              {keyPrefix === 'strip-2' ? (
                <div className="text-center pb-1 border-b border-dashed border-[#3d0a12]/60 mb-1">
                  <div className="w-4 h-2 bg-[#f0eee9] rounded-b-full mx-auto -mt-3 mb-0.5 shadow-inner" />
                  <h2 className="font-cursive text-3xl font-bold text-[#4a0e17] leading-tight">
                    {custom.title || 'Special Day'}
                  </h2>
                </div>
              ) : (
                <div className="text-center pb-1 border-b border-dashed border-[#3d0a12]/60 mb-1">
                  <span className="text-[8px] font-mono tracking-widest text-[#4a0e17] font-bold block mb-0.5">
                    {custom.barcodeText || 'PANORAMA'}
                  </span>
                  <div className="flex justify-center items-center gap-0.5 h-6 overflow-hidden">
                    {[...Array(36)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-[#3d0a12] h-full"
                        style={{ width: `${(i % 3) + 1}px`, marginRight: '1px' }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 70s & 90s RETRO CHECKERBOARD HEADER */}
          {currentTheme === 'retro_90s_pop' && (
            <div className="flex items-center justify-between pb-1 border-b border-white/20 mb-1">
              <div className="bg-white text-[#dc2626] px-2 py-0.5 rounded-md font-black text-xs shadow-md tracking-tight rotate-[-4deg]">
                {custom.badgeTop || '70s'}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-amber-200">
                <Camera className="w-3.5 h-3.5 inline" />
                <span className="text-[9px] font-mono font-bold bg-white/20 px-1 rounded">REC</span>
              </div>
            </div>
          )}

          {/* SPOTIFY FOOL FOR YOU HEADER */}
          {currentTheme === 'spotify_fool' && (
            <div>
              {keyPrefix === 'strip-2' ? (
                <div className="flex justify-between items-center pb-1 border-b border-[#441119]/30 mb-1 text-[9px] font-mono text-[#441119]">
                  <span className="font-bold tracking-wider">● SPOTIFY NOW PLAYING</span>
                  <Disc className="w-3.5 h-3.5 text-[#441119]" />
                </div>
              ) : (
                <div className="text-center pb-1 border-b border-white/20 mb-1">
                  <div className="text-[9px] font-mono uppercase tracking-widest text-white/90 mb-0.5 font-bold">
                    {custom.groupName || 'MOMENKU GROUP'}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-white">
                    <span className="text-xs">●</span>
                    <div className="flex items-center gap-0.5 h-3">
                      {[...Array(24)].map((_, i) => (
                        <div
                          key={i}
                          className="w-0.5 bg-white rounded-full"
                          style={{ height: `${((Math.sin(i * 0.8) + 1.2) * 5) + 3}px` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* THEATER TICKET */}
          {currentTheme === 'theater' && (
            <div className="text-center pb-2 border-b-2 border-current">
              <div className="flex justify-center items-center gap-1 text-xs font-serif tracking-widest mb-0.5">
                <span>★</span>
                <span className="text-[10px]">★</span>
                <span>★</span>
              </div>
              <h2 className="font-cursive text-3xl font-bold leading-tight">
                {custom.title || 'Theather Show'}
              </h2>
              <div className="mt-1.5 grid grid-cols-3 border-t border-current text-[10.5px] font-serif uppercase tracking-tight divide-x divide-current">
                <div className="py-0.5 text-center">
                  <span className="block text-[8px] opacity-70">Row</span>
                  <span className="font-bold">{custom.row || 'B2'}</span>
                </div>
                <div className="py-0.5 text-center">
                  <span className="block text-[8px] opacity-70">Show</span>
                  <span className="font-bold">{custom.show || '02'}</span>
                </div>
                <div className="py-0.5 text-center">
                  <span className="block text-[8px] opacity-70">{custom.date || 'Sunday, 29 March'}</span>
                  <span className="font-bold">{custom.time || '20.00'}</span>
                </div>
              </div>
            </div>
          )}

          {/* HARU FILM CLOUDS (Korean Signature) */}
          {currentTheme === 'haru_cloud' && (
            <div className="text-center pb-2 relative">
              <div className="flex items-center justify-center gap-1.5 text-xs text-sky-600 font-semibold mb-0.5">
                <Cloud className="w-3.5 h-3.5 text-sky-500 fill-sky-200 inline" />
                <span className="font-sans tracking-widest text-[11px] uppercase">{custom.cloudNote || 'pure soft moments'}</span>
                <Cloud className="w-3.5 h-3.5 text-sky-500 fill-sky-200 inline" />
              </div>
              <h2 className="font-serif italic font-bold text-2xl tracking-wide text-sky-800">
                {custom.brand || 'haru film.'}
              </h2>
            </div>
          )}

          {/* LIFE4CUTS CLASSIC */}
          {currentTheme === 'life4cuts' && (
            <div className="text-center pb-2 border-b border-indigo-400/40">
              <div className="inline-block bg-rose-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full mb-1 tracking-wider">
                ORIGINAL PHOTOBOOTH
              </div>
              <h2 className="font-sans font-black text-xl tracking-tight text-white">
                {custom.brand || '인생네컷 • LIFE 4 CUTS'}
              </h2>
              <p className="text-[9px] text-indigo-200 uppercase tracking-widest mt-0.5">
                {custom.sub || 'THE BEST MOMENT OF MY LIFE'}
              </p>
            </div>
          )}

          {/* PHOTOISM MONOCHROME */}
          {currentTheme === 'photoism' && (
            <div className="pb-2 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h2 className="font-serif italic text-2xl font-black tracking-tight text-white">
                  {custom.brand || 'photoism.'}
                </h2>
                <p className="text-[8px] text-neutral-400 uppercase tracking-wider">{custom.tag || 'self photostudio'}</p>
              </div>
              <span className="text-[9px] font-mono text-neutral-400 border border-neutral-700 px-1.5 py-0.5 rounded">
                SEOUL
              </span>
            </div>
          )}

          {/* EDITORIAL STORY NEWSPAPER */}
          {currentTheme === 'editorial' && (
            <div className="border-b-2 border-black pb-1.5">
              <div className="bg-black text-white text-[9px] font-mono px-2 py-0.5 flex justify-between items-center">
                <span>★ PHOTOBOOTHOLOGY ★</span>
                <span>{custom.volume || 'VOL. 01'}</span>
              </div>
              <div className="pt-1.5 text-left">
                <p className="font-serif italic text-xs text-neutral-700 leading-none">{custom.headlineLead || 'Capture your'}</p>
                <h1 className="font-serif font-black text-2xl tracking-tight leading-none text-black">
                  {custom.headlineMain || 'STORY TODAY'}
                </h1>
              </div>
            </div>
          )}

          {/* YE OLE LONDONER */}
          {currentTheme === 'londoner' && (
            <div className="border-b-2 border-black pb-1.5 text-center">
              <div className="flex justify-between items-center text-[7px] font-serif border-b border-black pb-0.5 uppercase">
                <span>VOL. I, NO. 1</span>
                <span className="italic">"{custom.motto || 'The pen is mightier'}"</span>
                <span>PRICE $0.10</span>
              </div>
              <h1 className="font-blackletter text-3xl font-bold tracking-tight text-black mt-0.5 leading-none">
                {custom.masthead || 'Ye Ole Londoner'}
              </h1>
              <div className="text-xs font-serif font-black uppercase tracking-tight mt-1 border-t border-black pt-0.5">
                {custom.headline || 'GOOD TIMES TODAY!'}
              </div>
            </div>
          )}

          {/* ================= PHOTOS GRID / STACK ================= */}
          <div className="my-2 flex flex-col gap-2 flex-1 relative">
            {activeSlots.map((idx) => {
              const photoUrl = photos[idx];
              return (
                <React.Fragment key={idx}>
                  {/* Lyric divider bars for roblox_xxl */}
                  {currentTheme === 'roblox_xxl' && idx === 2 && (
                    <div className="bg-white text-[#0b192e] px-2 py-0.5 rounded-xs text-[8.5px] font-bold flex items-center justify-between font-mono shadow-xs -my-0.5 z-10">
                      <span className="truncate">{custom.lyric2 || "Backseat secrets, we won't ever tell,"}</span>
                      <Sparkles className="w-3 h-3 text-[#0b192e] shrink-0 ml-1" />
                    </div>
                  )}
                  {currentTheme === 'roblox_xxl' && idx === 3 && (
                    <div className="bg-white text-[#0b192e] px-2 py-0.5 rounded-xs text-[8.5px] font-bold flex items-center justify-between font-mono shadow-xs -my-0.5 z-10">
                      <span className="truncate">{custom.lyric3 || 'I miss you double XL'}</span>
                      <Sparkles className="w-3 h-3 text-[#0b192e] shrink-0 ml-1" />
                    </div>
                  )}

                  {/* Collage badges for retro_90s_pop */}
                  {currentTheme === 'retro_90s_pop' && idx === 1 && (
                    <div className="absolute right-[-4px] top-1/4 z-20 pointer-events-none bg-amber-400 text-stone-900 text-[8px] font-black font-mono px-1.5 py-0.5 rounded shadow rotate-12">
                      POP★
                    </div>
                  )}
                  {currentTheme === 'retro_90s_pop' && idx === 2 && (
                    <div className="absolute left-[-4px] top-1/2 z-20 pointer-events-none bg-stone-900 text-white text-[8px] font-black font-mono px-1.5 py-0.5 rounded-full shadow -rotate-12 border border-white/40">
                      #8
                    </div>
                  )}

                  {/* Cherish Cat 16 badge */}
                  {currentTheme === 'cherish_cat' && idx === 1 && (
                    <div className="absolute right-1 -top-2 text-sky-300 font-serif font-black text-lg italic drop-shadow z-20">
                      {custom.badgeNum || '16'}
                    </div>
                  )}

                  <div
                    onClick={() => onPhotoClick && onPhotoClick(idx)}
                    className={`group relative aspect-[4/3] w-full bg-neutral-900 overflow-hidden cursor-pointer shadow-sm transition-all duration-200 ${
                      currentTheme === 'denim_1989'
                        ? 'rounded-2xl border-2 border-sky-200/50 p-0.5 bg-[#1b3353] shadow-md'
                        : currentTheme === 'roblox_xxl'
                        ? 'rounded-xs border border-white/80 shadow-md'
                        : currentTheme === 'special_day_ticket'
                        ? 'rounded-lg border-2 border-[#3d0a12]/80 p-0.5 bg-white shadow-sm'
                        : currentTheme === 'retro_90s_pop'
                        ? 'rounded-md border-2 border-amber-300/60 shadow-md'
                        : currentTheme === 'poserbox_playlist'
                        ? (keyPrefix === 'strip-2' ? 'rounded border border-stone-300 p-0.5 bg-white' : 'rounded border border-stone-600 p-0.5 bg-stone-900')
                        : currentTheme === 'cherish_cat'
                        ? 'rounded-2xl border-2 border-sky-400/40 shadow-md'
                        : currentTheme === 'phetoria_sage'
                        ? 'rounded border border-white/60 p-0.5 bg-[#3a4f33]'
                        : currentTheme === 'vintage_mahogany'
                        ? 'rounded border-2 border-amber-600/70 p-0.5 bg-[#25150b] shadow-md'
                        : currentTheme === 'polaroid_mosaic'
                        ? 'rounded-xs p-1 pb-3 bg-white shadow-md border border-stone-200'
                        : currentTheme === 'spotify_fool'
                        ? (keyPrefix === 'strip-2' ? 'rounded-md border-2 border-[#441119] p-0.5 bg-white shadow-sm' : 'rounded-md border-2 border-white p-0.5 bg-neutral-900 shadow-md')
                        : currentTheme === 'airmail'
                        ? 'p-1.5 bg-white rounded border border-neutral-300 shadow-md'
                        : currentTheme === 'instax'
                        ? 'rounded-sm border-2 border-neutral-200 p-1 bg-white'
                        : currentTheme === 'purikura'
                        ? 'rounded-2xl border-2 border-pink-400 shadow-pink-200 shadow-md'
                        : currentTheme === 'haru_cloud'
                        ? 'rounded-xl border-2 border-sky-300 shadow-sm'
                        : 'rounded-md border border-current'
                    }`}
                  >
                    <div className="w-full h-full relative overflow-hidden bg-neutral-950 rounded-xs">
                      {photoUrl ? (
                        <div className="w-full h-full relative overflow-hidden">
                          <img
                            src={photoUrl}
                            alt={`Slot ${idx + 1}`}
                            crossOrigin="anonymous"
                            loading="eager"
                            className="w-full h-full object-cover transition duration-200 group-hover:scale-102"
                            style={filterStyle}
                          />

                          {/* Aesthetic Filter Overlays */}
                          {filterSettings?.halftone && (
                            <div className="absolute inset-0 newsprint-overlay pointer-events-none" />
                          )}
                          {filterSettings?.filmGrain > 0 && (
                            <div
                              className="absolute inset-0 film-grain-overlay pointer-events-none"
                              style={{
                                opacity: (filterSettings.filmGrain / 100) * 0.45
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
                        <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 text-xs font-mono bg-neutral-900/60 p-2 text-center">
                          <span className="font-bold">Frame {idx + 1}</span>
                          <span className="text-[9px] opacity-70">Klik untuk foto</span>
                        </div>
                      )}

                      {/* Hover Prompt */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 bg-neutral-900/90 text-white text-[10px] font-sans px-2.5 py-1 rounded-full shadow border border-white/20">
                          {photoUrl ? 'Ganti Foto' : 'Ambil Foto'}
                        </span>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* ================= TEMPLATE FOOTERS ================= */}

          {/* POSERBOX'S PLAYLIST FOOTER */}
          {currentTheme === 'poserbox_playlist' && (
            <div className="pt-2 text-current text-xs">
              <div className="flex flex-col mb-1.5">
                <span className="font-bold text-[11px] tracking-tight truncate">
                  {keyPrefix === 'strip-2' ? (custom.song2 || 'EVERY BREATH YOU TAKE') : (custom.song1 || 'ABOUT YOU')}
                </span>
                <span className="text-[9px] opacity-70 truncate font-mono">
                  {keyPrefix === 'strip-2' ? (custom.artist2 || 'The Police') : (custom.artist1 || 'The 1975')}
                </span>
              </div>
              <div className="w-full h-1 bg-current/20 rounded-full mb-2 relative overflow-visible">
                <div className="w-1/3 h-full bg-current rounded-full relative">
                  <div className="w-2 h-2 rounded-full bg-current absolute right-0 top-1/2 -translate-y-1/2 shadow-xs" />
                </div>
              </div>
              <div className="flex items-center justify-between px-2 text-current text-xs">
                <Shuffle className="w-3.5 h-3.5 opacity-70" />
                <SkipBack className="w-3.5 h-3.5 opacity-85" />
                <span className="w-6 h-6 rounded-full bg-current flex items-center justify-center text-current shadow-xs">
                  <Play className={keyPrefix === 'strip-2' ? 'w-3 h-3 text-white fill-white ml-0.5' : 'w-3 h-3 text-neutral-900 fill-neutral-900 ml-0.5'} />
                </span>
                <SkipForward className="w-3.5 h-3.5 opacity-85" />
                <Repeat className="w-3.5 h-3.5 opacity-70" />
              </div>
            </div>
          )}

          {/* CHERISH MIDNIGHT CAT FOOTER */}
          {currentTheme === 'cherish_cat' && (
            <div className="pt-2 text-white">
              <div className="p-2 rounded-xl bg-white/10 border border-white/10 backdrop-blur-xs mb-1.5">
                <div className="flex justify-between items-center text-[10px] mb-1">
                  <div className="truncate">
                    <span className="font-bold block truncate">{custom.song || 'Bercinta lewat kata'}</span>
                    <span className="text-[8px] text-sky-200/70 truncate">{custom.artist || 'Donne Maula'}</span>
                  </div>
                  <Heart className="w-3 h-3 text-sky-400 fill-sky-400 shrink-0" />
                </div>
                <div className="w-full h-1 bg-white/20 rounded-full mb-1 relative">
                  <div className="w-1/4 h-full bg-white rounded-full" />
                </div>
                <div className="flex justify-between text-[7px] text-sky-200/60 font-mono mb-1">
                  <span>01:10</span>
                  <span>04:10</span>
                </div>
                <div className="flex justify-center items-center gap-3 text-xs">
                  <SkipBack className="w-3.5 h-3.5 opacity-85" />
                  <Pause className="w-3.5 h-3.5 opacity-95" />
                  <SkipForward className="w-3.5 h-3.5 opacity-85" />
                </div>
              </div>
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-mono tracking-widest text-sky-300 font-bold bg-white/10 px-1.5 py-0.5 rounded">
                  ★ MIDNIGHT
                </span>
                <span className="font-cursive text-amber-200 text-sm tracking-wide text-right drop-shadow">
                  {custom.quote || 'One year down, forever to go ♡'}
                </span>
              </div>
            </div>
          )}

          {/* IT'S WOODZ DAY K-POP FOOTER */}
          {currentTheme === 'woodz_day' && (
            <div>
              {keyPrefix === 'strip-2' ? (
                <div className="pt-1.5 border-t border-white/40 text-white">
                  <div className="font-black text-2xl tracking-tighter italic text-white drop-shadow">
                    1996 ★
                  </div>
                  <div className="font-black text-xl tracking-tight text-white uppercase italic leading-none mt-1">
                    IT'S WOODZ DAY!!
                  </div>
                </div>
              ) : (
                <div className="pt-1.5 border-t border-stone-300">
                  <div className="bg-sky-500 text-white px-2 py-1 rounded-xl text-center font-black text-base shadow-sm tracking-tight">
                    IT'S WOODZ DAY!
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <Sparkles className="w-4 h-4 text-sky-500" />
                    <span className="text-[9px] font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-full">
                      #SEUNGYOUN_DAY
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PHETORIA SAGE GREEN FOOTER */}
          {currentTheme === 'phetoria_sage' && (
            <div className="pt-2 text-center text-white border-t border-white/20">
              <div className="flex items-center justify-center gap-2 text-[10px] font-mono font-bold tracking-widest">
                <span>{custom.brand || 'PHETORIA'}</span>
                <span className="text-xs">♡</span>
                <span>{custom.tagline || 'VINTAGE MEMORIES BOOTH'}</span>
              </div>
            </div>
          )}

          {/* VINTAGE MAHOGANY FOOTER */}
          {currentTheme === 'vintage_mahogany' && (
            <div className="pt-2 text-center text-amber-100">
              <h2 className="font-cursive text-3xl font-bold text-amber-100 leading-none drop-shadow">
                {custom.title || 'Vintage Special'}
              </h2>
              <div className="flex justify-center items-center gap-2 text-[9px] text-amber-300/70 mt-1 font-serif">
                <span>───</span>
                <span>❦</span>
                <span>───</span>
              </div>
            </div>
          )}

          {/* SUA FOTO CANDY TICKET FOOTER */}
          {currentTheme === 'suafoto_ticket' && (
            <div className="pt-1.5 border-t border-[#7c121d]/40 text-center text-[#7c121d]">
              <div className="text-[8px] font-bold uppercase tracking-wider mb-0.5">
                {custom.footer || 'Manis - Manis Suafoto.'}
              </div>
              <div className="flex justify-center items-center gap-0.5 h-4 overflow-hidden">
                {[...Array(30)].map((_, i) => (
                  <div key={i} className="bg-[#7c121d] h-full" style={{ width: `${(i % 3) + 1}px`, marginRight: '1px' }} />
                ))}
              </div>
            </div>
          )}

          {/* FLIGHT TICKET IDN FOOTER */}
          {currentTheme === 'boarding_flight' && (
            <div className="pt-1 border-t border-dashed border-stone-400 text-center font-mono">
              <div className="flex justify-center items-center gap-0.5 h-5 overflow-hidden my-0.5">
                {[...Array(32)].map((_, i) => (
                  <div key={i} className="bg-stone-800 h-full" style={{ width: `${(i % 3) + 1}px`, marginRight: '1px' }} />
                ))}
              </div>
              <span className="text-[7.5px] text-stone-500 font-bold">
                BOARDING PASS • {custom.airline || "LION'S AIR"}
              </span>
            </div>
          )}

          {/* PHOTOLOOKUP 2026 FOOTER */}
          {currentTheme === 'photolookup_cream' && (
            <div className="pt-1.5 border-t border-stone-300 text-center text-[#0f172a] text-[8px] font-mono">
              <span>★ ★ ★ {custom.tagline || 'SAVE THE BEST MOMENT'} ★ ★ ★</span>
            </div>
          )}

          {/* POLAROID MOSAIC FOOTER */}
          {currentTheme === 'polaroid_mosaic' && (
            <div className="pt-2 text-center font-cursive text-stone-700 text-sm font-bold">
              {custom.caption || 'moments frozen in time'}
            </div>
          )}

          {/* SELFIT STUDIO MINIMAL FOOTER */}
          {currentTheme === 'selfit_minimal' && (
            <div className="pt-1.5 border-t border-stone-200 text-stone-400 text-[8px] font-mono flex justify-between">
              <span>KOREA PHOTOSTUDIO</span>
              <span>{custom.date || 'OCT 2026'}</span>
            </div>
          )}

          {/* 1989 TAYLOR'S DENIM FOOTER */}
          {currentTheme === 'denim_1989' && (
            <div className="pt-2 text-center relative select-none">
              <div className="relative inline-block">
                <span className="text-4xl sm:text-5xl font-black tracking-tight text-sky-200 block drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                  {custom.album || '1989'}
                </span>
                <span className="absolute -top-1 -right-5 text-sky-200">
                  <Sparkles className="w-4 h-4 text-sky-200" />
                </span>
              </div>
              <p className="font-cursive text-sm sm:text-base font-bold text-white tracking-wider -mt-1 drop-shadow">
                {custom.version || "TAYLOR'S VERSION"}
              </p>
              <div className="absolute right-0 bottom-0 text-xl text-sky-300 opacity-80">
                ☆
              </div>
            </div>
          )}

          {/* ROBLOX XXL STARRY LYRICS FOOTER */}
          {currentTheme === 'roblox_xxl' && (
            <div className="pt-2 flex items-center justify-between text-white border-t-2 border-white mt-1">
              <div>
                <h4 className="font-black text-sm tracking-tighter uppercase leading-none">
                  {custom.brand || 'ROBLOX'}
                </h4>
                <span className="text-[7px] font-mono tracking-widest text-sky-300 font-bold">
                  PHOTOBOOTH
                </span>
              </div>
              <span className="text-2xl font-black text-sky-200 tracking-tight font-sans drop-shadow">
                {custom.edition || 'XXL'}
              </span>
            </div>
          )}

          {/* SPECIAL DAY CINEMA TICKET FOOTER */}
          {currentTheme === 'special_day_ticket' && (
            <div>
              {keyPrefix === 'strip-2' ? (
                <div className="pt-1 border-t border-dashed border-[#3d0a12]/60 text-center">
                  <div className="flex justify-center items-center gap-0.5 h-6 overflow-hidden my-0.5">
                    {[...Array(36)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-[#3d0a12] h-full"
                        style={{ width: `${(i % 3) + 1}px`, marginRight: '1px' }}
                      />
                    ))}
                  </div>
                  <span className="text-[8px] font-mono tracking-widest text-[#4a0e17] font-bold block">
                    {custom.barcodeText || 'PANORAMA'}
                  </span>
                </div>
              ) : (
                <div className="pt-1 border-t border-dashed border-[#3d0a12]/60 text-center relative">
                  <h2 className="font-cursive text-3xl font-bold text-[#4a0e17] leading-tight">
                    {custom.title || 'Special Day'}
                  </h2>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-[#4a0e17] mt-0.5">
                    <Camera className="w-3.5 h-3.5 inline" />
                    <Heart className="w-3 h-3 inline text-[#4a0e17] fill-[#4a0e17]" />
                  </div>
                  <div className="w-4 h-2 bg-[#f0eee9] rounded-t-full mx-auto -mb-3 mt-1 shadow-inner" />
                </div>
              )}
            </div>
          )}

          {/* 70s & 90s RETRO CHECKERBOARD FOOTER */}
          {currentTheme === 'retro_90s_pop' && (
            <div className="pt-1.5 border-t border-white/30 text-center relative">
              <div className="inline-block bg-[#facc15] text-[#1c1917] text-[8px] font-mono font-black px-2 py-0.5 rounded shadow mb-1">
                BOOM CHUTE 5¢
              </div>
              <div>
                <h3 className="font-black text-2xl tracking-wider text-white italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] border-b-2 border-white pb-0.5 inline-block">
                  {custom.title || 'RETRO'} <span className="font-mono text-sm not-italic">{custom.subYear || "1990'S"}</span>
                </h3>
              </div>
              <div className="flex justify-center items-center gap-2 text-[10px] text-amber-200 mt-1 font-mono font-bold tracking-widest">
                ★ 1990S VINTAGE ★
              </div>
            </div>
          )}

          {/* SPOTIFY FOOL FOR YOU FOOTER */}
          {currentTheme === 'spotify_fool' && (
            <div>
              {keyPrefix === 'strip-2' ? (
                <div className="pt-1.5 border-t border-[#441119]/30 text-center text-[#441119]">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-xs">●</span>
                    <div className="flex items-center gap-0.5 h-3">
                      {[...Array(22)].map((_, i) => (
                        <div
                          key={i}
                          className="w-0.5 bg-[#441119] rounded-full"
                          style={{ height: `${((Math.sin(i * 0.9) + 1.2) * 5) + 3}px` }}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="font-sans font-bold text-[9px] tracking-widest uppercase block text-[#441119]/80">
                    {custom.headline || "I'M SUCH A"}
                  </span>
                  <h1 className="font-serif font-black text-4xl leading-none text-[#441119] my-0.5 tracking-tight">
                    {custom.bigWord || 'FOOL'}
                  </h1>
                  <span className="font-sans font-black text-xs tracking-widest uppercase block text-[#441119]/90">
                    {custom.subline || 'FOR YOU'}
                  </span>
                  <div className="flex justify-center gap-3 text-xs opacity-60 mt-1">
                    <span>☆</span>
                    <span>☆</span>
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t border-white/20 text-white text-center">
                  <p className="font-cursive text-sm italic text-white/80 mb-1">
                    i just...
                  </p>
                  <div className="p-1 bg-white/10 rounded-lg border border-white/20 text-[9px] font-mono text-white/90">
                    THE CRANBERRIES • INDIE 90s
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AIRMAIL FOOTER */}
          {currentTheme === 'airmail' && (
            <div className="pt-2 border-t border-dashed border-neutral-400 text-[10px] font-mono">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-neutral-700">SEND TO:</div>
                  <div className="font-cursive font-bold text-xs text-neutral-900">{custom.recipient || 'My Beloved One'}</div>
                </div>
                <div className="border border-red-700 text-red-700 px-1.5 py-0.5 rounded font-black text-[10px] rotate-[-6deg]">
                  {custom.stampText || 'APPROVED'}
                </div>
              </div>
              <div className="mt-1 text-[8px] text-neutral-500 flex justify-between border-t border-neutral-300 pt-1">
                <span className="font-black">{custom.brand || 'MEENIE BOX!'}</span>
                <span>{custom.postmark || 'AIRMAIL POSTAGE PAID'}</span>
              </div>
            </div>
          )}

          {/* THEATER TICKET FOOTER */}
          {currentTheme === 'theater' && (
            <div className="pt-1.5 border-t-2 border-current text-center">
              <div className="border-y border-current py-0.5 my-1">
                <p className="text-[8.5px] font-serif uppercase tracking-wider font-bold">
                  {custom.ribbon || 'SAVE THE BEST MOMENT'}
                </p>
              </div>
              <span className="font-serif italic text-2xl font-black tracking-tight">
                {custom.studioName || 'kafastudio.'}
              </span>
            </div>
          )}

          {/* HARU FILM FOOTER */}
          {currentTheme === 'haru_cloud' && (
            <div className="pt-1.5 border-t border-sky-200 text-center text-sky-700 text-[10px] font-mono flex items-center justify-between">
              <span>{custom.date || '2026.10.12'}</span>
              <span className="font-bold">{custom.studio || 'haru studio'}</span>
            </div>
          )}

          {/* LIFE4CUTS FOOTER */}
          {currentTheme === 'life4cuts' && (
            <div className="pt-2 border-t border-indigo-400/40 text-center text-indigo-200 text-[9px] font-mono flex items-center justify-between">
              <span>{custom.date || '2026.10.12'}</span>
              <span className="font-bold text-white">{custom.studioCode || 'SEOUL NO. 04'}</span>
            </div>
          )}

          {/* EDITORIAL STORY FOOTER */}
          {currentTheme === 'editorial' && (
            <div className="pt-1.5 border-t-2 border-black flex items-center justify-between text-[8px] font-mono">
              <span>{custom.date || 'OCTOBER 12, 2026'}</span>
              <span className="font-bold">EDITION 01</span>
            </div>
          )}

        </div>

        {/* ================= INTERACTIVE PLACED STICKERS OVERLAY ================= */}
        {stickers.map((stk) => (
          <div
            key={stk.instanceId}
            onClick={(e) => {
              e.stopPropagation();
              if (onRemoveSticker) onRemoveSticker(stk.instanceId);
            }}
            className="absolute z-30 cursor-pointer group hover:scale-110 transition-transform select-none"
            style={{
              left: `${stk.x}%`,
              top: `${stk.y}%`,
              transform: `translate(-50%, -50%) rotate(${stk.rotation || 0}deg) scale(${stk.scale || 1})`
            }}
            title="Klik untuk menghapus stiker ini"
          >
            {stk.isBadge ? (
              <div
                className="px-2 py-0.5 rounded font-black text-xs shadow-md border border-white/20"
                style={{ backgroundColor: stk.bg || '#e11d48', color: stk.color || '#fff' }}
              >
                {stk.text}
              </div>
            ) : stk.isTape ? (
              <div
                className="px-3 py-0.5 text-[8px] font-mono font-bold shadow opacity-90 border-x-2 border-dashed border-white/40"
                style={{ backgroundColor: stk.bg, color: '#111' }}
              >
                {stk.text}
              </div>
            ) : (
              <span className="text-3xl filter drop-shadow-md">{stk.emoji}</span>
            )}
            <span className="opacity-0 group-hover:opacity-100 absolute -top-3 -right-3 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[9px] font-bold shadow">
              ✕
            </span>
          </div>
        ))}

      </div>
    );
  };

  return (
    <div className="inline-flex flex-row flex-nowrap items-stretch justify-center p-1 sm:p-2 select-none max-w-none">
      {renderSingleStrip('strip-1')}
      {isTwin && (
        <>
          {/* Dashed scissor cutting guide between twin strips */}
          <div className="flex flex-col items-center justify-between px-2 sm:px-3 text-stone-400 select-none pointer-events-none">
            <Scissors className="w-3.5 h-3.5 text-stone-400 rotate-90" />
            <div className="w-px flex-1 border-r-2 border-dashed border-stone-300 my-2" />
            <span className="text-[7.5px] font-mono tracking-widest text-stone-400 rotate-90 my-6 whitespace-nowrap">
              POTONG DI SINI
            </span>
            <div className="w-px flex-1 border-r-2 border-dashed border-stone-300 my-2" />
            <Scissors className="w-3.5 h-3.5 text-stone-400 rotate-90" />
          </div>
          {renderSingleStrip('strip-2')}
        </>
      )}
    </div>
  );
}
