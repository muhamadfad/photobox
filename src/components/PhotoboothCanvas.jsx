import React from 'react';
import { getFilterStyle } from '../utils/filterEngine';
import {
  Scissors,
  Disc,
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Heart,
  Cloud,
  Camera,
  Plane,
  Ticket,
  Music,
  Feather,
  Sun,
  Coffee
} from 'lucide-react';

// Crisp 4-point star vector (replaces generic AI sparkle icons/emojis)
const FourPointStar = ({ className = 'w-3 h-3', fill = 'currentColor' }) => (
  <svg viewBox="0 0 24 24" fill={fill} className={className} aria-hidden="true">
    <path d="M12 1L14.8 9.2L23 12L14.8 14.8L12 23L9.2 14.8L1 12L9.2 9.2L12 1Z" />
  </svg>
);

// Peeking Black Cat SVG for Cherish Midnight Cat template
const PeekingCatSvg = ({ className = 'w-8 h-6' }) => (
  <svg viewBox="0 0 64 44" fill="none" className={className} aria-hidden="true">
    <path d="M12 42V18L6 4L20 12C24 10.5 28 10 32 10C36 10 40 10.5 44 12L58 4L52 18V42H12Z" fill="#090d16" stroke="#38bdf8" strokeWidth="1.5" />
    <ellipse cx="23" cy="25" rx="4.5" ry="4" fill="#facc15" />
    <ellipse cx="41" cy="25" rx="4.5" ry="4" fill="#facc15" />
    <ellipse cx="23" cy="25" rx="1.8" ry="3.2" fill="#090d16" />
    <ellipse cx="41" cy="25" rx="1.8" ry="3.2" fill="#090d16" />
    <polygon points="32,29 29.5,32.5 34.5,32.5" fill="#f472b6" />
    <path d="M8 28H16M8 33H15M48 28H56M49 33H56" stroke="#bae6fd" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// Vintage Brass Wall Lamp SVG for Vintage Mahogany template
const BrassLampSvg = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M8 14L5 8H19L16 14H8Z" fill="#f59e0b" fillOpacity="0.35" stroke="#fcd34d" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M12 14V19M8 19H16" stroke="#fcd34d" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="6" r="2" fill="#fef08a" />
  </svg>
);

// Crisp Barcode Vector Strip
const BarcodeVector = ({ color = '#18181b', heightClass = 'h-5', count = 34 }) => {
  const widths = [2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 2, 1, 3, 1, 2];
  return (
    <div className={`flex justify-center items-center gap-[1.5px] ${heightClass} overflow-hidden select-none`}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="h-full shrink-0"
          style={{
            backgroundColor: color,
            width: `${widths[i % widths.length]}px`
          }}
        />
      ))}
    </div>
  );
};

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
        : currentTheme === 'roblox_xxl'
        ? '#0a192f'
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
            ? 'border-[3px] border-white'
            : currentTheme === 'poserbox_playlist' && keyPrefix === 'strip-2'
            ? 'border border-stone-300'
            : ''
        }`}
        style={{
          backgroundColor: stripEffectiveBg,
          boxShadow: '0 20px 40px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.15)',
          ...(currentTheme === 'vintage_mahogany' && {
            backgroundImage:
              'repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 5px), linear-gradient(180deg, #3d2214 0%, #241209 100%)'
          }),
          ...(currentTheme === 'suafoto_ticket' && {
            backgroundImage:
              'repeating-linear-gradient(-45deg, #7c121d 0px, #7c121d 10px, #9f1d2c 10px, #9f1d2c 20px)'
          }),
          ...(currentTheme === 'roblox_xxl' && {
            backgroundImage: 'linear-gradient(180deg, #061021 0%, #0f2547 50%, #071326 100%)'
          }),
          ...(currentTheme === 'woodz_day' && keyPrefix === 'strip-1' && {
            backgroundImage:
              'linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)',
            backgroundSize: '16px 16px'
          })
        }}
      >
        {/* ================= SPECIAL TEMPLATE FRAME ACCENTS ================= */}

        {/* 1. Theater Ticket, Special Day Ticket & Cinema Stub: Scalloped ticket notch cutouts */}
        {(currentTheme === 'theater' || currentTheme === 'special_day_ticket' || currentTheme === 'cinema_stub') && (
          <>
            <div className="absolute left-0 top-12 bottom-12 w-3 flex flex-col justify-between pointer-events-none z-20">
              {[...Array(11)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-[#efede7] rounded-r-full -ml-1.5 shadow-inner" />
              ))}
            </div>
            <div className="absolute right-0 top-12 bottom-12 w-3 flex flex-col justify-between pointer-events-none z-20">
              {[...Array(11)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-[#efede7] rounded-l-full -mr-1.5 ml-auto shadow-inner" />
              ))}
            </div>
          </>
        )}

        {/* 2. Denim Stitch Border Accent */}
        {currentTheme === 'denim_1989' && (
          <div className="absolute inset-1.5 border-2 border-dashed border-sky-300/45 rounded-xl pointer-events-none z-20" />
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

        {/* 5. Concert VIP Lanyard Slot Cutout at Top */}
        {currentTheme === 'concert_vip' && (
          <div className="w-12 h-2 bg-[#efede7] rounded-full mx-auto mb-1.5 border border-stone-700 shadow-inner" />
        )}

        {/* Inner Card Container */}
        <div
          className={`relative rounded-xl p-3 flex flex-col h-full overflow-hidden z-10 ${
            currentTheme === 'retro_90s_pop' ? 'ml-2' : ''
          } ${
            currentTheme === 'vintage_mahogany' ? 'border border-amber-500/40' : ''
          } ${
            currentTheme === 'londoner' || currentTheme === 'morning_post' || currentTheme === 'paris_gazette'
              ? 'border border-stone-800/40'
              : ''
          }`}
          style={{
            backgroundColor: stripCardBg,
            color: stripTextColor,
            ...(currentTheme === 'roblox_xxl' && {
              backgroundImage:
                'radial-gradient(circle at 20% 15%, rgba(56, 189, 248, 0.16) 0%, transparent 45%), radial-gradient(circle at 85% 75%, rgba(125, 211, 252, 0.14) 0%, transparent 50%), linear-gradient(180deg, #071224 0%, #0f2444 52%, #08152b 100%)'
            }),
            ...(currentTheme === 'purikura' && {
              backgroundImage:
                'radial-gradient(#f472b6 0.75px, transparent 0.75px), linear-gradient(180deg, #fdf2f8 0%, #fce7f3 100%)',
              backgroundSize: '12px 12px, 100% 100%'
            })
          }}
        >
          {/* Starry Constellation Background Overlay for roblox_xxl */}
          {currentTheme === 'roblox_xxl' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-75">
              <FourPointStar className="w-3 h-3 text-sky-200 absolute top-8 left-2" />
              <FourPointStar className="w-2 h-2 text-white absolute top-24 right-2.5" />
              <FourPointStar className="w-3.5 h-3.5 text-sky-300 absolute top-1/2 left-1.5" />
              <FourPointStar className="w-2.5 h-2.5 text-sky-100 absolute bottom-20 right-2" />
              <svg viewBox="0 0 260 60" className="w-full absolute bottom-10 left-0 opacity-20" fill="#bae6fd">
                <path d="M0 60 L0 35 Q25 15 55 32 Q85 10 120 28 Q155 5 195 28 Q230 12 260 30 L260 60 Z" />
              </svg>
            </div>
          )}

          {/* ================= TEMPLATE HEADERS (ALL 29 TEMPLATES) ================= */}

          {/* 1. POSERBOX'S PLAYLIST HEADER */}
          {currentTheme === 'poserbox_playlist' && (
            <div className="text-left pb-1.5 border-b border-current/20 mb-1 flex items-center justify-between">
              <span className="font-serif italic font-bold text-xs tracking-wide">
                {custom.header || "Pikubooth's Playlist"}
              </span>
              <div className="flex items-center gap-1 opacity-50">
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                <div className="h-0.5 w-12 bg-current rounded" />
              </div>
            </div>
          )}

          {/* 2. CHERISH MIDNIGHT CAT HEADER */}
          {currentTheme === 'cherish_cat' && (
            <div className="flex items-center justify-between pb-1.5 border-b border-sky-400/25 mb-1 text-[10px] font-mono text-sky-200">
              <span className="tracking-wide font-semibold">{custom.handle || '@pikubooth'}</span>
              <div className="flex items-center gap-1 text-sky-300">
                <FourPointStar className="w-2.5 h-2.5" />
                <FourPointStar className="w-3.5 h-3.5 text-amber-200" />
              </div>
            </div>
          )}

          {/* 3. IT'S WOODZ DAY K-POP HEADER */}
          {currentTheme === 'woodz_day' && (
            <div>
              {keyPrefix === 'strip-2' ? (
                <div className="text-left pb-1.5 border-b border-white/30 mb-1 text-white font-mono text-[9px] uppercase flex justify-between items-center">
                  <span className="font-bold tracking-wider">{custom.idolName || 'CHO SEUNGYOUN'} • {custom.idolDate || 'AUGUST 5TH'}</span>
                  <span className="bg-white text-stone-900 font-black px-1.5 py-0.2 rounded-xs text-[8px]">96</span>
                </div>
              ) : (
                <div className="flex items-center justify-between pb-1.5 border-b-2 border-stone-900 mb-1">
                  <span className="text-[8px] font-mono font-black bg-stone-900 text-white px-1.5 py-0.5 rounded-xs tracking-wider">
                    PIKUBOOTH
                  </span>
                  <div className="flex items-center gap-1 text-stone-800">
                    <FourPointStar className="w-3 h-3 text-orange-500" />
                    <span className="text-[8px] font-mono font-black tracking-tight uppercase">SUNSET CHASER</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. PHETORIA SAGE GREEN HEADER */}
          {currentTheme === 'phetoria_sage' && (
            <div className="text-center pb-1.5 border-b border-white/25 mb-1 flex items-center justify-between text-white/95">
              <span className="text-[8px] font-mono tracking-[0.2em] uppercase font-bold">
                {custom.stampSide || 'PIKUBOOTH'}
              </span>
              <FourPointStar className="w-2.5 h-2.5 text-amber-200" />
              <span className="text-[8px] font-mono tracking-[0.15em] uppercase font-bold">EST. 2026</span>
            </div>
          )}

          {/* 5. VINTAGE MAHOGANY & BRASS LAMPS HEADER */}
          {currentTheme === 'vintage_mahogany' && (
            <div className="text-center pb-1.5 border-b border-amber-500/35 mb-1">
              <div className="flex items-center justify-between text-[8.5px] font-serif text-amber-200/90 uppercase tracking-[0.2em] font-bold">
                <span>{custom.ornament || 'EST. 2026'}</span>
                <BrassLampSvg className="w-4 h-4" />
                <span>{custom.header || 'PIKUBOOTH'}</span>
              </div>
            </div>
          )}

          {/* 6. SUA FOTO CANDY TICKET HEADER */}
          {currentTheme === 'suafoto_ticket' && (
            <div className="border-b-2 border-[#7c121d] pb-1.5 mb-1">
              <div className="flex items-center justify-between">
                <h2 className="font-cursive text-2xl font-bold text-[#7c121d] leading-none">
                  {custom.brand || "Piku Foto's"}
                </h2>
                <span className="text-[8px] font-mono font-black bg-[#7c121d] text-white px-1.5 py-0.5 rounded-xs tracking-wider">
                  {custom.city || 'STUDIO'}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[8px] font-mono font-black text-[#7c121d] tracking-wider">
                  {custom.ticketTitle || 'PIKUBOOTH GOLDEN TICKET'}
                </span>
                <span className="text-[7.5px] font-mono font-bold text-[#7c121d]/80">
                  {custom.duration || 'SELAMANYA'}
                </span>
              </div>
            </div>
          )}

          {/* 7. FLIGHT TICKET IDN BOARDING PASS HEADER */}
          {currentTheme === 'boarding_flight' && (
            <div className="pb-1.5 border-b border-dashed border-stone-400 mb-1 font-mono text-[9px]">
              <div className="bg-[#1e385c] text-white px-2 py-1 rounded-xs flex justify-between items-center font-bold mb-1">
                <span className="tracking-wider">{keyPrefix === 'strip-2' ? (custom.flight2 || 'IDN ➔ SGP') : (custom.flight1 || 'IDN ➔ USA')}</span>
                <span className="flex items-center gap-1 text-[8px]">
                  <Plane className="w-3 h-3 inline" />
                  <span>BOARDING PASS</span>
                </span>
              </div>
              <div className="flex justify-between text-stone-700 font-bold text-[8px] px-0.5">
                <span>GATE: {keyPrefix === 'strip-2' ? (custom.gate2 || '07') : (custom.gate1 || '14')}</span>
                <span>CLASS: ECONOMY</span>
                <span>SEAT: {keyPrefix === 'strip-2' ? (custom.seat2 || '11B') : (custom.seat1 || '30A')}</span>
              </div>
            </div>
          )}

          {/* 8. PHOTOLOOKUP 2026 NAVY STARS HEADER */}
          {currentTheme === 'photolookup_cream' && (
            <div className="text-center pb-1.5 border-b-2 border-[#0f172a] mb-1">
              <div className="flex justify-center items-center gap-1.5 text-[8.5px] text-[#991b1b] font-bold mb-0.5">
                <span>★</span>
                <span className="font-mono text-[#0f172a] font-black tracking-widest">{custom.year || '2026'}</span>
                <span>★</span>
              </div>
              <h3 className="font-serif font-black text-xl tracking-[0.18em] text-[#0f172a] uppercase leading-none">
                {custom.brand || 'PIKULOOKUP'}
              </h3>
            </div>
          )}

          {/* 9. POLAROID MOSAIC HEADER */}
          {currentTheme === 'polaroid_mosaic' && (
            <div className="text-center pb-1.5 border-b border-stone-200 mb-1 flex items-center justify-between text-[10px] font-serif text-stone-700 italic">
              <span>instant archive</span>
              <span className="font-mono not-italic text-[8px] font-bold text-stone-400">{custom.date || 'OCT 2026'}</span>
            </div>
          )}

          {/* 10. SELFIT STUDIO MINIMAL HEADER */}
          {currentTheme === 'selfit_minimal' && (
            <div className="text-left pb-1.5 border-b border-stone-200 mb-1 flex items-baseline justify-between">
              <h3 className="font-serif italic text-lg font-bold text-stone-800 leading-none">
                {custom.brand || 'pikubooth studio.'}
              </h3>
              <span className="text-[8px] text-stone-400 font-mono uppercase tracking-wider">
                {custom.subtitle || 'quiet moments'}
              </span>
            </div>
          )}

          {/* 11. 1989 TAYLOR'S DENIM HEADER */}
          {currentTheme === 'denim_1989' && (
            <div className="text-center pb-2 relative">
              <div className="flex items-center justify-center gap-2.5 text-white">
                <FourPointStar className="w-3 h-3 text-sky-200" />
                <h2 className="font-serif tracking-[0.25em] text-lg font-black uppercase text-white drop-shadow">
                  {custom.brand || 'PIKUBOOTH'}
                </h2>
                <FourPointStar className="w-3 h-3 text-sky-200" />
              </div>
            </div>
          )}

          {/* 12. ROBLOX XXL STARRY LYRICS HEADER (Zero Truncation, Authentic Cutout Paper Strip) */}
          {currentTheme === 'roblox_xxl' && (
            <div className="relative z-10 mb-1.5">
              <div className="bg-white text-[#071224] px-2.5 py-1 rounded-xs border border-sky-200 shadow-sm flex items-center justify-between gap-1.5">
                <span className="font-serif italic font-bold text-[10px] leading-tight tracking-tight text-[#071224]">
                  "{custom.lyric1 || 'I still remember, I will forever'}"
                </span>
                <FourPointStar className="w-2.5 h-2.5 text-[#0f2547] shrink-0" />
              </div>
            </div>
          )}

          {/* 13. SPECIAL DAY CINEMA TICKET HEADER */}
          {currentTheme === 'special_day_ticket' && (
            <div>
              {keyPrefix === 'strip-2' ? (
                <div className="text-center pb-1.5 border-b border-dashed border-[#3d0a12]/60 mb-1">
                  <div className="w-4 h-2 bg-[#efede7] rounded-b-full mx-auto -mt-3 mb-0.5 shadow-inner" />
                  <h2 className="font-cursive text-3xl font-bold text-[#4a0e17] leading-tight">
                    {custom.title || 'Special Day'}
                  </h2>
                </div>
              ) : (
                <div className="text-center pb-1.5 border-b border-dashed border-[#3d0a12]/60 mb-1">
                  <span className="text-[8px] font-mono tracking-[0.25em] text-[#4a0e17] font-bold block mb-1">
                    {custom.barcodeText || 'PANORAMA'}
                  </span>
                  <BarcodeVector color="#3d0a12" heightClass="h-5" count={36} />
                </div>
              )}
            </div>
          )}

          {/* 14. 70s & 90s RETRO CHECKERBOARD HEADER */}
          {currentTheme === 'retro_90s_pop' && (
            <div className="flex items-center justify-between pb-1.5 border-b border-white/25 mb-1">
              <div className="bg-white text-[#dc2626] px-2 py-0.5 rounded-xs font-black text-xs shadow-sm tracking-tight -rotate-3 border border-stone-900">
                {custom.badgeTop || '70s'}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-amber-200">
                <Camera className="w-3.5 h-3.5 inline" />
                <span className="text-[8.5px] font-mono font-bold bg-black/35 px-1.5 py-0.5 rounded-xs border border-amber-300/30">
                  REC • 90s
                </span>
              </div>
            </div>
          )}

          {/* 15. SPOTIFY FOOL FOR YOU HEADER */}
          {currentTheme === 'spotify_fool' && (
            <div>
              {keyPrefix === 'strip-2' ? (
                <div className="flex justify-between items-center pb-1.5 border-b border-[#441119]/30 mb-1 text-[9px] font-mono text-[#441119]">
                  <span className="font-bold tracking-wider">● SPOTIFY AUDIO</span>
                  <Disc className="w-3.5 h-3.5 text-[#441119]" />
                </div>
              ) : (
                <div className="text-center pb-1.5 border-b border-white/20 mb-1">
                  <div className="text-[8.5px] font-mono uppercase tracking-[0.2em] text-white/90 mb-1 font-bold">
                    {custom.groupName || 'PIKUBOOTH CLUB'}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-white">
                    <Disc className="w-3 h-3 text-white shrink-0" />
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

          {/* 16. THEATER TICKET HEADER */}
          {currentTheme === 'theater' && (
            <div className="text-center pb-2 border-b-2 border-current mb-1">
              <div className="flex justify-center items-center gap-1.5 text-[10px] font-serif tracking-widest mb-0.5">
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>
              <h2 className="font-cursive text-3xl font-bold leading-tight">
                {custom.title || 'Theater Show'}
              </h2>
              <div className="mt-1.5 grid grid-cols-3 border-t border-current text-[10px] font-serif uppercase tracking-tight divide-x divide-current">
                <div className="py-0.5 text-center">
                  <span className="block text-[7.5px] opacity-70">Row</span>
                  <span className="font-bold">{custom.row || 'B2'}</span>
                </div>
                <div className="py-0.5 text-center">
                  <span className="block text-[7.5px] opacity-70">Show</span>
                  <span className="font-bold">{custom.show || '02'}</span>
                </div>
                <div className="py-0.5 text-center">
                  <span className="block text-[7.5px] opacity-70">{custom.date || 'Sun, 29 Mar'}</span>
                  <span className="font-bold">{custom.time || '20.00'}</span>
                </div>
              </div>
            </div>
          )}

          {/* 17. HARU FILM CLOUDS HEADER */}
          {currentTheme === 'haru_cloud' && (
            <div className="text-center pb-2 relative">
              <div className="flex items-center justify-center gap-1.5 text-xs text-sky-600 font-semibold mb-0.5">
                <Cloud className="w-3.5 h-3.5 text-sky-500 fill-sky-200 inline" />
                <span className="font-sans tracking-widest text-[10px] uppercase font-bold">
                  {custom.cloudNote || 'pure soft moments'}
                </span>
                <Cloud className="w-3.5 h-3.5 text-sky-500 fill-sky-200 inline" />
              </div>
              <h2 className="font-serif italic font-bold text-2xl tracking-wide text-sky-800 leading-none">
                {custom.brand || 'piku film.'}
              </h2>
            </div>
          )}

          {/* 18. LIFE4CUTS CLASSIC HEADER */}
          {currentTheme === 'life4cuts' && (
            <div className="text-center pb-2 border-b border-indigo-400/40 mb-1">
              <div className="inline-block bg-rose-600 text-white text-[8.5px] font-bold px-2.5 py-0.5 rounded-full mb-1 tracking-wider">
                ORIGINAL PHOTOBOOTH
              </div>
              <h2 className="font-sans font-black text-lg tracking-tight text-white leading-none">
                {custom.brand || '인생네컷 • LIFE 4 CUTS'}
              </h2>
              <p className="text-[8.5px] text-indigo-200 uppercase tracking-widest mt-1">
                {custom.sub || 'THE BEST MOMENT OF MY LIFE'}
              </p>
            </div>
          )}

          {/* 19. PHOTOISM MONOCHROME HEADER */}
          {currentTheme === 'photoism' && (
            <div className="pb-2 border-b border-neutral-800 mb-1 flex items-center justify-between">
              <div>
                <h2 className="font-serif italic text-2xl font-black tracking-tight text-white leading-none">
                  {custom.brand || 'pikubooth.'}
                </h2>
                <p className="text-[8px] text-neutral-400 uppercase tracking-widest mt-0.5">
                  {custom.tag || 'self photostudio project'}
                </p>
              </div>
              <span className="text-[8.5px] font-mono text-neutral-300 border border-neutral-700 px-1.5 py-0.5 rounded-xs font-bold">
                {custom.city || 'SEOUL'}
              </span>
            </div>
          )}

          {/* 20. PURIKURA KAWAII GLITTER HEADER */}
          {currentTheme === 'purikura' && (
            <div className="text-center pb-1.5 border-b-2 border-pink-300 mb-1">
              <div className="inline-flex items-center gap-1 bg-pink-500 text-white text-[8px] font-mono font-bold px-2 py-0.5 rounded-full mb-0.5 shadow-2xs">
                <FourPointStar className="w-2.5 h-2.5 text-yellow-200" />
                <span>{custom.sparkleNote || 'キラキラ SUPER CUTE'}</span>
                <FourPointStar className="w-2.5 h-2.5 text-yellow-200" />
              </div>
              <h2 className="font-sans font-black text-base tracking-tight text-pink-700 leading-tight">
                {custom.title || 'プリクラ ★ PURIKURA'}
              </h2>
            </div>
          )}

          {/* 21. DETIK AIR BOARDING PASS HEADER */}
          {currentTheme === 'boarding' && (
            <div className="pb-1.5 border-b-2 border-dashed border-[#601322]/40 mb-1">
              <div className="bg-[#601322] text-white px-2 py-1 rounded-xs flex items-center justify-between text-[9px] font-mono font-bold">
                <span>{custom.airline || 'PIKU AIR'}</span>
                <span className="flex items-center gap-1">
                  <Plane className="w-3 h-3" />
                  <span>{custom.flight || 'GF 6815'}</span>
                </span>
              </div>
              <div className="flex items-center justify-between px-1 py-1 bg-stone-100 rounded-xs mt-1 border border-stone-200">
                <span className="font-sans font-black text-base text-[#601322] leading-none">
                  {custom.origin || 'USA'}
                </span>
                <div className="flex items-center gap-1 text-[#601322]/70 text-[8px] font-mono">
                  <span>──────</span>
                  <Plane className="w-3 h-3 text-[#601322]" />
                  <span>──────</span>
                </div>
                <span className="font-sans font-black text-base text-[#601322] leading-none">
                  {custom.destination || 'CN'}
                </span>
              </div>
              <div className="grid grid-cols-3 text-[8px] font-mono text-stone-600 mt-1 text-center divide-x divide-stone-300">
                <div>GATE: <strong className="text-stone-900">{custom.gate || '15'}</strong></div>
                <div>SEAT: <strong className="text-stone-900">{custom.seat || '18A'}</strong></div>
                <div>TIME: <strong className="text-stone-900">{custom.departure || '10:15'}</strong></div>
              </div>
            </div>
          )}

          {/* 22. CONCERT VIP FESTIVAL PASS HEADER */}
          {currentTheme === 'concert_vip' && (
            <div className="pb-1.5 border-b border-rose-500/30 mb-1 text-center">
              <div className="bg-gradient-to-r from-rose-600 via-pink-500 to-amber-500 text-white text-[9px] font-mono font-black py-0.5 px-2 rounded-xs tracking-[0.18em] uppercase shadow-xs">
                {custom.tier || 'ALL ACCESS VIP'}
              </div>
              <h2 className="font-sans font-black text-base tracking-tight text-white mt-1 leading-none">
                {custom.festival || 'SUMMER SONIC 2026'}
              </h2>
              <div className="flex justify-between items-center text-[8px] font-mono text-rose-300 mt-1 px-1">
                <span>{custom.stage || 'MAIN STAGE'}</span>
                <span>•</span>
                <span>{custom.date || '12-14 OCT'}</span>
              </div>
            </div>
          )}

          {/* 23. VINTAGE CINEMA PERFORATED STUB HEADER */}
          {currentTheme === 'cinema_stub' && (
            <div className="pb-1.5 border-b-2 border-dashed border-[#78350f] mb-1 text-center">
              <div className="border-2 border-[#78350f] p-1 rounded-xs bg-[#fde68a]/40">
                <span className="text-[7.5px] font-mono tracking-[0.2em] block font-bold text-[#78350f]">
                  ★ GRAND PREMIERE ★
                </span>
                <h2 className="font-serif font-black text-sm tracking-tight text-[#78350f] uppercase leading-tight mt-0.5">
                  {custom.cinemaName || 'GRAND PALACE THEATRE'}
                </h2>
              </div>
              <div className="flex justify-between items-center text-[8px] font-mono font-bold mt-1 px-0.5">
                <span>{custom.admit || 'ADMIT ONE'}</span>
                <span className="text-red-700 font-black">NO. 048291</span>
              </div>
            </div>
          )}

          {/* 24. TOKYO METRO EXPRESS PASS HEADER */}
          {currentTheme === 'train_pass' && (
            <div className="pb-1.5 border-b-2 border-[#0f766e] mb-1 font-mono">
              <div className="bg-[#0f766e] text-white text-[8px] font-bold px-2 py-0.5 rounded-xs flex justify-between items-center">
                <span>{custom.line || 'SHINJUKU EXPRESS LINE'}</span>
                <span>JR PASS</span>
              </div>
              <div className="flex items-center justify-between py-1 px-1 text-[#115e59]">
                <div className="text-left">
                  <span className="text-[7px] block opacity-75">FROM</span>
                  <span className="font-sans font-black text-xs leading-none">{custom.from || 'SHINJUKU'}</span>
                </div>
                <span className="text-xs font-black text-[#0f766e]">➔</span>
                <div className="text-right">
                  <span className="text-[7px] block opacity-75">TO</span>
                  <span className="font-sans font-black text-xs leading-none">{custom.to || 'SHIBUYA'}</span>
                </div>
              </div>
            </div>
          )}

          {/* 25. EDITORIAL STORY NEWSPAPER HEADER */}
          {currentTheme === 'editorial' && (
            <div className="border-b-2 border-black pb-1.5 mb-1">
              <div className="bg-black text-white text-[8.5px] font-mono px-2 py-0.5 flex justify-between items-center font-bold">
                <span>★ PHOTOBOOTHOLOGY ★</span>
                <span>{custom.volume || 'VOL. 01'}</span>
              </div>
              <div className="pt-1.5 text-left flex items-baseline justify-between">
                <div>
                  <p className="font-serif italic text-xs text-neutral-700 leading-none">
                    {custom.headlineLead || 'Capture your'}
                  </p>
                  <h1 className="font-serif font-black text-2xl tracking-tight leading-none text-black mt-0.5">
                    {custom.headlineMain || 'STORY TODAY'}
                  </h1>
                </div>
                <Feather className="w-4 h-4 text-neutral-700 shrink-0" />
              </div>
            </div>
          )}

          {/* 26. YE OLE LONDONER HEADER */}
          {currentTheme === 'londoner' && (
            <div className="border-b-2 border-black pb-1.5 text-center mb-1">
              <div className="flex justify-between items-center text-[7px] font-serif border-b border-black pb-0.5 uppercase font-bold">
                <span>{custom.edition || 'VOL. I, NO. 1'}</span>
                <span className="italic">"{custom.motto || 'The pen is mightier'}"</span>
              </div>
              <h1 className="font-blackletter text-2xl sm:text-3xl font-bold tracking-tight text-black mt-0.5 leading-none">
                {custom.masthead || 'Ye Ole Londoner'}
              </h1>
              <div className="text-[10px] font-serif font-black uppercase tracking-widest mt-1 border-t border-black pt-0.5">
                {custom.headline || 'GOOD TIMES TODAY!'}
              </div>
            </div>
          )}

          {/* 27. VOGUE HIGH FASHION MAGAZINE HEADER */}
          {currentTheme === 'vogue_chic' && (
            <div className="border-b-2 border-black pb-1.5 text-center mb-1">
              <h1 className="font-serif font-black text-3xl tracking-[0.18em] text-black leading-none uppercase">
                {custom.magazineName || 'ELEGANCE.'}
              </h1>
              <div className="flex items-center justify-between text-[7.5px] font-mono uppercase tracking-widest text-neutral-600 mt-1 border-t border-neutral-300 pt-0.5 font-bold">
                <span>{custom.subline || 'THE AUTUMN ISSUE'}</span>
                <span>PARIS • SEOUL</span>
              </div>
            </div>
          )}

          {/* 28. THE SUNDAY MORNING POST HEADER */}
          {currentTheme === 'morning_post' && (
            <div className="border-b-2 border-stone-900 pb-1.5 mb-1">
              <div className="text-center border-b border-stone-400 pb-0.5">
                <h1 className="font-serif font-black text-sm tracking-tight text-stone-900 uppercase leading-none">
                  {custom.paperName || 'THE SUNDAY MORNING POST'}
                </h1>
              </div>
              <div className="flex items-center justify-between text-[7.5px] font-mono text-stone-600 py-0.5 border-b border-stone-300">
                <span className="flex items-center gap-1 font-bold">
                  <Sun className="w-2.5 h-2.5 text-amber-600" />
                  <span>{custom.weather || 'SUNNY • 24°C'}</span>
                </span>
                <span>SUNDAY EDITION</span>
              </div>
              <div className="text-center font-serif font-black text-xs uppercase tracking-wider text-stone-900 pt-1 leading-none">
                {custom.headline || 'A PERFECT DAY TO SMILE'}
              </div>
            </div>
          )}

          {/* 29. LE PETIT PARISIEN GAZETTE HEADER */}
          {currentTheme === 'paris_gazette' && (
            <div className="border-b-2 border-[#292524] pb-1.5 mb-1 text-center">
              <div className="text-[7px] font-mono uppercase tracking-[0.2em] text-[#292524]/80 border-b border-[#292524]/40 pb-0.5 font-bold">
                {custom.city || 'PARIS, ÉDITION SPÉCIALE'}
              </div>
              <h1 className="font-serif font-black text-xl tracking-wider text-[#292524] uppercase mt-0.5 leading-none">
                {custom.masthead || 'LE PETIT PARISIEN'}
              </h1>
              <div className="text-[9.5px] font-serif italic font-bold text-[#7c2d12] mt-0.5">
                « {custom.headline || 'L’AMOUR TOUJOURS'} »
              </div>
            </div>
          )}

          {/* 30. BILLBOARD RECORD WEEKLY TIMES HEADER */}
          {currentTheme === 'record_times' && (
            <div className="border-b-2 border-stone-900 pb-1.5 mb-1">
              <div className="bg-stone-900 text-white px-2 py-1 flex items-center justify-between">
                <h1 className="font-sans font-black text-sm tracking-tighter uppercase leading-none">
                  {custom.paperName || 'THE RECORD TIMES'}
                </h1>
                <Disc className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="flex items-center justify-between text-[8px] font-mono font-bold text-stone-800 pt-1 px-0.5">
                <span className="bg-amber-300 text-stone-900 px-1 rounded-2xs font-black">
                  {custom.chart || 'TOP #1 HIT RECORD'}
                </span>
                <span>WEEKLY CHART</span>
              </div>
            </div>
          )}

          {/* 31. AIR MAIL POSTCARD HEADER */}
          {currentTheme === 'airmail' && (
            <div className="pb-1.5 border-b border-dashed border-blue-900/30 mb-1 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1 text-blue-900 font-mono font-black text-[10px] tracking-wider">
                  <Plane className="w-3.5 h-3.5 text-red-600" />
                  <span>PAR AVION</span>
                </div>
                <span className="text-[7.5px] font-mono text-stone-500 uppercase block">
                  BY AIR MAIL • CARTE POSTALE
                </span>
              </div>
              <div className="border-2 border-dashed border-red-700/80 px-1.5 py-0.5 text-center bg-red-50/50 rounded-2xs">
                <span className="text-[7px] font-mono font-black text-red-700 block leading-none">POSTAGE</span>
                <span className="text-[9px] font-serif font-black text-red-800 leading-none">25¢</span>
              </div>
            </div>
          )}

          {/* 32. FUJI INSTAX MINI FRAME HEADER */}
          {currentTheme === 'instax' && (
            <div className="pb-1 flex items-center justify-between text-[8px] font-mono text-stone-400 uppercase tracking-widest">
              <span>{custom.cameraTag || 'INSTAX MINI'}</span>
              <span>FILM 10/10</span>
            </div>
          )}

          {/* 33. CAFE & BAKERY THERMAL RECEIPT HEADER */}
          {currentTheme === 'cafe_receipt' && (
            <div className="pb-1.5 border-b-2 border-dashed border-stone-400 mb-1 font-mono text-stone-900 text-center">
              <div className="flex items-center justify-center gap-1 font-black text-xs tracking-tight">
                <Coffee className="w-3.5 h-3.5" />
                <span>{custom.cafeName || 'PHOTO CAFE & BAKERY'}</span>
              </div>
              <div className="flex justify-between text-[8px] text-stone-500 mt-1 pt-0.5 border-t border-dotted border-stone-300">
                <span>{custom.orderNo || 'ORDER #1024'}</span>
                <span>12/10/2026</span>
              </div>
            </div>
          )}

          {/* 34. VINTAGE LOVE LETTER & WAX STAMP HEADER */}
          {currentTheme === 'love_letter' && (
            <div className="pb-1.5 border-b border-rose-300 mb-1 text-center">
              <span className="text-[7.5px] font-mono uppercase tracking-[0.2em] text-rose-400 block">
                CORRESPONDANCE D’AMOUR
              </span>
              <h2 className="font-cursive text-2xl font-bold text-rose-900 leading-tight">
                {custom.to || 'To My Favorite Person,'}
              </h2>
            </div>
          )}

          {/* 35. KRAFT SCRAPBOOK & WASHI TAPE HEADER */}
          {currentTheme === 'scrapbook_kraft' && (
            <div className="pb-1.5 mb-1 text-center relative">
              <div className="bg-rose-400/90 text-white text-[7.5px] font-mono font-bold py-0.5 px-3 inline-block -rotate-1 shadow-2xs border-x-2 border-dashed border-white/60 mb-1">
                {custom.tapeNote || '////// BEST FRIENDS FOREVER //////'}
              </div>
              <h2 className="font-mono font-black text-xs tracking-wider text-amber-950 uppercase border-b border-amber-900/25 pb-0.5">
                {custom.albumTitle || 'OUR SCRAPBOOK MEMORIES'}
              </h2>
            </div>
          )}

          {/* ================= PHOTOS GRID / STACK ================= */}
          <div className="my-1.5 flex flex-col gap-2 flex-1 relative z-10">
            {activeSlots.map((idx) => {
              const photoUrl = photos[idx];
              return (
                <React.Fragment key={idx}>
                  {/* Full, Non-Truncated Lyric Bars for roblox_xxl */}
                  {currentTheme === 'roblox_xxl' && idx === 2 && (
                    <div className="bg-white text-[#071224] px-2.5 py-1 rounded-xs border border-sky-200 shadow-sm flex items-center justify-between gap-1 -my-0.5 z-20">
                      <FourPointStar className="w-2.5 h-2.5 text-[#0f2547] shrink-0" />
                      <span className="font-serif italic font-bold text-[9.5px] leading-tight text-center flex-1 text-[#071224]">
                        "{custom.lyric2 || "Backseat secrets, we won't ever tell,"}"
                      </span>
                    </div>
                  )}
                  {currentTheme === 'roblox_xxl' && idx === 3 && (
                    <div className="bg-sky-100 text-[#071224] px-2.5 py-1 rounded-xs border border-white shadow-sm flex items-center justify-between gap-1 -my-0.5 z-20">
                      <span className="font-mono font-black text-[9.5px] uppercase tracking-wider text-center flex-1 text-[#071224]">
                        {custom.lyric3 || 'I miss you double XL'}
                      </span>
                      <FourPointStar className="w-2.5 h-2.5 text-[#0f2547] shrink-0" />
                    </div>
                  )}

                  {/* Collage badges for retro_90s_pop */}
                  {currentTheme === 'retro_90s_pop' && idx === 1 && (
                    <div
                      data-floating-overlay="true"
                      className="absolute right-[-4px] top-1/4 z-20 pointer-events-none bg-amber-400 text-stone-900 text-[8px] font-black font-mono px-1.5 py-0.5 rounded-xs shadow rotate-12 border border-stone-900"
                    >
                      POP ★
                    </div>
                  )}
                  {currentTheme === 'retro_90s_pop' && idx === 2 && (
                    <div
                      data-floating-overlay="true"
                      className="absolute left-[-4px] top-1/2 z-20 pointer-events-none bg-stone-900 text-white text-[8px] font-black font-mono px-1.5 py-0.5 rounded-full shadow -rotate-12 border border-white/60"
                    >
                      #8
                    </div>
                  )}

                  {/* Cherish Cat 16 badge */}
                  {currentTheme === 'cherish_cat' && idx === 1 && (
                    <div
                      data-floating-overlay="true"
                      className="absolute right-1 -top-2 text-sky-300 font-serif font-black text-lg italic drop-shadow z-20 pointer-events-none"
                    >
                      {custom.badgeNum || '16'}
                    </div>
                  )}

                  <div
                    onClick={() => onPhotoClick && onPhotoClick(idx)}
                    className={`group relative aspect-[4/3] w-full bg-neutral-900 overflow-hidden cursor-pointer shadow-sm transition-all duration-200 ${
                      currentTheme === 'denim_1989'
                        ? 'rounded-2xl border-2 border-sky-200/50 p-0.5 bg-[#1b3353] shadow-md'
                        : currentTheme === 'roblox_xxl'
                        ? 'rounded-sm border-2 border-white/90 shadow-[0_0_12px_rgba(186,230,253,0.2)]'
                        : currentTheme === 'special_day_ticket'
                        ? 'rounded-lg border-2 border-[#3d0a12]/80 p-0.5 bg-white shadow-sm'
                        : currentTheme === 'retro_90s_pop'
                        ? 'rounded-md border-2 border-amber-300/70 shadow-md'
                        : currentTheme === 'poserbox_playlist'
                        ? (keyPrefix === 'strip-2' ? 'rounded border border-stone-300 p-0.5 bg-white' : 'rounded border border-stone-600 p-0.5 bg-stone-900')
                        : currentTheme === 'cherish_cat'
                        ? 'rounded-2xl border-2 border-sky-400/45 shadow-md'
                        : currentTheme === 'phetoria_sage'
                        ? 'rounded border border-white/65 p-0.5 bg-[#3a4f33]'
                        : currentTheme === 'vintage_mahogany'
                        ? 'rounded border-2 border-amber-600/75 p-0.5 bg-[#25150b] shadow-md'
                        : currentTheme === 'polaroid_mosaic'
                        ? 'rounded-xs p-1 pb-3 bg-white shadow-md border border-stone-200'
                        : currentTheme === 'spotify_fool'
                        ? (keyPrefix === 'strip-2' ? 'rounded-md border-2 border-[#441119] p-0.5 bg-white shadow-sm' : 'rounded-md border-2 border-white p-0.5 bg-neutral-900 shadow-md')
                        : currentTheme === 'airmail'
                        ? 'p-1 bg-white rounded-xs border border-neutral-300 shadow-sm'
                        : currentTheme === 'instax'
                        ? 'rounded-xs border-2 border-stone-200 p-1 bg-white shadow-inner'
                        : currentTheme === 'purikura'
                        ? 'rounded-2xl border-2 border-pink-400 p-0.5 bg-white shadow-sm'
                        : currentTheme === 'haru_cloud'
                        ? 'rounded-xl border-2 border-sky-300 p-0.5 bg-white shadow-sm'
                        : currentTheme === 'scrapbook_kraft'
                        ? 'rounded-xs p-1 bg-white border border-amber-900/20 shadow-sm'
                        : 'rounded-sm border border-current/40'
                    }`}
                  >
                    <div
                      data-photo-slot={idx}
                      className="w-full h-full relative overflow-hidden bg-neutral-950 rounded-2xs"
                    >
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
                            <div
                              data-photo-overlay="true"
                              className="absolute inset-0 newsprint-overlay pointer-events-none"
                            />
                          )}
                          {filterSettings?.filmGrain > 0 && (
                            <div
                              data-photo-overlay="true"
                              className="absolute inset-0 film-grain-overlay pointer-events-none"
                              style={{
                                opacity: (filterSettings.filmGrain / 100) * 0.45
                              }}
                            />
                          )}
                          {filterSettings?.dateStamp && (
                            <div
                              data-photo-overlay="true"
                              className="absolute right-2 bottom-1 font-digital text-[#ff7b00] text-sm drop-shadow pointer-events-none"
                            >
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
                      <div
                        data-hover-prompt="true"
                        className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center"
                      >
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

          {/* ================= TEMPLATE FOOTERS (ALL 29 TEMPLATES) ================= */}

          {/* 1. POSERBOX'S PLAYLIST FOOTER */}
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

          {/* 2. CHERISH MIDNIGHT CAT FOOTER (with Peeking Black Cat SVG) */}
          {currentTheme === 'cherish_cat' && (
            <div className="pt-2 text-white relative">
              <div className="p-2 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs mb-1.5">
                <div className="flex justify-between items-center text-[10px] mb-1">
                  <div className="truncate">
                    <span className="font-bold block truncate">{custom.song || 'Bercinta lewat kata'}</span>
                    <span className="text-[8px] text-sky-200/75 truncate">{custom.artist || 'Donne Maula'}</span>
                  </div>
                  <Heart className="w-3 h-3 text-sky-400 fill-sky-400 shrink-0" />
                </div>
                <div className="w-full h-1 bg-white/20 rounded-full mb-1 relative">
                  <div className="w-1/3 h-full bg-sky-300 rounded-full" />
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
              <div className="flex items-end justify-between px-1">
                <PeekingCatSvg className="w-9 h-6 -mb-1 shrink-0" />
                <span className="font-cursive text-amber-200 text-sm tracking-wide text-right drop-shadow leading-tight">
                  {custom.quote || 'One year down, forever to go ♡'}
                </span>
              </div>
            </div>
          )}

          {/* 3. IT'S WOODZ DAY K-POP FOOTER */}
          {currentTheme === 'woodz_day' && (
            <div>
              {keyPrefix === 'strip-2' ? (
                <div className="pt-1.5 border-t border-white/30 text-white flex items-end justify-between">
                  <div>
                    <div className="font-black text-xl tracking-tighter italic text-amber-300 leading-none">
                      1996 ★
                    </div>
                    <div className="font-black text-base tracking-tight text-white uppercase italic leading-none mt-1">
                      {custom.title || "IT'S WOODZ DAY!!"}
                    </div>
                  </div>
                  <span className="font-mono text-[8px] bg-white/15 border border-white/30 px-1.5 py-0.5 rounded-xs font-bold">
                    {custom.dateTape || '96.08.05'}
                  </span>
                </div>
              ) : (
                <div className="pt-1.5 border-t-2 border-stone-900">
                  <div className="bg-sky-500 text-white px-2 py-1 rounded-lg text-center font-black text-sm shadow-xs tracking-tight uppercase">
                    {custom.title || "IT'S WOODZ DAY!"}
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-[8px] font-mono font-bold text-stone-500">
                      {custom.dateTape || '96.08.05'}
                    </span>
                    <span className="text-[8.5px] font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-full">
                      #SEUNGYOUN_DAY
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. PHETORIA SAGE GREEN FOOTER */}
          {currentTheme === 'phetoria_sage' && (
            <div className="pt-2 text-center text-white border-t border-white/25">
              <div className="font-serif font-black text-sm tracking-[0.2em] uppercase leading-none">
                {custom.brand || 'PIKUBOOTH'}
              </div>
              <div className="text-[8px] font-mono tracking-widest text-white/80 mt-1 uppercase">
                {custom.tagline || 'VINTAGE MEMORIES BOOTH'}
              </div>
            </div>
          )}

          {/* 5. VINTAGE MAHOGANY FOOTER */}
          {currentTheme === 'vintage_mahogany' && (
            <div className="pt-2 text-center text-amber-100 border-t border-amber-500/35">
              <h2 className="font-cursive text-3xl font-bold text-amber-100 leading-none drop-shadow">
                {custom.title || 'Vintage Special'}
              </h2>
              <div className="flex justify-center items-center gap-2 text-[9px] text-amber-300/80 mt-1 font-serif tracking-widest">
                <span>───</span>
                <FourPointStar className="w-2.5 h-2.5 text-amber-300" />
                <span>───</span>
              </div>
            </div>
          )}

          {/* 6. SUA FOTO CANDY TICKET FOOTER */}
          {currentTheme === 'suafoto_ticket' && (
            <div className="pt-1.5 border-t-2 border-[#7c121d] text-center text-[#7c121d]">
              <div className="text-[8.5px] font-serif italic font-bold tracking-wide mb-1">
                {custom.footer || 'Manis - Manis Pikubooth'}
              </div>
              <BarcodeVector color="#7c121d" heightClass="h-4" count={32} />
            </div>
          )}

          {/* 7. FLIGHT TICKET IDN FOOTER */}
          {currentTheme === 'boarding_flight' && (
            <div className="pt-1.5 border-t border-dashed border-stone-400 text-center font-mono">
              <BarcodeVector color="#1e385c" heightClass="h-4" count={34} />
              <span className="text-[7.5px] text-stone-600 font-bold block mt-1 tracking-wider">
                BOARDING PASS • {custom.airline || 'PIKU AIR'}
              </span>
            </div>
          )}

          {/* 8. PHOTOLOOKUP 2026 FOOTER */}
          {currentTheme === 'photolookup_cream' && (
            <div className="pt-1.5 border-t-2 border-[#0f172a] text-center text-[#0f172a] text-[8px] font-mono font-bold tracking-wider">
              <span>★ {custom.tagline || 'SAVE THE BEST MOMENT'} ★</span>
            </div>
          )}

          {/* 9. POLAROID MOSAIC FOOTER */}
          {currentTheme === 'polaroid_mosaic' && (
            <div className="pt-2 text-center font-cursive text-stone-800 text-base font-bold leading-none">
              {custom.caption || 'moments frozen in time'}
            </div>
          )}

          {/* 10. SELFIT STUDIO MINIMAL FOOTER */}
          {currentTheme === 'selfit_minimal' && (
            <div className="pt-1.5 border-t border-stone-200 text-stone-400 text-[8px] font-mono flex justify-between items-center">
              <span>PIKUBOOTH ARCHIVE</span>
              <span className="font-bold text-stone-600">{custom.date || 'OCT 2026'}</span>
            </div>
          )}

          {/* 11. 1989 TAYLOR'S DENIM FOOTER */}
          {currentTheme === 'denim_1989' && (
            <div className="pt-2 text-center relative select-none">
              <div className="relative inline-block">
                <span className="text-4xl sm:text-5xl font-black tracking-tight text-sky-200 block drop-shadow-[0_4px_8px_rgba(0,0,0,0.45)] leading-none">
                  {custom.album || '1989'}
                </span>
                <span className="absolute -top-1 -right-4 text-sky-200">
                  <FourPointStar className="w-3.5 h-3.5" />
                </span>
              </div>
              <p className="font-cursive text-sm sm:text-base font-bold text-white tracking-wider mt-0.5 drop-shadow">
                {custom.version || "TAYLOR'S VERSION"}
              </p>
            </div>
          )}

          {/* 12. ROBLOX XXL STARRY LYRICS FOOTER */}
          {currentTheme === 'roblox_xxl' && (
            <div className="pt-2 flex items-center justify-between text-white border-t-2 border-white/90 mt-1 relative z-10">
              <div>
                <div className="flex items-center gap-1">
                  <FourPointStar className="w-3 h-3 text-sky-300" />
                  <h4 className="font-black text-xs tracking-wider uppercase leading-none">
                    {custom.brand || 'PIKU PHOTOBOOTH'}
                  </h4>
                </div>
                <span className="text-[7.5px] font-mono tracking-[0.2em] text-sky-200/90 font-bold block mt-0.5">
                  STARRY NIGHT EDITION
                </span>
              </div>
              <span className="text-2xl font-black text-sky-200 tracking-tighter font-sans italic drop-shadow">
                {custom.edition || 'XXL'}
              </span>
            </div>
          )}

          {/* 13. SPECIAL DAY CINEMA TICKET FOOTER */}
          {currentTheme === 'special_day_ticket' && (
            <div>
              {keyPrefix === 'strip-2' ? (
                <div className="pt-1.5 border-t border-dashed border-[#3d0a12]/60 text-center">
                  <BarcodeVector color="#3d0a12" heightClass="h-5" count={36} />
                  <span className="text-[8px] font-mono tracking-[0.25em] text-[#4a0e17] font-bold block mt-0.5">
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
                  <div className="w-4 h-2 bg-[#efede7] rounded-t-full mx-auto -mb-3 mt-1 shadow-inner" />
                </div>
              )}
            </div>
          )}

          {/* 14. 70s & 90s RETRO CHECKERBOARD FOOTER */}
          {currentTheme === 'retro_90s_pop' && (
            <div className="pt-1.5 border-t border-white/30 text-center relative">
              <div className="inline-block bg-[#facc15] text-[#1c1917] text-[8px] font-mono font-black px-2 py-0.5 rounded-xs shadow-xs mb-1 border border-stone-900">
                BOOM CHUTE 5¢
              </div>
              <div>
                <h3 className="font-black text-2xl tracking-wider text-white italic drop-shadow border-b-2 border-white pb-0.5 inline-block leading-none">
                  {custom.title || 'RETRO'} <span className="font-mono text-sm not-italic">{custom.subYear || "1990'S"}</span>
                </h3>
              </div>
              <div className="flex justify-center items-center gap-2 text-[9px] text-amber-200 mt-1 font-mono font-bold tracking-widest">
                ★ VINTAGE ARCHIVE ★
              </div>
            </div>
          )}

          {/* 15. SPOTIFY FOOL FOR YOU FOOTER */}
          {currentTheme === 'spotify_fool' && (
            <div>
              {keyPrefix === 'strip-2' ? (
                <div className="pt-1.5 border-t border-[#441119]/30 text-center text-[#441119]">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Disc className="w-3 h-3 text-[#441119]" />
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
                  <span className="font-sans font-bold text-[8.5px] tracking-widest uppercase block text-[#441119]/80">
                    {custom.headline || "I'M SUCH A"}
                  </span>
                  <h1 className="font-serif font-black text-3xl leading-none text-[#441119] my-0.5 tracking-tight">
                    {custom.bigWord || 'FOOL'}
                  </h1>
                  <span className="font-sans font-black text-[10px] tracking-widest uppercase block text-[#441119]/90">
                    {custom.subline || 'FOR YOU'}
                  </span>
                </div>
              ) : (
                <div className="pt-2 border-t border-white/20 text-white text-center">
                  <p className="font-cursive text-base italic text-white/90 mb-1 leading-none">
                    i just...
                  </p>
                  <div className="p-1 bg-white/10 rounded-xs border border-white/20 text-[8.5px] font-mono text-white/90 font-bold tracking-wider">
                    THE CRANBERRIES • 1994
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 16. THEATER TICKET FOOTER */}
          {currentTheme === 'theater' && (
            <div className="pt-1.5 border-t-2 border-current text-center">
              <div className="border-y border-current py-0.5 my-1">
                <p className="text-[7.5px] font-serif uppercase tracking-wider font-bold">
                  {custom.ribbon || '★ SAVE THE BEST MOMENT ★'}
                </p>
              </div>
              <span className="font-serif italic text-xl font-black tracking-tight block leading-none">
                {custom.studioName || 'pikubooth.'}
              </span>
            </div>
          )}

          {/* 17. HARU FILM FOOTER */}
          {currentTheme === 'haru_cloud' && (
            <div className="pt-1.5 border-t border-sky-200 text-center text-sky-700 text-[9px] font-mono flex items-center justify-between">
              <span>{custom.date || '2026.10.12'}</span>
              <span className="font-bold uppercase">{custom.studio || 'pikubooth studio'}</span>
            </div>
          )}

          {/* 18. LIFE4CUTS FOOTER */}
          {currentTheme === 'life4cuts' && (
            <div className="pt-2 border-t border-indigo-400/40 text-center text-indigo-200 text-[9px] font-mono flex items-center justify-between">
              <span>{custom.date || '2026.10.12'}</span>
              <span className="font-bold text-white">{custom.studioCode || 'SEOUL NO. 04'}</span>
            </div>
          )}

          {/* 19. PHOTOISM MONOCHROME FOOTER */}
          {currentTheme === 'photoism' && (
            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[8.5px] font-mono text-neutral-400">
              <span>KEEP YOUR MOMENT</span>
              <span className="text-white font-bold">{custom.date || 'OCTOBER 2026'}</span>
            </div>
          )}

          {/* 20. PURIKURA KAWAII GLITTER FOOTER */}
          {currentTheme === 'purikura' && (
            <div className="pt-1.5 border-t-2 border-pink-300 text-center">
              <div className="font-cursive font-bold text-base text-pink-700 leading-none">
                {custom.sub || 'BESTIES FOREVER ♡'}
              </div>
              <div className="flex justify-between items-center text-[8px] font-mono text-pink-600 mt-1 px-1 font-bold">
                <span>PIKUBOOTH</span>
                <span>{custom.date || "’26 10.12"}</span>
              </div>
            </div>
          )}

          {/* 21. DETIK AIR BOARDING PASS FOOTER */}
          {currentTheme === 'boarding' && (
            <div className="pt-1.5 border-t-2 border-dashed border-[#601322]/40 text-center font-mono">
              <div className="flex justify-between text-[8px] text-stone-700 font-bold mb-1 px-0.5">
                <span>PAX: {custom.passenger || 'BEST FRIENDS'}</span>
                <span className="text-[#601322]">PRIORITY</span>
              </div>
              <BarcodeVector color="#601322" heightClass="h-4" count={34} />
            </div>
          )}

          {/* 22. CONCERT VIP FESTIVAL PASS FOOTER */}
          {currentTheme === 'concert_vip' && (
            <div className="pt-1.5 border-t border-rose-500/30 text-center">
              <BarcodeVector color="#f43f5e" heightClass="h-4" count={32} />
              <div className="text-[7.5px] font-mono text-stone-400 tracking-widest uppercase mt-1 font-bold">
                ARTIST & BACKSTAGE CREDENTIAL
              </div>
            </div>
          )}

          {/* 23. VINTAGE CINEMA PERFORATED STUB FOOTER */}
          {currentTheme === 'cinema_stub' && (
            <div className="pt-1.5 border-t-2 border-dashed border-[#78350f] text-center font-mono text-[#78350f]">
              <div className="text-[8.5px] font-black tracking-wider mb-1">
                {custom.seat || 'ROW C • SEAT 14'}
              </div>
              <BarcodeVector color="#78350f" heightClass="h-4" count={32} />
            </div>
          )}

          {/* 24. TOKYO METRO EXPRESS PASS FOOTER */}
          {currentTheme === 'train_pass' && (
            <div className="pt-1.5 border-t-2 border-[#0f766e] flex items-center justify-between font-mono text-[#115e59]">
              <div>
                <span className="text-[8.5px] font-black block">{custom.fare || '¥320 FARE PAID'}</span>
                <span className="text-[7px] opacity-75 block">TOKYO METRO CO.</span>
              </div>
              <div className="border-2 border-red-600 text-red-600 rounded-full px-1.5 py-0.5 text-[7px] font-black -rotate-6">
                PASSED
              </div>
            </div>
          )}

          {/* 25. EDITORIAL STORY FOOTER */}
          {currentTheme === 'editorial' && (
            <div className="pt-1.5 border-t-2 border-black flex items-center justify-between text-[8px] font-mono text-black">
              <span>{custom.date || 'OCTOBER 12, 2026'}</span>
              <span className="font-bold">EDITION 01</span>
            </div>
          )}

          {/* 26. YE OLE LONDONER FOOTER */}
          {currentTheme === 'londoner' && (
            <div className="pt-1.5 border-t-2 border-black text-center font-serif text-black">
              <div className="border border-black bg-[#eae4d3] py-0.5 px-1.5 text-[8px] font-bold uppercase tracking-wider">
                ★ VICTORY & GOOD FORTUNE • 1888 ★
              </div>
            </div>
          )}

          {/* 27. VOGUE HIGH FASHION MAGAZINE FOOTER */}
          {currentTheme === 'vogue_chic' && (
            <div className="pt-1.5 border-t-2 border-black flex items-center justify-between text-black">
              <div className="text-left">
                <div className="font-serif font-black text-[9px] uppercase tracking-wider leading-tight">
                  {custom.story1 || 'LOVE & FRIENDSHIP 2026'}
                </div>
                <div className="font-mono text-[7px] text-neutral-500 uppercase">
                  {custom.story2 || 'EXCLUSIVE STUDIO EDITION'}
                </div>
              </div>
              <div className="w-14">
                <BarcodeVector color="#000000" heightClass="h-4" count={16} />
              </div>
            </div>
          )}

          {/* 28. THE SUNDAY MORNING POST FOOTER */}
          {currentTheme === 'morning_post' && (
            <div className="pt-1.5 border-t-2 border-stone-900 flex items-center justify-between text-[8px] font-mono text-stone-700">
              <span className="font-bold">LIFESTYLE & ARTS</span>
              <span>PAGE 01 • ARCHIVE</span>
            </div>
          )}

          {/* 29. LE PETIT PARISIEN GAZETTE FOOTER */}
          {currentTheme === 'paris_gazette' && (
            <div className="pt-1.5 border-t-2 border-[#292524] text-center text-[#292524]">
              <p className="font-serif italic text-[8.5px] leading-tight">
                "Les plus beaux instants sont ceux que l'on partage."
              </p>
              <span className="font-mono text-[7px] uppercase tracking-widest block mt-0.5 font-bold">
                CHRONIQUE DE PARIS
              </span>
            </div>
          )}

          {/* 30. BILLBOARD RECORD WEEKLY TIMES FOOTER */}
          {currentTheme === 'record_times' && (
            <div className="pt-1.5 border-t-2 border-stone-900 flex items-center justify-between text-stone-900">
              <div>
                <span className="font-sans font-black text-[8.5px] uppercase block leading-none">
                  {custom.review || 'UNSTOPPABLE MEMORIES'}
                </span>
                <span className="text-[8px] text-amber-600 font-bold">★★★★★ RATED</span>
              </div>
              <div className="w-14">
                <BarcodeVector color="#0c0a09" heightClass="h-4" count={16} />
              </div>
            </div>
          )}

          {/* 31. AIRMAIL FOOTER */}
          {currentTheme === 'airmail' && (
            <div className="pt-2 border-t border-dashed border-neutral-400 text-[10px] font-mono">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-neutral-600 text-[8px]">SEND TO:</div>
                  <div className="font-cursive font-bold text-sm text-blue-950 leading-tight">
                    {custom.recipient || 'My Beloved One'}
                  </div>
                </div>
                <div className="border-2 border-red-700 text-red-700 px-1.5 py-0.5 rounded-xs font-black text-[9px] -rotate-6">
                  {custom.stampText || 'APPROVED'}
                </div>
              </div>
              <div className="mt-1 text-[7.5px] text-neutral-500 flex justify-between border-t border-neutral-300 pt-1 font-bold">
                <span className="text-blue-900">{custom.brand || 'PIKU BOX!'}</span>
                <span>{custom.postmark || 'AIRMAIL POSTAGE PAID'}</span>
              </div>
            </div>
          )}

          {/* 32. FUJI INSTAX MINI FRAME FOOTER */}
          {currentTheme === 'instax' && (
            <div className="pt-2 pb-1 text-center">
              <div className="font-cursive font-bold text-xl text-stone-800 leading-none">
                {custom.caption || 'our unforgettable day ♡'}
              </div>
              <div className="text-[8px] font-mono text-stone-400 mt-1 tracking-widest">
                {custom.date || '12 / 10 / 2026'}
              </div>
            </div>
          )}

          {/* 33. CAFE & BAKERY THERMAL RECEIPT FOOTER */}
          {currentTheme === 'cafe_receipt' && (
            <div className="pt-1.5 border-t-2 border-dashed border-stone-400 font-mono text-[8px] text-stone-800">
              <div className="flex justify-between">
                <span>1x Sweet Memories</span>
                <span className="font-bold">$0.00</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>1x Endless Laughter</span>
                <span className="font-bold">$0.00</span>
              </div>
              <div className="border-t border-dotted border-stone-400 pt-1 mb-1 flex justify-between font-black text-[8.5px]">
                <span>TOTAL</span>
                <span>PRICELESS</span>
              </div>
              <BarcodeVector color="#18181b" heightClass="h-4" count={32} />
              <div className="text-center text-[7.5px] font-bold mt-1 text-stone-600">
                {custom.footer || 'THANK YOU! HAVE A NICE DAY :)'}
              </div>
            </div>
          )}

          {/* 34. VINTAGE LOVE LETTER & WAX STAMP FOOTER */}
          {currentTheme === 'love_letter' && (
            <div className="pt-1.5 border-t border-rose-300 flex items-center justify-between">
              <div>
                <div className="font-cursive text-lg font-bold text-rose-900 leading-none">
                  {custom.sign || 'Forever Yours ♡'}
                </div>
                <span className="text-[7px] font-serif italic text-rose-500">Avec tout mon amour</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-rose-800 border-2 border-rose-950 shadow-md flex items-center justify-center text-rose-100 text-[6px] font-serif font-black text-center leading-none p-1 -rotate-12">
                {custom.waxText || 'WITH LOVE'}
              </div>
            </div>
          )}

          {/* 35. KRAFT SCRAPBOOK & WASHI TAPE FOOTER */}
          {currentTheme === 'scrapbook_kraft' && (
            <div className="pt-1.5 border-t border-amber-900/25 flex items-center justify-between text-amber-950">
              <span className="font-cursive font-bold text-sm leading-none">
                best memories with you ♡
              </span>
              <span className="text-[7.5px] font-mono font-bold bg-amber-900/15 px-1.5 py-0.5 rounded-xs">
                {custom.year || 'OCTOBER 2026'}
              </span>
            </div>
          )}

        </div>

        {/* ================= INTERACTIVE PLACED STICKERS OVERLAY ================= */}
        {stickers.map((stk) => (
          <div
            key={stk.instanceId}
            data-floating-overlay="true"
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
            <span
              data-hover-prompt="true"
              className="opacity-0 group-hover:opacity-100 absolute -top-3 -right-3 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[9px] font-bold shadow"
            >
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
