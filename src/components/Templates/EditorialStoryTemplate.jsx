import React from 'react';
import { getFilterStyle } from '../../utils/filterEngine';

export default function EditorialStoryTemplate({
  photos,
  filterSettings,
  customData = {},
  isTwin = true,
  onPhotoClick
}) {
  const {
    headlineLead = 'Capture your',
    headlineMain = 'STORY TODAY',
    edition = 'SPECIAL EDITION',
    volume = 'VOL. 01, NO. 4 • 1992',
    quoteTitle = 'WRITE YOUR OWN STORY',
    quoteBody = 'Every day holds moments that will never come again. This is your canvas—a place to express, reflect, and capture parts of your story. A picture—you are writing a part of your story.',
    articleBody = 'Time moves quickly. What feels ordinary today can become something deeply meaningful tomorrow. A photo has the power to pause time, to hold emotions, and to remind us of who we were and who we shared those moments with.',
    socialTag = 'ig : @photobooth.story'
  } = customData;

  const filterStyle = getFilterStyle(filterSettings);

  const renderSingleStrip = (keyPrefix) => (
    <div
      key={keyPrefix}
      className="relative w-[300px] sm:w-[320px] bg-[#fdfbf6] p-4 text-neutral-900 shadow-2xl rounded-sm flex flex-col select-none border border-neutral-300"
      style={{
        boxShadow: '0 20px 40px rgba(0,0,0,0.45)'
      }}
    >
      {/* Top Black Bar Masthead */}
      <div className="bg-black text-white px-2 py-1 flex items-center justify-between text-[10px] font-serif tracking-widest uppercase">
        <span className="w-4 h-2 bg-white inline-block mr-1"></span>
        <span className="font-bold flex items-center gap-1.5">
          <span>★</span> PHOTOBOOTHOLOGY <span>★</span>
        </span>
        <span className="w-4 h-2 bg-white inline-block ml-1"></span>
      </div>

      {/* Subhead info line */}
      <div className="flex justify-between items-center text-[8px] font-serif border-b border-black py-1 uppercase tracking-tight text-neutral-700">
        <span>{edition}</span>
        <span className="font-bold">{volume}</span>
      </div>

      {/* Main Newspaper Headline */}
      <div className="pt-2 pb-1 text-left">
        <p className="font-serif italic text-lg leading-none text-neutral-800">{headlineLead}</p>
        <h1 className="font-serif font-black text-3xl tracking-tight leading-none text-black">
          {headlineMain}
        </h1>
      </div>

      {/* Content Stack with 3 Photos & Magazine Article Snippets */}
      <div className="flex flex-col gap-2.5 my-2 flex-1">
        
        {/* Photo 1 */}
        <div
          onClick={() => onPhotoClick && onPhotoClick(0)}
          className="group relative aspect-[4/3] w-full bg-neutral-900 border border-black overflow-hidden cursor-pointer shadow-sm"
        >
          {photos[0] ? (
            <div className="w-full h-full relative overflow-hidden">
              <img
                src={photos[0]}
                alt="Story Photo 1"
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
              <span>Photo 1</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 bg-neutral-900 text-white text-[10px] px-2 py-0.5 rounded shadow">
              Ganti Foto
            </span>
          </div>
        </div>

        {/* Editorial Quote Box 1 */}
        <div className="grid grid-cols-[85px_1fr] gap-2 items-center border-y border-black py-1">
          <div className="bg-black text-white text-[9px] font-serif font-black p-1 text-center uppercase leading-tight flex items-center justify-center">
            {quoteTitle}
          </div>
          <p className="text-[7.5px] font-serif italic text-neutral-800 leading-tight">
            {quoteBody}
          </p>
        </div>

        {/* Photo 2 */}
        <div
          onClick={() => onPhotoClick && onPhotoClick(1)}
          className="group relative aspect-[4/3] w-full bg-neutral-900 border border-black overflow-hidden cursor-pointer shadow-sm"
        >
          {photos[1] ? (
            <div className="w-full h-full relative overflow-hidden">
              <img
                src={photos[1]}
                alt="Story Photo 2"
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
              <span>Photo 2</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 bg-neutral-900 text-white text-[10px] px-2 py-0.5 rounded shadow">
              Ganti Foto
            </span>
          </div>
        </div>

        {/* Photo 3 */}
        <div
          onClick={() => onPhotoClick && onPhotoClick(2)}
          className="group relative aspect-[4/3] w-full bg-neutral-900 border border-black overflow-hidden cursor-pointer shadow-sm"
        >
          {photos[2] ? (
            <div className="w-full h-full relative overflow-hidden">
              <img
                src={photos[2]}
                alt="Story Photo 3"
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
              <span>Photo 3</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 bg-neutral-900 text-white text-[10px] px-2 py-0.5 rounded shadow">
              Ganti Foto
            </span>
          </div>
        </div>

        {/* Article Body Snippet */}
        <div className="border-t border-black pt-1">
          <p className="text-[7.5px] font-serif text-justify text-neutral-700 leading-tight">
            {articleBody}
          </p>
        </div>

      </div>

      {/* Bottom Newspaper Banner */}
      <div className="bg-black text-white py-1 px-2 text-[8px] font-serif uppercase tracking-wider flex items-center justify-between mt-auto">
        <span>PHOTOBOOTH</span>
        <span>★</span>
        <span>PHOTOBOOTHOLOGY</span>
        <span>★</span>
        <span>NEWSPAPER</span>
      </div>

      {/* Social Handle Footer */}
      <div className="text-[9px] font-mono text-neutral-600 text-center pt-1.5 flex items-center justify-center gap-1">
        <span>📷</span>
        <span>{socialTag}</span>
      </div>

    </div>
  );

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-2">
      {renderSingleStrip('editorial-strip-1')}
      {isTwin && renderSingleStrip('editorial-strip-2')}
    </div>
  );
}
