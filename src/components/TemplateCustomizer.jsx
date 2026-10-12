import React from 'react';
import { Type, Sparkles } from 'lucide-react';
import { TEMPLATES_LIST } from '../data/templatesData';

export default function TemplateCustomizer({
  activeTemplateId,
  customData,
  onChangeCustomData
}) {
  const activeTemplate = TEMPLATES_LIST.find((t) => t.id === activeTemplateId) || TEMPLATES_LIST[0];
  const fields = activeTemplate?.customFields || {};
  const currentCustom = customData[activeTemplateId] || {};

  const handleFieldChange = (key, val) => {
    onChangeCustomData({
      ...customData,
      [activeTemplateId]: {
        ...currentCustom,
        [key]: val
      }
    });
  };

  // Friendly human labels for template keys
  const getFieldLabel = (key) => {
    const labels = {
      title: 'Judul Utama',
      headline: 'Headline Berita',
      headlineMain: 'Headline Utama',
      headlineLead: 'Sub-Headline Awal',
      masthead: 'Nama Koran',
      airline: 'Nama Maskapai',
      origin: 'Kota Asal (3 Huruf)',
      destination: 'Kota Tujuan (3 Huruf)',
      flight: 'Nomor Penerbangan',
      gate: 'Pintu Gate',
      seat: 'Nomor Kursi',
      departure: 'Jam Berangkat',
      passenger: 'Nama Penumpang',
      recipient: 'Nama Penerima (Send To)',
      brand: 'Nama Brand / Studio',
      studioName: 'Nama Studio',
      stampText: 'Teks Cap Stempel',
      songTitle: 'Judul Lagu (Spotify)',
      artist: 'Penyanyi / Artis',
      names: 'Nama Pasangan (Wedding)',
      event: 'Nama Acara / Event',
      cafeName: 'Nama Kafe',
      caption: 'Tulisan Spidol (Polaroid)',
      date: 'Tanggal / Waktu',
      volume: 'Edisi / Volume',
      socialTag: 'Akun Instagram / Medsos',
      ribbon: 'Teks Pita Slogan',
      album: 'Judul Album',
      version: "Versi Album (Taylor's Version)",
      lyric1: 'Lirik Baris 1 (Atas)',
      lyric2: 'Lirik Baris 2 (Tengah)',
      lyric3: 'Lirik Baris 3 (Bawah)',
      edition: 'Edisi (XXL)',
      barcodeText: 'Teks Barcode (Panorama)',
      badgeTop: 'Badge Atas (70s)',
      subYear: "Tahun Sub (1990'S)",
      groupName: 'Nama Grup (Momenku Group)',
      bigWord: 'Kata Utama Tipografi (FOOL)',
      subline: 'Slogan Bawah (FOR YOU)',
      header: 'Judul Header',
      song1: 'Lagu 1 (Strip Kiri)',
      artist1: 'Artis 1 (Strip Kiri)',
      song2: 'Lagu 2 (Strip Kanan)',
      artist2: 'Artis 2 (Strip Kanan)',
      handle: 'Akun Medsos (@cherishphotobox)',
      badgeNum: 'Nomor Badge (16)',
      song: 'Judul Lagu Player',
      quote: 'Kutipan / Kata Mutiara',
      idolName: 'Nama Idol / Orang Spesial',
      idolDate: 'Tanggal Ultah / Event',
      dateTape: 'Label Tanggal Lakban',
      tagline: 'Tagline Studio',
      stampSide: 'Stempel Samping',
      flight1: 'Rute Penerbangan 1',
      flight2: 'Rute Penerbangan 2',
      gate1: 'Gate 1',
      seat1: 'Seat 1',
      gate2: 'Gate 2',
      seat2: 'Seat 2',
      ticketTitle: 'Judul Tiket',
      city: 'Kota',
      duration: 'Durasi / Waktu'
    };
    return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  const fieldKeys = Object.keys(fields);

  return (
    <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-indigo-50 text-indigo-500">
            <Type className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-stone-800 font-bold text-sm">
              Kustomisasi Teks: {activeTemplate.name}
            </h3>
            <p className="text-stone-400 text-xs">
              Ubah tulisan, tanggal, nama, atau teks pribadi langsung di template aktif
            </p>
          </div>
        </div>
      </div>

      {fieldKeys.length === 0 ? (
        <div className="text-center py-6 text-stone-400 text-xs">
          Template ini menggunakan layout visual murni tanpa kolom teks tambahan.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {fieldKeys.map((key) => {
            const value = currentCustom[key] !== undefined ? currentCustom[key] : fields[key];
            return (
              <div key={key} className="space-y-1">
                <label className="text-stone-600 block text-[11px] font-semibold">
                  {getFieldLabel(key)}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 text-xs focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:outline-none transition shadow-2xs"
                  placeholder={`Masukkan ${getFieldLabel(key).toLowerCase()}...`}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
