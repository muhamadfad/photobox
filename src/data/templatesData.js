// 35 Authentic Photobooth Templates Dataset (Zero AI Flop - 100% Real Studio & Pinterest Aesthetics)

export const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'Semua (35)', icon: 'Sparkles' },
  { id: 'viral_momenku', name: 'Viral Studio (5)', icon: 'Flame' },
  { id: 'pinterest_popular', name: 'Pinterest Hits (6)', icon: 'Bookmark' },
  { id: 'korean_booth', name: 'Korean Studio (6)', icon: 'Heart' },
  { id: 'ticket_travel', name: 'Ticket & Flight (6)', icon: 'Ticket' },
  { id: 'newspaper_editorial', name: 'Editorial & Koran (6)', icon: 'Newspaper' },
  { id: 'postal_scrapbook', name: 'Postal & Polaroid (6)', icon: 'Mail' }
];

export const TEMPLATES_LIST = [
  // ===================== 1. VIRAL STUDIO (5 REFERENCE TEMPLATES) =====================
  {
    id: 'denim_1989',
    name: "1989 Taylor's Denim",
    category: 'viral_momenku',
    tag: 'Piku 1989',
    badge: 'Viral',
    defaultBg: '#1e385c',
    cardBg: '#1b3353',
    textColor: '#ffffff',
    theme: 'denim_1989',
    description: 'Denim jeans biru tua dengan jahitan benang putih, bintang bordir, logo PIKUBOOTH dan 1989 Taylor\'s Version.',
    slots: 3,
    aspect: 'Strip 3-Foto',
    customFields: {
      brand: 'PIKUBOOTH',
      album: '1989',
      version: "TAYLOR'S VERSION"
    }
  },
  {
    id: 'roblox_xxl',
    name: 'XXL Starry Lyrics Photobooth',
    category: 'viral_momenku',
    tag: 'Song Lyrics',
    badge: 'Viral',
    defaultBg: '#0b192e',
    cardBg: '#10233f',
    textColor: '#ffffff',
    theme: 'roblox_xxl',
    description: 'Awan nebula biru malam dengan divider lirik lagu, doodle bintang, dan logo XXL Piku Photobooth.',
    slots: 4,
    aspect: 'Strip 4-Foto',
    customFields: {
      lyric1: 'I still remember, I will forever',
      lyric2: "Backseat secrets, we won't ever tell,",
      lyric3: 'I miss you double XL',
      brand: 'PIKU PHOTOBOOTH',
      edition: 'XXL'
    }
  },
  {
    id: 'special_day_ticket',
    name: 'Special Day Cinema Ticket',
    category: 'viral_momenku',
    tag: 'Twin Alternating',
    badge: 'Viral',
    defaultBg: '#3d0a12',
    cardBg: '#ebe8e1',
    textColor: '#3d0a12',
    theme: 'special_day_ticket',
    description: 'Twin tiket bioskop marun bersilang: Strip kiri barcode di atas, strip kanan barcode di bawah dengan kaligrafi Special Day.',
    slots: 3,
    aspect: 'Twin Ticket',
    customFields: {
      barcodeText: 'PANORAMA',
      title: 'Special Day'
    }
  },
  {
    id: 'retro_90s_pop',
    name: '70s & 90s Retro Checkerboard',
    category: 'viral_momenku',
    tag: 'Retro Collage',
    badge: 'Viral',
    defaultBg: '#5c0d15',
    cardBg: '#7a1721',
    textColor: '#ffffff',
    theme: 'retro_90s_pop',
    description: 'Papan catur kuning-marun, kamera vintage Leica, bola 8 biliar, jamur Mario, tiket Boom Chute, dan logo RETRO 1990\'s.',
    slots: 4,
    aspect: 'Collage Strip',
    customFields: {
      badgeTop: '70s',
      title: 'RETRO',
      subYear: "1990'S"
    }
  },
  {
    id: 'spotify_fool',
    name: 'Fool For You Spotify Twin',
    category: 'viral_momenku',
    tag: 'Vinyl Music Twin',
    badge: 'Viral',
    defaultBg: '#441119',
    cardBg: '#f7f3ea',
    textColor: '#441119',
    theme: 'spotify_fool',
    description: 'Twin pemutar Spotify: Strip kiri merah marun dengan Spotify code, strip kanan krem dengan tipografi I\'M SUCH A FOOL FOR YOU dan piringan vinyl.',
    slots: 3,
    aspect: 'Music Twin',
    customFields: {
      groupName: 'PIKUBOOTH CLUB',
      headline: "I'M SUCH A",
      bigWord: 'FOOL',
      subline: 'FOR YOU'
    }
  },

  // ===================== 2. PINTEREST HITS (6 ASLI DARI REFERENSI) =====================
  {
    id: 'poserbox_playlist',
    name: "Pikubooth's Minimal Playlist",
    category: 'pinterest_popular',
    tag: 'Pikubooth Kiosk',
    badge: 'Pinterest Hit',
    defaultBg: '#38383a',
    cardBg: '#2c2c2e',
    textColor: '#ffffff',
    theme: 'poserbox_playlist',
    description: 'Photobooth minimalis Pikubooth: Strip kiri matte charcoal (The 1975), Strip kanan crisp white (The Police) dengan player musik otentik.',
    slots: 3,
    aspect: 'Playlist Twin',
    customFields: {
      header: "Pikubooth's Playlist",
      song1: 'ABOUT YOU',
      artist1: 'The 1975',
      song2: 'EVERY BREATH YOU TAKE',
      artist2: 'The Police'
    }
  },
  {
    id: 'cherish_cat',
    name: 'Midnight Cat "Bercinta"',
    category: 'pinterest_popular',
    tag: 'Donne Maula',
    badge: 'Trending',
    defaultBg: '#132238',
    cardBg: '#132238',
    textColor: '#ffffff',
    theme: 'cherish_cat',
    description: 'Photobooth navy midnight @pikubooth dengan pemutar lagu Donne Maula, stiker kucing hitam intip, dan kaligrafi emas One year down forever to go.',
    slots: 3,
    aspect: 'Strip 3-Foto',
    customFields: {
      handle: '@pikubooth',
      badgeNum: '16',
      song: 'Bercinta lewat kata',
      artist: 'Donne Maula',
      quote: 'One year down, forever to go ♡'
    }
  },
  {
    id: 'woodz_day',
    name: "It's Woodz Day Birthday Twin",
    category: 'pinterest_popular',
    tag: 'Korean Fan Day',
    badge: 'Viral ★',
    defaultBg: '#18181b',
    cardBg: '#ffffff',
    textColor: '#18181b',
    theme: 'woodz_day',
    description: 'Photobooth ultah idol Korea: Strip 1 keramik subway tile motif orange-biru & beanie boy, Strip 2 papan tulis kapur grunge dengan bola sepak 1996.',
    slots: 3,
    aspect: 'Fan Day Twin',
    customFields: {
      idolName: 'CHO SEUNGYOUN',
      idolDate: 'AUGUST 5TH',
      title: "IT'S WOODZ DAY!!",
      dateTape: '96.08.05'
    }
  },
  {
    id: 'phetoria_sage',
    name: 'Pikubooth Vintage Sage Green',
    category: 'pinterest_popular',
    tag: 'Warm Olive Sage',
    badge: 'Popular',
    defaultBg: '#465e3e',
    cardBg: '#465e3e',
    textColor: '#ffffff',
    theme: 'phetoria_sage',
    description: 'Warna hijau sage olive hangat khas studio Pikubooth dengan stempel tepi RETROBOOTH dan tipografi minimalis VINTAGE MEMORIES BOOTH.',
    slots: 3,
    aspect: 'Studio Strip',
    customFields: {
      brand: 'PIKUBOOTH',
      tagline: 'VINTAGE MEMORIES BOOTH',
      stampSide: 'RETROBOOTH'
    }
  },
  {
    id: 'vintage_mahogany',
    name: 'Vintage Mahogany & Brass Lamps',
    category: 'pinterest_popular',
    tag: 'Warm Woodgrain',
    badge: 'Classic Luxe',
    defaultBg: '#361e11',
    cardBg: '#361e11',
    textColor: '#f5e6d3',
    theme: 'vintage_mahogany',
    description: 'Tekstur kayu mahoni gelap dengan lampu dinding studio photobooth hangat dan kaligrafi tembaga Vintage Special berornamen sulur.',
    slots: 3,
    aspect: 'Mahogany Strip',
    customFields: {
      header: 'PIKU PLACE',
      title: 'Vintage Special',
      ornament: 'EST. 2026'
    }
  },
  {
    id: 'suafoto_ticket',
    name: 'Piku Candy Golden Ticket',
    category: 'pinterest_popular',
    tag: 'Sweet Memories',
    badge: 'Iconic',
    defaultBg: '#7c121d',
    cardBg: '#fefcf8',
    textColor: '#7c121d',
    theme: 'suafoto_ticket',
    description: 'Desain Piku Foto garis permen merah-putih dengan tiket emas, barcode dan stempel kenangan manis.',
    slots: 4,
    aspect: 'Candy Pass',
    customFields: {
      brand: "Piku Foto's",
      ticketTitle: 'PIKUBOOTH GOLDEN TICKET',
      city: 'SPECIAL',
      duration: 'SELAMANYA',
      footer: 'Manis - Manis Pikubooth'
    }
  },

  // ===================== 3. KOREAN STUDIO (6) =====================
  {
    id: 'haru_cloud',
    name: 'Piku Cloud Pastel Sky',
    category: 'korean_booth',
    tag: 'Signature Korea',
    badge: 'Top Pick',
    defaultBg: '#38bdf8',
    cardBg: '#e0f2fe',
    textColor: '#0369a1',
    theme: 'haru_cloud',
    description: 'Photobooth khas Korea dengan awan putih lembut dan warna langit pastel.',
    slots: 4,
    aspect: 'Cloud 4-Cut',
    customFields: {
      brand: 'piku film.',
      cloudNote: 'pure soft moments',
      date: '2026.10.13',
      studio: 'pikubooth studio'
    }
  },
  {
    id: 'life4cuts_classic',
    name: 'Life4Cuts Iconic Ribbon',
    category: 'korean_booth',
    tag: 'Life Four Cuts',
    badge: 'Classic',
    defaultBg: '#1e1b4b',
    cardBg: '#312e81',
    textColor: '#ffffff',
    theme: 'life4cuts',
    description: 'Strip photobooth khas Korea berlatar navy/burgundy dengan logo pita ikonik.',
    slots: 4,
    aspect: 'Life 4 Cuts',
    customFields: {
      brand: '인생네컷 • LIFE 4 CUTS',
      sub: 'THE BEST MOMENT OF MY LIFE',
      date: '2026.10.13',
      studioCode: 'PIKU NO. 04'
    }
  },
  {
    id: 'photoism_mono',
    name: 'Piku Mono Seoul Studio',
    category: 'korean_booth',
    tag: 'Clean Minimal',
    badge: 'Popular',
    defaultBg: '#0a0a0a',
    cardBg: '#18181b',
    textColor: '#f4f4f5',
    theme: 'photoism',
    description: 'Studio self-photo bergaya Seoul dengan frame hitam minimalis dan tipografi elegan.',
    slots: 4,
    aspect: 'Studio Strip',
    customFields: {
      brand: 'pikubooth.',
      tag: 'self photostudio project',
      date: 'OCTOBER 2026',
      city: 'SEOUL • TOKYO'
    }
  },
  {
    id: 'photolookup_cream',
    name: 'PikuLookup 2026 Navy Stars',
    category: 'korean_booth',
    tag: 'PikuLookup',
    badge: 'Pinterest Hit',
    defaultBg: '#1e293b',
    cardBg: '#f8fafc',
    textColor: '#0f172a',
    theme: 'photolookup_cream',
    description: 'Photobooth krem-navy dengan cap tahun 2026, bintang bordir marun, dan stempel PIKULOOKUP autentik.',
    slots: 4,
    aspect: 'Studio Strip',
    customFields: {
      brand: 'PIKULOOKUP',
      year: '2026',
      tagline: 'SAVE THE BEST MOMENT'
    }
  },
  {
    id: 'purikura_sparkle',
    name: 'Purikura Kawaii Glitter',
    category: 'korean_booth',
    tag: 'Japan Purikura',
    badge: 'Kawaii',
    defaultBg: '#ec4899',
    cardBg: '#fce7f3',
    textColor: '#be185d',
    theme: 'purikura',
    description: 'Photobooth Purikura Jepang dengan stiker bintang pastel, glitter dan aksen kelinci lucu.',
    slots: 4,
    aspect: 'Purikura Strip',
    customFields: {
      title: 'プリクラ ★ PURIKURA',
      sub: 'BESTIES FOREVER ♡',
      date: '’26 10.13',
      sparkleNote: 'キラキラ PIKU CUTE'
    }
  },
  {
    id: 'selfit_minimal',
    name: 'Pikufit Studio Clean Porcelain',
    category: 'korean_booth',
    tag: 'Porcelain Korea',
    badge: 'Clean',
    defaultBg: '#e7e5e4',
    cardBg: '#ffffff',
    textColor: '#292524',
    theme: 'selfit_minimal',
    description: 'Frame porselen hangat ultra-clean khas photobox Korea modern tanpa ornamen berlebih.',
    slots: 4,
    aspect: 'Clean 4-Cut',
    customFields: {
      brand: 'pikubooth studio.',
      subtitle: 'simple quiet moments',
      date: 'OCT 2026'
    }
  },

  // ===================== 4. TICKET & FLIGHT (6) =====================
  {
    id: 'boarding_flight',
    name: 'Flight Ticket IDN ➔ USA / SGP',
    category: 'ticket_travel',
    tag: 'Airline Boarding',
    badge: 'Pinterest Hit',
    defaultBg: '#1e385c',
    cardBg: '#fbf9f5',
    textColor: '#1a1a1a',
    theme: 'boarding_flight',
    description: 'Tiket boarding pass penerbangan IDN ➔ USA & IDN ➔ SGP dengan barcode, gate 14, seat 30A, dan cap maskapai.',
    slots: 3,
    aspect: 'Flight Twin',
    customFields: {
      flight1: 'IDN ➔ USA',
      gate1: '14',
      seat1: '30A',
      flight2: 'IDN ➔ SGP',
      gate2: '07',
      seat2: '11B',
      airline: 'PIKU AIRWAYS'
    }
  },
  {
    id: 'theater',
    name: 'Theater Show Ticket',
    category: 'ticket_travel',
    tag: 'Classic Cinema',
    badge: 'Trending',
    defaultBg: '#54121d',
    cardBg: '#fdfbf3',
    textColor: '#54121d',
    theme: 'theater',
    description: 'Tiket teater beludru marun dengan lubang gerigi perforasi di tepi.',
    slots: 4,
    aspect: 'Strip Vertikal',
    customFields: {
      title: 'Theater Show',
      row: 'B2',
      show: '02',
      date: 'Sunday, 29 March',
      time: '20.00',
      ribbon: '★ SAVE THE BEST MOMENT ★',
      studioName: 'pikubooth.'
    }
  },
  {
    id: 'boarding_detik',
    name: 'Piku Air Boarding Pass',
    category: 'ticket_travel',
    tag: 'Flight Pass',
    badge: 'Popular',
    defaultBg: '#601322',
    cardBg: '#fbf9f5',
    textColor: '#1a1a1a',
    theme: 'boarding',
    description: 'Tiket penerbangan maskapai internasional dengan barcode, gate, dan rute.',
    slots: 4,
    aspect: '2x2 Grid Pass',
    customFields: {
      airline: 'PIKU AIR',
      origin: 'USA',
      destination: 'CN',
      flight: 'GF 6815',
      gate: '15',
      seat: '18A',
      departure: '10:15 AM',
      passenger: 'BEST FRIENDS'
    }
  },
  {
    id: 'concert_vip',
    name: 'VIP Backstage Festival',
    category: 'ticket_travel',
    tag: 'Music Festival',
    badge: 'Hot',
    defaultBg: '#18181b',
    cardBg: '#27272a',
    textColor: '#f43f5e',
    theme: 'concert_vip',
    description: 'Lanyard VIP backstage pass festival musik neon dengan hologram bar.',
    slots: 4,
    aspect: 'Strip VIP',
    customFields: {
      festival: 'SUMMER SONIC 2026',
      tier: 'ALL ACCESS VIP',
      stage: 'MAIN STAGE',
      date: '12-14 OCT'
    }
  },
  {
    id: 'cinema_stub',
    name: 'Vintage Cinema Perforated Stub',
    category: 'ticket_travel',
    tag: 'Retro Cinema',
    badge: 'Vintage',
    defaultBg: '#78350f',
    cardBg: '#fef3c7',
    textColor: '#78350f',
    theme: 'cinema_stub',
    description: 'Karcis bioskop jadul dengan nomor seri stempel merah dan garis gunting.',
    slots: 4,
    aspect: 'Cinema Stub',
    customFields: {
      cinemaName: 'GRAND PALACE THEATRE',
      admit: 'ADMIT ONE • AUDITORIUM 03',
      seat: 'ROW C SEAT 14'
    }
  },
  {
    id: 'train_pass',
    name: 'Tokyo Metro Express Pass',
    category: 'ticket_travel',
    tag: 'Japan Railway',
    badge: 'Clean',
    defaultBg: '#0f766e',
    cardBg: '#f0fdfa',
    textColor: '#115e59',
    theme: 'train_pass',
    description: 'Karcis kereta metro ekspres dengan stempel stasiun Shinjuku dan stempel tanggal.',
    slots: 4,
    aspect: 'Metro Pass',
    customFields: {
      line: 'SHINJUKU EXPRESS LINE',
      from: 'SHINJUKU',
      to: 'SHIBUYA',
      fare: '¥320 FARE PAID'
    }
  },

  // ===================== 5. NEWSPAPER & EDITORIAL (6) =====================
  {
    id: 'londoner',
    name: 'Ye Ole Londoner Broadsheet (1888)',
    category: 'newspaper_editorial',
    tag: 'Victorian Broadsheet',
    badge: 'Vintage',
    defaultBg: '#d8cfbc',
    cardBg: '#f4eee0',
    textColor: '#1c1917',
    theme: 'londoner',
    description: 'Koran broadsheet Inggris era Victoria 1888 dengan font Blackletter dan ornamen ukiran.',
    slots: 4,
    aspect: 'Koran 4-Kolom',
    customFields: {
      masthead: 'Ye Ole Londoner',
      headline: 'GOOD TIMES TODAY!',
      edition: 'PRICE $0.10 • VOL. I, NO. 1',
      motto: 'The pen is mightier than the sword'
    }
  },
  {
    id: 'editorial',
    name: 'Capture Story Today Newspaper',
    category: 'newspaper_editorial',
    tag: 'Modern Editorial',
    badge: 'Popular',
    defaultBg: '#1c1917',
    cardBg: '#f9f8f5',
    textColor: '#171717',
    theme: 'editorial',
    description: 'Koran editorial minimalis bergaya Kinfolk dengan headline bold dan tipografi modern.',
    slots: 4,
    aspect: 'Editorial Strip',
    customFields: {
      headlineLead: 'Capture your',
      headlineMain: 'STORY TODAY',
      volume: 'VOL. 01 • ISSUE 04',
      date: 'OCTOBER 12, 2026'
    }
  },
  {
    id: 'vogue_chic',
    name: 'High Fashion Magazine Cover',
    category: 'newspaper_editorial',
    tag: 'Vogue Editorial',
    badge: 'Fashion',
    defaultBg: '#000000',
    cardBg: '#ffffff',
    textColor: '#000000',
    theme: 'vogue_chic',
    description: 'Cover majalah fashion dunia dengan tipografi Didot bold elegan dan barcode majalah.',
    slots: 4,
    aspect: 'Magazine Strip',
    customFields: {
      magazineName: 'ELEGANCE.',
      subline: 'THE AUTUMN ISSUE',
      story1: 'LOVE & FRIENDSHIP 2026',
      story2: 'BEST MOMENTS BEHIND SCENES'
    }
  },
  {
    id: 'morning_post',
    name: 'The Sunday Morning Post',
    category: 'newspaper_editorial',
    tag: 'Sunday Newspaper',
    badge: 'Classic',
    defaultBg: '#e7e5e4',
    cardBg: '#fafaf9',
    textColor: '#1c1917',
    theme: 'morning_post',
    description: 'Edisi santai koran Minggu pagi dengan rubrik gaya hidup dan ramalan cuaca cerah.',
    slots: 4,
    aspect: 'Sunday Post',
    customFields: {
      paperName: 'THE SUNDAY MORNING POST',
      headline: 'A PERFECT DAY TO SMILE',
      weather: 'SUNNY • 24°C • BEAUTIFUL DAY'
    }
  },
  {
    id: 'paris_gazette',
    name: 'Le Petit Parisien Gazette',
    category: 'newspaper_editorial',
    tag: 'French Vintage',
    badge: 'Romantic',
    defaultBg: '#c2b59b',
    cardBg: '#f5edd6',
    textColor: '#292524',
    theme: 'paris_gazette',
    description: 'Koran gazette antik Prancis dengan teks puisi cinta dan ilustrasi Menara Eiffel.',
    slots: 4,
    aspect: 'French Gazette',
    customFields: {
      masthead: 'LE PETIT PARISIEN',
      headline: 'L’AMOUR TOUJOURS',
      city: 'PARIS, ÉDITION SPÉCIALE'
    }
  },
  {
    id: 'record_times',
    name: 'Billboard Record Weekly Times',
    category: 'newspaper_editorial',
    tag: 'Music Weekly',
    badge: 'Music Indie',
    defaultBg: '#292524',
    cardBg: '#f5f5f4',
    textColor: '#0c0a09',
    theme: 'record_times',
    description: 'Tabloid mingguan musik chart tangga lagu dengan peringkat lagu nomor 1.',
    slots: 4,
    aspect: 'Music Tabloid',
    customFields: {
      paperName: 'THE RECORD TIMES',
      chart: 'TOP #1 HIT RECORD',
      review: 'UNSTOPPABLE MEMORIES'
    }
  },

  // ===================== 6. POSTAL & POLAROID (6) =====================
  {
    id: 'airmail_meenie',
    name: 'Air Mail Postcard Piku Box',
    category: 'postal_scrapbook',
    tag: 'Air Mail Postcard',
    badge: 'Featured',
    defaultBg: '#1e3a8a',
    cardBg: '#f8f5ee',
    textColor: '#1e3a8a',
    theme: 'airmail',
    description: 'Kartu pos pengiriman pos udara dengan motif garis miring hazard merah-biru dan cap APPROVED.',
    slots: 4,
    aspect: 'Kartu Pos',
    customFields: {
      recipient: 'My Beloved One',
      brand: 'PIKU BOX!',
      stampText: 'APPROVED',
      postmark: 'AIRMAIL POSTAGE PAID'
    }
  },
  {
    id: 'polaroid_mosaic',
    name: '9-Cut Polaroid Mosaic on Wood Desk',
    category: 'postal_scrapbook',
    tag: 'Polaroid 9-Grid',
    badge: 'Pinterest Hit',
    defaultBg: '#78350f',
    cardBg: '#ffffff',
    textColor: '#292524',
    theme: 'polaroid_mosaic',
    description: 'Mosaik polaroid klasik 9-cut di atas meja kayu hangat dengan frame putih polaroid asli.',
    slots: 4,
    aspect: 'Polaroid Grid',
    customFields: {
      caption: 'moments frozen in time',
      date: 'OCT 2026'
    }
  },
  {
    id: 'fuji_instax',
    name: 'Fuji Instax Mini Frame',
    category: 'postal_scrapbook',
    tag: 'Instant Polaroid',
    badge: 'Polaroid',
    defaultBg: '#d6d3d1',
    cardBg: '#ffffff',
    textColor: '#292524',
    theme: 'instax',
    description: 'Bingkai polaroid instax putih klasik dengan ruang tulisan spidol di bagian bawah.',
    slots: 4,
    aspect: 'Instax Grid',
    customFields: {
      caption: 'our unforgettable day ♡',
      date: '12 / 10 / 2026',
      cameraTag: 'INSTAX MINI'
    }
  },
  {
    id: 'cafe_receipt',
    name: 'Cafe & Bakery Thermal Receipt',
    category: 'postal_scrapbook',
    tag: 'Thermal Receipt',
    badge: 'Cozy Cafe',
    defaultBg: '#e7e5e4',
    cardBg: '#fefefe',
    textColor: '#18181b',
    theme: 'cafe_receipt',
    description: 'Struk kasir kafe termal dengan font dot-matrix struk, daftar pesanan kopi, dan barcode.',
    slots: 4,
    aspect: 'Struk Kafe',
    customFields: {
      cafeName: 'PHOTO CAFE & BAKERY',
      orderNo: 'ORDER #1024',
      item1: 'Sweet Memories ............ $0.00',
      item2: 'Endless Laughter .......... $0.00',
      footer: 'THANK YOU! HAVE A NICE DAY :)'
    }
  },
  {
    id: 'love_letter',
    name: 'Vintage Love Letter & Wax Stamp',
    category: 'postal_scrapbook',
    tag: 'Wax Sealed',
    badge: 'Romantic',
    defaultBg: '#831843',
    cardBg: '#fff1f2',
    textColor: '#9d174d',
    theme: 'love_letter',
    description: 'Surat cinta berlipat amplop antik dengan cap lilin merah hati dan teks puitis.',
    slots: 4,
    aspect: 'Letter Strip',
    customFields: {
      to: 'To My Favorite Person,',
      waxText: 'WITH LOVE',
      sign: 'Forever Yours ♡'
    }
  },
  {
    id: 'scrapbook_kraft',
    name: 'Kraft Scrapbook & Washi Tape',
    category: 'postal_scrapbook',
    tag: 'DIY Scrapbook',
    badge: 'Handmade',
    defaultBg: '#78350f',
    cardBg: '#fef3c7',
    textColor: '#451a03',
    theme: 'scrapbook_kraft',
    description: 'Kertas kraft cokelat bertekstur dengan selotip washi tape bunga pastel dan stiker scrapbook.',
    slots: 4,
    aspect: 'Kraft Strip',
    customFields: {
      albumTitle: 'OUR SCRAPBOOK MEMORIES',
      tapeNote: '////// BEST FRIENDS FOREVER //////',
      year: 'OCTOBER 2026'
    }
  }
];
