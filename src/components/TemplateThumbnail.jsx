import React from 'react';

// Generates an authentic, vector-crisp miniature preview for each of the 30 photobooth templates
export default function TemplateThumbnail({ templateId, template, className = '' }) {
  const id = templateId || template?.id;
  switch (id) {
    // VIRAL 1: 1989 TAYLOR'S DENIM
    case 'denim_1989':
      return (
        <div className={`w-full aspect-[9/14] bg-[#1e385c] p-1 rounded-sm relative flex flex-col justify-between overflow-hidden shadow-inner border border-dashed border-sky-300/50 ${className}`}>
          <div className="text-center pt-0.5">
            <span className="text-[5.5px] font-serif font-black tracking-widest text-white uppercase block">
              ★ MOMENKU ★
            </span>
          </div>
          <div className="flex flex-col gap-1 my-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-[16/10] bg-neutral-900 rounded-sm border border-sky-200/30 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              </div>
            ))}
          </div>
          <div className="text-center pb-0.5">
            <span className="text-[9px] font-black tracking-tight text-sky-200 block drop-shadow-xs leading-none">
              1989 ★
            </span>
            <span className="text-[4.5px] font-bold text-sky-100 uppercase block tracking-wider mt-0.5">
              Taylor's Version
            </span>
          </div>
        </div>
      );

    // VIRAL 2: ROBLOX XXL STARRY LYRICS
    case 'roblox_xxl':
      return (
        <div className={`w-full aspect-[9/14] bg-gradient-to-b from-[#071120] via-[#0f2547] to-[#081529] p-1 rounded-sm relative flex flex-col justify-between overflow-hidden shadow-inner border-2 border-white ${className}`}>
          <div className="bg-white text-[#071120] text-[3.8px] text-center font-serif italic font-bold py-0.2 px-0.5 rounded-2xs">
            I still remember ✦
          </div>
          <div className="flex flex-col gap-0.5 my-0.5">
            {[...Array(4)].map((_, i) => (
              <React.Fragment key={i}>
                {i === 2 && (
                  <div className="bg-white/95 text-[#071120] text-[3.5px] text-center font-mono font-bold py-0.1 rounded-2xs">
                    Backseat secrets
                  </div>
                )}
                <div className="aspect-[16/9] bg-[#162e52] rounded-2xs border border-sky-200/60 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-sky-200/40" />
                </div>
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between items-center text-white px-0.5 border-t border-white/70 pt-0.5">
            <span className="text-[4.5px] font-black uppercase tracking-tighter">ROBLOX</span>
            <span className="text-[8px] font-black text-sky-300 leading-none">XXL</span>
          </div>
        </div>
      );

    // VIRAL 3: SPECIAL DAY CINEMA TICKET
    case 'special_day_ticket':
      return (
        <div className={`w-full aspect-[9/14] bg-[#3d0a12] p-1 rounded-sm relative flex flex-col justify-between overflow-hidden shadow-inner ${className}`}>
          <div className="bg-[#ebe8e1] rounded p-1 h-full flex flex-col justify-between text-[#3d0a12]">
            <div className="text-center border-b border-dashed border-[#3d0a12] pb-0.5">
              <span className="text-[4.5px] font-mono tracking-widest block font-bold">|||| PANORAMA ||||</span>
            </div>
            <div className="flex flex-col gap-1 my-0.5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="aspect-[16/10] bg-neutral-900 rounded-xs border border-[#3d0a12]/30 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                </div>
              ))}
            </div>
            <div className="text-center border-t border-dashed border-[#3d0a12] pt-0.5">
              <span className="font-cursive text-[8.5px] font-bold block leading-none">Special Day</span>
              <span className="text-[4.5px] block font-mono">CINEMA ★</span>
            </div>
          </div>
        </div>
      );

    // VIRAL 4: 70s & 90s RETRO CHECKERBOARD
    case 'retro_90s_pop':
      return (
        <div className={`w-full aspect-[9/14] bg-[#5c0d15] p-1 rounded-sm relative flex flex-col justify-between overflow-hidden shadow-inner ${className}`}>
          <div className="absolute left-0 top-0 bottom-0 w-2 flex flex-col">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`w-2 flex-1 ${i % 2 === 0 ? 'bg-[#facc15]' : 'bg-[#7a1721]'}`} />
            ))}
          </div>
          <div className="pl-2 h-full flex flex-col justify-between text-white">
            <div className="flex justify-between items-center text-[5px]">
              <span className="font-black bg-white text-red-700 px-0.5 rounded-xs">70s</span>
              <span className="font-mono text-amber-300 font-bold">POP★</span>
            </div>
            <div className="flex flex-col gap-0.5 my-0.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[16/9] bg-neutral-900 rounded-2xs border border-amber-300/40 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-white/30" />
                </div>
              ))}
            </div>
            <div className="text-center border-t border-white/40 pt-0.5">
              <span className="font-black text-[6.5px] tracking-tight block leading-none">RETRO 1990'S</span>
              <span className="text-[5px] font-mono text-amber-200">★ VINTAGE</span>
            </div>
          </div>
        </div>
      );

    // VIRAL 5: FOOL FOR YOU SPOTIFY TWIN
    case 'spotify_fool':
      return (
        <div className={`w-full aspect-[9/14] bg-[#441119] p-1 rounded-sm relative flex flex-col justify-between overflow-hidden shadow-inner ${className}`}>
          <div className="bg-[#f7f3ea] rounded p-1 h-full flex flex-col justify-between text-[#441119]">
            <div className="flex items-center justify-between text-[4.5px] border-b border-[#441119]/30 pb-0.5 font-mono">
              <span>● SPOTIFY</span>
              <span>|||••|||</span>
            </div>
            <div className="flex flex-col gap-0.5 my-0.5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="aspect-[16/10] bg-neutral-900 rounded-xs border border-[#441119]/30 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                </div>
              ))}
            </div>
            <div className="text-center border-t border-[#441119]/30 pt-0.5 leading-tight">
              <span className="text-[4px] block font-mono">I'M SUCH A</span>
              <span className="font-serif font-black text-[9px] block tracking-tight">FOOL</span>
              <span className="text-[4px] block font-mono">FOR YOU ★</span>
            </div>
          </div>
        </div>
      );

    // PINTEREST 1: POSERBOX MINIMAL PLAYLIST
    case 'poserbox_playlist':
      return (
        <div className={`w-full aspect-[9/14] bg-[#38383a] p-1 rounded-sm relative flex flex-col justify-between overflow-hidden shadow-inner text-white ${className}`}>
          <div className="text-[5px] font-serif italic pb-0.5 border-b border-white/20">
            Poserbox's Playlist
          </div>
          <div className="flex flex-col gap-1 my-0.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-[16/10] bg-neutral-900 rounded-2xs border border-white/30 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              </div>
            ))}
          </div>
          <div className="pt-0.5 border-t border-white/20">
            <span className="text-[5px] font-bold block truncate">ABOUT YOU</span>
            <div className="w-full h-0.5 bg-white/30 rounded-full my-0.5" />
            <div className="flex justify-between items-center text-[5px] px-1">
              <span>⏮</span>
              <span className="w-2.5 h-2.5 rounded-full bg-white text-black flex items-center justify-center text-[4px]">▶</span>
              <span>⏭</span>
            </div>
          </div>
        </div>
      );

    // PINTEREST 2: CHERISH MIDNIGHT CAT
    case 'cherish_cat':
      return (
        <div className={`w-full aspect-[9/14] bg-[#132238] p-1 rounded-sm relative flex flex-col justify-between overflow-hidden shadow-inner text-white ${className}`}>
          <div className="text-[4.5px] font-mono text-sky-300 pb-0.5 border-b border-sky-400/20">
            @cherishphotobox
          </div>
          <div className="flex flex-col gap-1 my-0.5 relative">
            <span className="absolute right-0 top-1 text-[7px] text-sky-300 font-black italic">16</span>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-[16/10] bg-neutral-900 rounded-sm border border-sky-400/40 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-0.5 text-[5px] border-t border-sky-400/20">
            <span className="font-mono text-sky-300 font-bold">★ CAT</span>
            <span className="text-amber-200 font-cursive text-[6px]">forever to go ♡</span>
          </div>
        </div>
      );

    // PINTEREST 3: IT'S WOODZ DAY K-POP
    case 'woodz_day':
      return (
        <div className={`w-full aspect-[9/14] bg-white p-1 rounded-sm relative flex flex-col justify-between overflow-hidden shadow-inner text-black border border-stone-300 ${className}`}>
          <div className="flex justify-between items-center text-[4px] font-mono border-b border-stone-200 pb-0.5">
            <span className="bg-black text-white px-0.5 rounded-2xs font-bold">PHOTO</span>
            <span>SUNSET CHASER</span>
          </div>
          <div className="flex flex-col gap-0.5 my-0.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-[16/10] bg-neutral-900 rounded-2xs border border-black flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              </div>
            ))}
          </div>
          <div className="bg-sky-500 text-white rounded text-center text-[5px] font-black py-0.5">
            IT'S WOODZ DAY!
          </div>
        </div>
      );

    // PINTEREST 4: PHETORIA SAGE GREEN
    case 'phetoria_sage':
      return (
        <div className={`w-full aspect-[9/14] bg-[#465e3e] p-1 rounded-sm relative flex flex-col justify-between overflow-hidden shadow-inner text-white ${className}`}>
          <div className="flex justify-between items-center text-[4px] font-mono border-b border-white/20 pb-0.5">
            <span>RETRO</span>
            <span>VINTAGE</span>
          </div>
          <div className="flex flex-col gap-1 my-0.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-[16/10] bg-[#3a4f33] rounded-2xs border border-white/60 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              </div>
            ))}
          </div>
          <div className="text-center text-[5px] font-mono font-bold border-t border-white/20 pt-0.5">
            PHETORIA • BOOTH
          </div>
        </div>
      );

    // PINTAGE 5: VINTAGE MAHOGANY WOOD
    case 'vintage_mahogany':
      return (
        <div className={`w-full aspect-[9/14] bg-[#361e11] p-1 rounded-sm relative flex flex-col justify-between overflow-hidden shadow-inner text-amber-100 ${className}`}>
          <div className="text-center text-[4.5px] font-serif border-b border-amber-600/30 pb-0.5 tracking-widest">
            ✦ PHOTO PLACE ✦
          </div>
          <div className="flex flex-col gap-1 my-0.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-[16/10] bg-[#25150b] rounded-2xs border border-amber-600/60 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              </div>
            ))}
          </div>
          <div className="text-center font-cursive text-[7.5px] font-bold border-t border-amber-600/30 pt-0.5 text-amber-200">
            Vintage Special
          </div>
        </div>
      );

    // PINTEREST 6: SUA FOTO CANDY TICKET
    case 'suafoto_ticket':
      return (
        <div className={`w-full aspect-[9/14] bg-[#7c121d] p-1 rounded-sm relative flex flex-col justify-between overflow-hidden shadow-inner text-[#7c121d] ${className}`}>
          <div className="bg-[#fefcf8] rounded p-1 h-full flex flex-col justify-between">
            <div className="border-b border-[#7c121d] pb-0.5">
              <span className="font-cursive text-[7px] font-bold block leading-none">Sua Foto's</span>
              <span className="text-[4px] font-mono font-black block">GOLDEN TICKET</span>
            </div>
            <div className="flex flex-col gap-0.5 my-0.5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="aspect-[16/10] bg-neutral-900 rounded-2xs border border-[#7c121d]/40 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-white/30" />
                </div>
              ))}
            </div>
            <div className="text-[4.5px] font-mono text-center border-t border-[#7c121d] pt-0.5 font-bold">
              MAKASSAR SELAMANYA
            </div>
          </div>
        </div>
      );

    // PINTEREST 7: FLIGHT TICKET IDN BOARDING PASS
    case 'boarding_flight':
      return (
        <div className={`w-full aspect-[9/14] bg-[#1e385c] p-1 rounded-sm relative flex flex-col justify-between overflow-hidden shadow-inner text-[#1e385c] ${className}`}>
          <div className="bg-[#fbf9f5] rounded p-1 h-full flex flex-col justify-between font-mono">
            <div className="bg-[#1e385c] text-white px-0.5 py-0.5 rounded-2xs text-[4.5px] font-bold flex justify-between">
              <span>IDN ➔ USA</span>
              <span>✈ PASS</span>
            </div>
            <div className="flex flex-col gap-0.5 my-0.5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="aspect-[16/10] bg-neutral-900 rounded-2xs border border-stone-300 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-white/30" />
                </div>
              ))}
            </div>
            <div className="text-[4px] text-stone-600 flex justify-between border-t border-dashed border-stone-300 pt-0.5">
              <span>GATE 14</span>
              <span>SEAT 30A</span>
            </div>
          </div>
        </div>
      );

    // KOREAN 8: PHOTOLOOKUP 2026
    case 'photolookup_cream':
      return (
        <div className={`w-full aspect-[9/14] bg-[#1e293b] p-1 rounded-sm relative flex flex-col justify-between overflow-hidden shadow-inner text-stone-900 ${className}`}>
          <div className="bg-[#f8fafc] rounded p-1 h-full flex flex-col justify-between text-center">
            <div className="border-b border-stone-300 pb-0.5">
              <span className="text-[4px] text-red-600 block">★ 2026 ★</span>
              <span className="font-serif font-black text-[6.5px] block tracking-wide">PHOTOLOOKUP</span>
            </div>
            <div className="flex flex-col gap-0.5 my-0.5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="aspect-[16/10] bg-neutral-900 rounded-2xs border border-stone-300 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-white/30" />
                </div>
              ))}
            </div>
            <span className="text-[4px] font-mono text-stone-500 border-t border-stone-200 pt-0.5">
              SAVE THE BEST MOMENT
            </span>
          </div>
        </div>
      );

    // POSTAL 9: POLAROID MOSAIC
    case 'polaroid_mosaic':
      return (
        <div className={`w-full aspect-[9/14] bg-[#78350f] p-1 rounded-sm relative flex flex-col justify-between overflow-hidden shadow-inner ${className}`}>
          <div className="text-[4.5px] text-amber-200 text-center font-serif italic pb-0.5">
            polaroid collection
          </div>
          <div className="grid grid-cols-2 gap-1 my-0.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-white p-0.5 pb-1.5 rounded-2xs shadow-xs">
                <div className="w-full h-full bg-neutral-900 rounded-2xs" />
              </div>
            ))}
          </div>
          <div className="text-[4.5px] font-cursive text-amber-100 text-center">
            frozen in time ♡
          </div>
        </div>
      );

    // KOREAN 10: SELFIT STUDIO MINIMAL
    case 'selfit_minimal':
      return (
        <div className={`w-full aspect-[9/14] bg-[#e7e5e4] p-1 rounded-sm relative flex flex-col justify-between overflow-hidden shadow-inner text-stone-800 ${className}`}>
          <div className="bg-white rounded p-1 h-full flex flex-col justify-between">
            <div className="border-b border-stone-100 pb-0.5">
              <span className="font-serif italic font-bold text-[6px] block">selfit photostudio.</span>
            </div>
            <div className="flex flex-col gap-0.5 my-0.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[16/10] bg-neutral-900 rounded-2xs border border-stone-200 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-white/30" />
                </div>
              ))}
            </div>
            <span className="text-[4px] font-mono text-stone-400 border-t border-stone-100 pt-0.5 text-right">
              OCT 2026
            </span>
          </div>
        </div>
      );

    // 1. THEATER SHOW TICKET
    case 'theater':
      return (
        <div className={`w-full aspect-[9/14] bg-[#54121d] p-1 rounded-sm relative flex flex-col justify-between overflow-hidden shadow-inner ${className}`}>
          {/* Scallop notches */}
          <div className="absolute left-0 top-3 bottom-3 flex flex-col justify-between -ml-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-neutral-900" />
            ))}
          </div>
          <div className="absolute right-0 top-3 bottom-3 flex flex-col justify-between -mr-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-neutral-900" />
            ))}
          </div>
          {/* Card */}
          <div className="bg-[#fdfbf3] border border-[#54121d] rounded p-1 h-full flex flex-col justify-between mx-1">
            <div className="text-center border-b border-[#54121d] pb-0.5">
              <span className="text-[5px] text-[#54121d] block">★★★</span>
              <span className="font-cursive text-[9px] text-[#54121d] font-bold leading-none block">Theather</span>
            </div>
            <div className="flex flex-col gap-1 my-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-neutral-800 rounded-xs border border-[#54121d]/40 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                </div>
              ))}
            </div>
            <div className="text-[5px] text-center font-serif text-[#54121d] font-bold border-t border-[#54121d] pt-0.5">
              kafastudio.
            </div>
          </div>
        </div>
      );

    // 2. DETIK AIR BOARDING PASS
    case 'boarding_detik':
      return (
        <div className={`w-full aspect-[9/14] bg-[#601322] p-1 rounded-lg relative flex flex-col overflow-hidden shadow ${className}`}>
          <div className="bg-white rounded p-1 h-full flex flex-col justify-between">
            <div className="bg-[#601322] text-white px-1 py-0.5 rounded text-[5px] font-mono flex justify-between font-bold">
              <span>DETIK AIR ✈</span>
              <span>USA➔CN</span>
            </div>
            <div className="text-[8px] font-black text-center my-0.5">USA ✈ CN</div>
            <div className="grid grid-cols-2 gap-1 my-0.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-neutral-800 rounded-xs flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-white/30" />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-neutral-300 pt-0.5 text-[5px] font-mono text-neutral-600">
              <span>GATE 15</span>
              <span>18A</span>
              <div className="w-4 h-1.5 bg-neutral-900" />
            </div>
          </div>
        </div>
      );

    // 3. AIR MAIL POSTCARD
    case 'airmail_meenie':
      return (
        <div className={`w-full aspect-[9/14] airmail-border p-1 rounded-xl relative flex flex-col overflow-hidden shadow ${className}`}>
          <div className="bg-[#f8f5ee] rounded-lg p-1 h-full flex flex-col justify-between">
            <div className="flex justify-between items-center text-[5px] font-mono text-neutral-600">
              <span className="font-bold text-blue-900">PAR AVION ✈</span>
              <span className="text-red-700 font-bold border border-red-700 px-0.5 rounded-2xs text-[4px]">25¢</span>
            </div>
            <div className="flex flex-col gap-1 my-0.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-white p-0.5 rounded shadow-xs border border-neutral-300">
                  <div className="w-full h-full bg-neutral-800 rounded-xs flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-[5px] font-mono border-t border-dashed border-neutral-300 pt-0.5">
              <span className="text-neutral-500">SEND TO:</span>
              <span className="text-red-700 font-bold border border-red-700 px-0.5 rounded text-[4.5px]">APPROVED</span>
            </div>
          </div>
        </div>
      );

    // 4. CAPTURE STORY NEWSPAPER
    case 'editorial':
    case 'capture_story':
      return (
        <div className={`w-full aspect-[9/14] bg-[#fdfbf6] p-1.5 rounded border border-neutral-400 flex flex-col justify-between overflow-hidden shadow ${className}`}>
          <div className="bg-black text-white text-[5px] text-center font-mono py-0.5 font-bold">
            ★ PHOTOBOOTHOLOGY ★
          </div>
          <div className="text-center border-b border-black pb-0.5 my-0.5">
            <div className="font-serif italic text-[5px] text-neutral-600 leading-none">Capture your</div>
            <div className="font-serif font-black text-[8px] text-black leading-none">STORY TODAY</div>
          </div>
          <div className="flex flex-col gap-1 my-0.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-neutral-900 border border-black flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
              </div>
            ))}
          </div>
          <div className="text-[4px] font-serif text-neutral-600 leading-none truncate">
            "Every day holds moments that will never come again..."
          </div>
        </div>
      );

    // 5. YE OLE LONDONER
    case 'londoner':
    case 'ye_ole_londoner':
      return (
        <div className={`w-full aspect-[9/14] bg-[#f5f2e9] p-1.5 rounded border border-neutral-400 flex flex-col justify-between overflow-hidden shadow ${className}`}>
          <div className="border-b border-black pb-0.5 text-center">
            <span className="font-blackletter text-[8px] font-bold block leading-none">Ye Ole Londoner</span>
            <span className="text-[4px] font-serif block mt-0.5">GOOD TIMES TODAY!</span>
          </div>
          <div className="grid grid-cols-2 gap-1 my-1">
            <div className="aspect-[3/4] bg-neutral-900 border border-black flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white/30" />
            </div>
            <div className="flex flex-col gap-1 justify-between">
              <div className="aspect-[4/3] bg-neutral-900 border border-black" />
              <div className="text-[3.5px] font-serif leading-tight text-neutral-700">
                Turned it up should no valley cousin he...
              </div>
              <div className="aspect-[4/3] bg-neutral-900 border border-black" />
            </div>
          </div>
          <div className="border border-black text-center text-[4.5px] font-serif py-0.5 bg-[#eae4d3] font-bold">
            ★ LONDON 1888 EDITION ★
          </div>
        </div>
      );

    // 6. HARU FILM PASTEL SKY
    case 'haru_cloud':
      return (
        <div className={`w-full aspect-[9/14] bg-gradient-to-b from-sky-400 to-sky-200 p-1 rounded-xl relative flex flex-col justify-between overflow-hidden shadow ${className}`}>
          <div className="text-center pt-0.5">
            <div className="text-[5px] text-sky-900 font-sans tracking-widest font-bold">✦ HARU FILM ✦</div>
          </div>
          <div className="flex flex-col gap-1 my-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-white p-0.5 rounded-lg shadow-sm">
                <div className="w-full h-full bg-sky-950 rounded flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center text-[5px] font-mono text-sky-800 font-bold">
            2026.10.12 • SEOUL
          </div>
        </div>
      );

    // 7. LIFE4CUTS CLASSIC NAVY
    case 'life4cuts_classic':
      return (
        <div className={`w-full aspect-[9/14] bg-[#1e1b4b] p-1 rounded-sm relative flex flex-col justify-between overflow-hidden shadow ${className}`}>
          <div className="text-center pt-0.5">
            <div className="bg-rose-600 text-white text-[4px] px-1 py-0.2 rounded-full inline-block font-bold">
              인생네컷
            </div>
            <div className="text-[6px] font-black text-white mt-0.5">LIFE 4 CUTS</div>
          </div>
          <div className="flex flex-col gap-1 my-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-neutral-900 border border-indigo-400/30 rounded-xs flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
              </div>
            ))}
          </div>
          <div className="text-center text-[5px] font-mono text-indigo-300">
            SEOUL NO. 04
          </div>
        </div>
      );

    // 8. PHOTOISM MONOCHROME
    case 'photoism_mono':
      return (
        <div className={`w-full aspect-[9/14] bg-[#09090b] p-1.5 rounded border border-neutral-800 flex flex-col justify-between overflow-hidden shadow ${className}`}>
          <div className="flex justify-between items-center text-white pb-0.5 border-b border-neutral-800">
            <span className="font-serif italic font-bold text-[8px]">photoism.</span>
            <span className="text-[4px] font-mono text-neutral-400">SEOUL</span>
          </div>
          <div className="flex flex-col gap-1 my-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              </div>
            ))}
          </div>
          <div className="text-[5px] font-mono text-neutral-500 text-center">
            SELF PHOTO STUDIO
          </div>
        </div>
      );

    // 9. PURIKURA KAWAII
    case 'purikura_sparkle':
      return (
        <div className={`w-full aspect-[9/14] bg-gradient-to-b from-pink-400 to-rose-300 p-1 rounded-xl flex flex-col justify-between overflow-hidden shadow ${className}`}>
          <div className="text-center text-[5.5px] font-bold text-white drop-shadow">
            ★ プリクラ PURIKURA ★
          </div>
          <div className="flex flex-col gap-1 my-0.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-pink-100 p-0.5 rounded-xl border border-pink-400 shadow-sm">
                <div className="w-full h-full bg-pink-950 rounded-lg flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-300" />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center text-[5px] font-cursive font-bold text-pink-900">
            Besties Forever ♡
          </div>
        </div>
      );

    // 10. FUJI INSTAX POLAROID
    case 'fuji_instax':
      return (
        <div className={`w-full aspect-[9/14] bg-neutral-300 p-1 rounded-md flex flex-col justify-between overflow-hidden shadow ${className}`}>
          <div className="bg-white p-1 rounded h-full flex flex-col justify-between">
            <div className="flex flex-col gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-neutral-900 rounded-xs flex items-center justify-center border border-neutral-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                </div>
              ))}
            </div>
            <div className="text-center pt-1 font-cursive text-[8px] text-neutral-800 font-bold">
              our day ♡
              <div className="text-[4px] font-mono text-neutral-400 mt-0.5">INSTAX MINI</div>
            </div>
          </div>
        </div>
      );

    // 11. 35MM FILM SPROCKET
    case 'film_sprocket':
      return (
        <div className={`w-full aspect-[9/14] bg-[#09090b] p-1 rounded flex flex-col justify-between relative overflow-hidden shadow ${className}`}>
          {/* Left/right sprocket holes */}
          <div className="absolute left-0.5 top-2 bottom-2 flex flex-col justify-between">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-1.5 h-2 bg-neutral-800 border border-neutral-700 rounded-xs" />
            ))}
          </div>
          <div className="absolute right-0.5 top-2 bottom-2 flex flex-col justify-between">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-1.5 h-2 bg-neutral-800 border border-neutral-700 rounded-xs" />
            ))}
          </div>
          <div className="mx-2 text-center text-[4.5px] font-mono text-yellow-500">
            KODAK PORTRA 400
          </div>
          <div className="mx-2 flex flex-col gap-1 my-0.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-neutral-900 border border-neutral-700 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
              </div>
            ))}
          </div>
          <div className="mx-2 text-center text-[4.5px] font-mono text-yellow-500">
            SAFETY FILM • 24A
          </div>
        </div>
      );

    // 12. WINDOWS 95 RETRO
    case 'windows_95':
      return (
        <div className={`w-full aspect-[9/14] bg-[#008080] p-1 rounded flex flex-col justify-between overflow-hidden shadow ${className}`}>
          <div className="bg-[#c0c0c0] p-1 rounded border-2 border-t-white border-l-white border-b-black border-r-black h-full flex flex-col justify-between">
            <div className="bg-[#000080] text-white px-1 py-0.5 text-[5px] font-mono flex justify-between items-center font-bold">
              <span>🗔 Photobooth.bmp</span>
              <span>✕</span>
            </div>
            <div className="flex flex-col gap-1 my-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-neutral-900 border border-black flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                </div>
              ))}
            </div>
            <div className="bg-[#c0c0c0] text-[4px] font-mono border-t border-white pt-0.5 text-neutral-700">
              4 object(s) selected
            </div>
          </div>
        </div>
      );

    // 13. SPOTIFY NOW PLAYING
    case 'spotify_player':
      return (
        <div className={`w-full aspect-[9/14] bg-[#121212] p-1.5 rounded-xl border border-neutral-800 flex flex-col justify-between overflow-hidden shadow ${className}`}>
          <div className="flex justify-between items-center text-[5px] font-mono text-neutral-400">
            <span>NOW PLAYING</span>
            <span className="text-emerald-400 font-bold">● SPOTIFY</span>
          </div>
          <div className="flex flex-col gap-1 my-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-neutral-800 rounded-md flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
              </div>
            ))}
          </div>
          <div className="text-[5px] text-white truncate font-bold">Golden Hour</div>
          <div className="w-full bg-neutral-800 h-1 rounded-full overflow-hidden mt-0.5">
            <div className="w-2/3 bg-emerald-500 h-full" />
          </div>
        </div>
      );

    // 14. 1994 VHS TAPE
    case 'vhs_cassette':
      return (
        <div className={`w-full aspect-[9/14] bg-[#1c1917] p-1.5 rounded border border-neutral-700 flex flex-col justify-between overflow-hidden shadow ${className}`}>
          <div className="flex justify-between text-[5px] font-mono text-emerald-400 font-bold">
            <span>▶ PLAY 00:14:28</span>
            <span>SP</span>
          </div>
          <div className="flex flex-col gap-1 my-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-neutral-900 border border-neutral-700 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
              </div>
            ))}
          </div>
          <div className="text-[5px] font-mono text-neutral-400 text-center">
            OCT. 12 1994
          </div>
        </div>
      );

    // 15. VOGUE FASHION MAGAZINE
    case 'vogue_chic':
    case 'vogue_minimal':
      return (
        <div className={`w-full aspect-[9/14] bg-black p-1 rounded border border-neutral-800 flex flex-col justify-between overflow-hidden shadow ${className}`}>
          <div className="bg-white p-1 rounded-xs h-full flex flex-col justify-between">
            <div className="text-center font-serif font-black text-[10px] text-black leading-none tracking-widest border-b border-black pb-0.5">
              ELEGANCE.
            </div>
            <div className="flex flex-col gap-0.5 my-0.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[16/9] bg-neutral-900 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-white/30" />
                </div>
              ))}
            </div>
            <div className="text-[4px] font-serif uppercase tracking-widest text-center text-black font-bold border-t border-black pt-0.5">
              THE AUTUMN ISSUE
            </div>
          </div>
        </div>
      );

    // 16. THERMAL CAFE RECEIPT
    case 'cafe_receipt':
      return (
        <div className={`w-full aspect-[9/14] bg-[#292524] p-1 rounded flex flex-col justify-between overflow-hidden shadow ${className}`}>
          <div className="bg-[#fafaf9] p-1 rounded-sm h-full flex flex-col justify-between font-mono text-[5px] text-stone-900">
            <div className="text-center font-bold border-b border-dashed border-stone-400 pb-0.5">PHOTO CAFE</div>
            <div className="flex flex-col gap-0.5 my-0.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[16/9] bg-neutral-900 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-white/30" />
                </div>
              ))}
            </div>
            <div className="text-center border-t border-dashed border-neutral-400 pt-0.5">
              <div className="h-1.5 bg-neutral-900 my-0.5" />
              <div className="text-[4px]">THANK YOU! :)</div>
            </div>
          </div>
        </div>
      );

    // 17. CONCERT VIP FESTIVAL PASS
    case 'concert_vip':
      return (
        <div className={`w-full aspect-[9/14] bg-[#18181b] p-1 rounded-lg border border-rose-500/40 flex flex-col justify-between overflow-hidden shadow ${className}`}>
          <div className="w-4 h-1 bg-white/40 mx-auto rounded-full mb-0.5" />
          <div className="bg-rose-600 text-white text-[4.5px] text-center font-bold py-0.5 rounded">
            VIP ALL ACCESS
          </div>
          <div className="flex flex-col gap-0.5 my-0.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[16/9] bg-neutral-900 border border-rose-500/30 rounded-2xs flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-white/30" />
              </div>
            ))}
          </div>
          <div className="text-[4px] font-mono text-center text-rose-400 font-bold">
            SUMMER SONIC 2026
          </div>
        </div>
      );

    // 18. VINTAGE CINEMA PERFORATED STUB
    case 'cinema_stub':
    case 'golden_ticket':
      return (
        <div className={`w-full aspect-[9/14] bg-[#78350f] p-1 rounded flex flex-col justify-between overflow-hidden shadow ${className}`}>
          <div className="bg-[#fef3c7] p-1 rounded h-full flex flex-col justify-between border border-[#78350f] text-[#78350f]">
            <div className="text-center font-serif font-black text-[5px] border-b border-dashed border-[#78350f] pb-0.5">
              GRAND PALACE
            </div>
            <div className="flex flex-col gap-0.5 my-0.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[16/9] bg-neutral-900 border border-[#78350f]/50 rounded-2xs flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-white/30" />
                </div>
              ))}
            </div>
            <div className="text-[4px] font-mono text-center font-bold border-t border-dashed border-[#78350f] pt-0.5 text-red-700">
              ADMIT ONE • C14
            </div>
          </div>
        </div>
      );

    // 19. TOKYO METRO EXPRESS PASS
    case 'train_pass':
    case 'train_sleeper':
      return (
        <div className={`w-full aspect-[9/14] bg-[#0f766e] p-1 rounded flex flex-col justify-between overflow-hidden shadow ${className}`}>
          <div className="bg-[#f0fdfa] p-1 rounded h-full flex flex-col justify-between text-[#115e59] font-mono">
            <div className="bg-[#0f766e] text-white text-center font-bold text-[4.5px] py-0.5 rounded-2xs">
              SHINJUKU ➔ SHIBUYA
            </div>
            <div className="flex flex-col gap-0.5 my-0.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[16/9] bg-neutral-900 border border-[#0f766e]/40 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-white/30" />
                </div>
              ))}
            </div>
            <div className="text-[4px] font-bold text-center border-t border-dashed border-[#0f766e]/40 pt-0.5">
              ¥320 FARE PAID
            </div>
          </div>
        </div>
      );

    // 20. THE SUNDAY MORNING POST
    case 'morning_post':
      return (
        <div className={`w-full aspect-[9/14] bg-[#e7e5e4] p-1 rounded border border-stone-300 flex flex-col justify-between overflow-hidden shadow ${className}`}>
          <div className="bg-[#fafaf9] p-1 rounded-xs h-full flex flex-col justify-between text-stone-900">
            <div className="text-center border-b-2 border-stone-900 pb-0.5">
              <span className="font-serif font-black text-[5px] block tracking-tight">SUNDAY MORNING POST</span>
              <span className="text-[3.5px] font-mono text-stone-500 block">SUNNY • 24°C</span>
            </div>
            <div className="flex flex-col gap-0.5 my-0.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[16/9] bg-neutral-900 border border-stone-400 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-white/30" />
                </div>
              ))}
            </div>
            <div className="text-[4px] font-serif font-bold text-center border-t border-stone-800 pt-0.5">
              A PERFECT DAY TO SMILE
            </div>
          </div>
        </div>
      );

    // 21. LE PETIT PARISIEN GAZETTE
    case 'paris_gazette':
      return (
        <div className={`w-full aspect-[9/14] bg-[#c2b59b] p-1 rounded border border-stone-400 flex flex-col justify-between overflow-hidden shadow ${className}`}>
          <div className="bg-[#f5edd6] p-1 rounded-xs h-full flex flex-col justify-between text-[#292524]">
            <div className="text-center border-b border-[#292524] pb-0.5">
              <span className="font-serif font-black text-[5.5px] block">LE PETIT PARISIEN</span>
              <span className="text-[3.8px] font-serif italic block">L’Amour Toujours</span>
            </div>
            <div className="flex flex-col gap-0.5 my-0.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[16/9] bg-neutral-900 border border-[#292524]/50 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-white/30" />
                </div>
              ))}
            </div>
            <div className="text-[3.8px] font-mono text-center border-t border-[#292524] pt-0.5 font-bold">
              PARIS • ÉDITION SPÉCIALE
            </div>
          </div>
        </div>
      );

    // 22. BILLBOARD RECORD WEEKLY TIMES
    case 'record_times':
      return (
        <div className={`w-full aspect-[9/14] bg-[#292524] p-1 rounded flex flex-col justify-between overflow-hidden shadow ${className}`}>
          <div className="bg-[#f5f5f4] p-1 rounded-xs h-full flex flex-col justify-between text-stone-900">
            <div className="bg-stone-900 text-white text-center font-sans font-black text-[5px] py-0.5">
              THE RECORD TIMES
            </div>
            <div className="flex flex-col gap-0.5 my-0.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[16/9] bg-neutral-900 border border-stone-800 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-white/30" />
                </div>
              ))}
            </div>
            <div className="text-[4px] font-mono font-bold text-center border-t border-stone-800 pt-0.5">
              TOP #1 HIT RECORD ★
            </div>
          </div>
        </div>
      );

    // 23. FRENCH LOVE LETTER
    case 'love_letter':
      return (
        <div className={`w-full aspect-[9/14] bg-[#831843] p-1 rounded-lg flex flex-col justify-between overflow-hidden shadow ${className}`}>
          <div className="bg-[#fff1f2] p-1 rounded h-full flex flex-col justify-between text-pink-900">
            <div className="text-center font-cursive text-[8px] font-bold border-b border-pink-200 pb-0.5">
              Lettre d’Amour
            </div>
            <div className="flex flex-col gap-0.5 my-0.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[16/9] bg-neutral-900 rounded-2xs border border-pink-300 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-white/30" />
                </div>
              ))}
            </div>
            <div className="text-center text-[4.5px] font-serif font-bold text-rose-800 border-t border-pink-200 pt-0.5">
              ✦ WITH LOVE ♡ ✦
            </div>
          </div>
        </div>
      );

    // 24. WASHI TAPE SCRAPBOOK
    case 'scrapbook_kraft':
    case 'washi_scrapbook':
      return (
        <div className={`w-full aspect-[9/14] bg-[#78350f] p-1 rounded flex flex-col justify-between overflow-hidden shadow ${className}`}>
          <div className="bg-[#fef3c7] p-1 rounded h-full flex flex-col justify-between text-amber-950 relative">
            <div className="w-6 h-1.5 bg-rose-400 -rotate-6 absolute -top-0.5 left-1.5 shadow text-[3px] text-white text-center font-mono">TAPE</div>
            <div className="text-center font-mono font-bold text-[5px] pt-0.5 border-b border-amber-900/20 pb-0.5">
              OUR SCRAPBOOK
            </div>
            <div className="flex flex-col gap-0.5 my-0.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[16/9] bg-neutral-900 rounded-2xs flex items-center justify-center shadow-xs border border-white">
                  <div className="w-1 h-1 rounded-full bg-white/30" />
                </div>
              ))}
            </div>
            <div className="text-[4.5px] font-cursive font-bold text-center text-amber-900">
              best memories ♡
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div
          className={`w-full aspect-[9/14] p-1 rounded-sm flex flex-col justify-between overflow-hidden shadow ${className}`}
          style={{ backgroundColor: template?.defaultBg || '#18181b' }}
        >
          <div
            className="p-1 rounded-xs h-full flex flex-col justify-between"
            style={{
              backgroundColor: template?.cardBg || '#ffffff',
              color: template?.textColor || '#18181b'
            }}
          >
            <div className="text-center font-serif font-bold text-[5px] truncate border-b border-current/20 pb-0.5">
              {template?.tag || 'STUDIO'}
            </div>
            <div className="flex flex-col gap-0.5 my-0.5">
              {[...Array(template?.slots || 4)].map((_, i) => (
                <div key={i} className="aspect-[16/9] bg-neutral-900 rounded-2xs flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-white/30" />
                </div>
              ))}
            </div>
            <div className="text-[4px] font-mono text-center opacity-75 truncate">
              PHOTOBOOTH
            </div>
          </div>
        </div>
      );
  }
}
