import React from 'react';
import { getFilterStyle } from '../../utils/filterEngine';

export default function YeOleLondonerTemplate({
  photos,
  filterSettings,
  customData = {},
  isTwin = false, // Single broadsheet format default
  onPhotoClick
}) {
  const {
    masthead = 'Ye Ole Londoner',
    motto = 'The pen is mightier than the sword!',
    weather = 'WEATHER REPORT: Today is sunny with a slight chance of showers.',
    headline = 'GOOD TIMES TODAY!',
    subhead1 = 'Another headline',
    subhead2 = 'A descriptive headline goes in here',
    footerAd = 'Advertisement Goes Here!',
    datePrice = 'VOL. I, NO. 1 • NEWS FOR TODAY! • PRICE $0.10'
  } = customData;

  const filterStyle = getFilterStyle(filterSettings);

  const renderBroadsheet = (keyPrefix) => (
    <div
      key={keyPrefix}
      className="relative w-[340px] sm:w-[420px] bg-[#f5f2e9] p-4 text-neutral-900 rounded-sm shadow-2xl border border-neutral-300 flex flex-col select-none"
      style={{
        boxShadow: '0 25px 50px rgba(0,0,0,0.45)',
        backgroundColor: '#f5f2e9'
      }}
    >
      {/* Header Newspaper Row */}
      <div className="grid grid-cols-[85px_1fr_85px] items-center gap-1 border-b-2 border-black pb-1.5">
        
        {/* Left motto box */}
        <div className="border border-black p-1 text-[7px] font-serif italic text-center leading-tight">
          "{motto}"
        </div>

        {/* Center Gothic Masthead */}
        <div className="text-center">
          <h1 className="font-blackletter text-3xl sm:text-4xl text-black tracking-normal leading-none font-bold">
            {masthead}
          </h1>
        </div>

        {/* Right weather box */}
        <div className="border border-black p-1 text-[6.5px] font-serif text-center leading-tight">
          <span className="font-bold block uppercase">WEATHER</span>
          Sunny & Joyous
        </div>

      </div>

      {/* Vol / Price rule */}
      <div className="flex justify-between items-center text-[7.5px] font-serif border-b-2 border-black py-0.5 tracking-wider uppercase font-bold text-neutral-800">
        <span>VOL. I, NO. 1</span>
        <span>NEWS FOR TODAY!</span>
        <span>PRICE $0.10</span>
      </div>

      {/* Main Front Page Banner Headline */}
      <div className="text-center py-2 border-b-2 border-black">
        <h2 className="font-serif font-black text-3xl sm:text-4xl tracking-tight leading-none text-black uppercase">
          {headline}
        </h2>
      </div>

      {/* Content Columns Grid (Hero on left, smaller columns on right) */}
      <div className="grid grid-cols-12 gap-2.5 my-2.5">
        
        {/* Left Hero Column: Large Photo (Photos 0 & 3) */}
        <div className="col-span-7 flex flex-col gap-2">
          
          {/* Main Hero Photo (Slot 0) */}
          <div
            onClick={() => onPhotoClick && onPhotoClick(0)}
            className="group relative aspect-[3/4] w-full bg-neutral-900 border border-black overflow-hidden cursor-pointer shadow-sm"
          >
            {photos[0] ? (
              <div className="w-full h-full relative overflow-hidden">
                <img
                  src={photos[0]}
                  alt="Front Page Hero"
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
                <span>Hero Photo</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 bg-neutral-900 text-white text-[10px] px-2 py-0.5 rounded shadow">
                Ganti Foto
              </span>
            </div>
          </div>

          <div className="text-[7.5px] font-serif italic text-neutral-600 border-b border-black pb-1">
            "A lively group gathered today creating memories of a lifetime."
          </div>

        </div>

        {/* Right Column: Photo 1, Article, Photo 2 */}
        <div className="col-span-5 flex flex-col gap-2">
          
          {/* Photo 1 */}
          <div
            onClick={() => onPhotoClick && onPhotoClick(1)}
            className="group relative aspect-[4/3] w-full bg-neutral-900 border border-black overflow-hidden cursor-pointer shadow-sm"
          >
            {photos[1] ? (
              <div className="w-full h-full relative overflow-hidden">
                <img
                  src={photos[1]}
                  alt="Side Photo 1"
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
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400 font-mono text-xs">
                <span>Slot 2</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 bg-neutral-900 text-white text-[9px] px-1.5 py-0.5 rounded shadow">
                Ganti
              </span>
            </div>
          </div>

          {/* Right Subhead & Text Snippet */}
          <div className="border-t border-black pt-1">
            <h3 className="font-serif font-bold text-xs uppercase leading-tight text-black">
              {subhead1}
            </h3>
            <p className="text-[6.5px] font-serif text-justify text-neutral-800 leading-tight mt-0.5">
              Advice me contain an spring of revived. Tell me paid law ever yet now. Means to learn of vexed if style allow he there. Tilad man stood terms any joy cheer term say widen. Procuring convinced suspicion to ten.
            </p>
          </div>

          {/* Photo 2 */}
          <div
            onClick={() => onPhotoClick && onPhotoClick(2)}
            className="group relative aspect-[4/3] w-full bg-neutral-900 border border-black overflow-hidden cursor-pointer shadow-sm mt-auto"
          >
            {photos[2] ? (
              <div className="w-full h-full relative overflow-hidden">
                <img
                  src={photos[2]}
                  alt="Side Photo 2"
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
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400 font-mono text-xs">
                <span>Slot 3</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 bg-neutral-900 text-white text-[9px] px-1.5 py-0.5 rounded shadow">
                Ganti
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Broadsheet Columns */}
      <div className="border-t-2 border-black pt-1 pb-1">
        <h4 className="font-serif font-bold text-sm tracking-tight text-black text-left">
          {subhead2}
        </h4>
        <div className="grid grid-cols-3 gap-2 mt-1 text-[6.5px] font-serif text-justify text-neutral-800 leading-tight">
          <p>
            Turned it up should no valley cousin he. Speaking numerous ask did horrible packages set. Ashamed bemenf has dimmf can studied sun. Led directing in middleton perpetual fulfilled provision frankness.
          </p>
          <p>
            Remember outweigh do he desirous no cheerful. He of doors water ye past. We if prosperity comparison middleton it. Fark we in lose like at no. An as to preferred convinced desirous he determine.
          </p>
          <p>
            Unpleasant astonished an diminution up partiality. Naisy an they of steam. Dash meios up civil the an silky womd of Called squae an in afnid direct. Resolution wow what a nowai diminution conviction to mr as.
          </p>
        </div>
      </div>

      {/* Footer Crown Advertisement Banner */}
      <div className="border-2 border-black mt-1 p-1 text-center bg-[#eae4d3] rounded flex items-center justify-center gap-3">
        <span className="text-base">👑</span>
        <span className="font-cursive text-xl font-bold text-black tracking-wide">
          {footerAd}
        </span>
        <span className="text-base">👑</span>
      </div>

    </div>
  );

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-2">
      {renderBroadsheet('londoner-1')}
      {isTwin && renderBroadsheet('londoner-2')}
    </div>
  );
}
