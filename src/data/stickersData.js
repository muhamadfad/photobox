// Photobooth Stickers & Decorative Stamps

export const STICKER_CATEGORIES = [
  { id: 'all', name: 'Semua Stiker', icon: 'Smile' },
  { id: 'korean_cute', name: 'Korean Studio', icon: 'Sparkles' },
  { id: 'retro_90s', name: 'Retro & Pop', icon: 'Film' },
  { id: 'love_sparkle', name: 'Cinta & Kilau', icon: 'Heart' },
  { id: 'vintage_stamp', name: 'Cap Vintage', icon: 'Tag' },
  { id: 'washi_tape', name: 'Washi Tape', icon: 'Bookmark' },
  { id: 'text_badge', name: 'Teks Estetik', icon: 'Type' }
];

export const STICKERS_LIST = [
  // Korean Cute
  { id: 's_bow', name: 'Pita Pink', emoji: '🎀', category: 'korean_cute', size: 38 },
  { id: 's_blossom', name: 'Sakura', emoji: '🌸', category: 'korean_cute', size: 36 },
  { id: 's_bunny', name: 'Kelinci Lucu', emoji: '🐰', category: 'korean_cute', size: 40 },
  { id: 's_paw', name: 'Cakar Kucing', emoji: '🐾', category: 'korean_cute', size: 36 },
  { id: 's_bear', name: 'Teddy Bear', emoji: '🧸', category: 'korean_cute', size: 40 },
  { id: 's_cherries', name: 'Ceri Manis', emoji: '🍒', category: 'korean_cute', size: 38 },
  { id: 's_sparkles', name: 'Kilau Estetik', emoji: '✨', category: 'korean_cute', size: 36 },
  { id: 's_party', name: 'Topi Pesta', emoji: '🥳', category: 'korean_cute', size: 38 },

  // Retro 90s & Pop (Reference Styles)
  { id: 's_mush', name: 'Jamur Mario', emoji: '🍄', category: 'retro_90s', size: 38 },
  { id: 's_8ball', name: 'Bola 8 Biliar', emoji: '🎱', category: 'retro_90s', size: 38 },
  { id: 's_clapper', name: 'Clapper Film', emoji: '🎬', category: 'retro_90s', size: 38 },
  { id: 's_palette', name: 'Palet Cat', emoji: '🎨', category: 'retro_90s', size: 38 },
  { id: 's_sneaker', name: 'Sepatu Converse', emoji: '👟', category: 'retro_90s', size: 40 },
  { id: 's_vinyl', name: 'Piringan Vinyl', emoji: '💿', category: 'retro_90s', size: 40 },
  { id: 's_swirl', name: 'Spiral Swirl', emoji: '🌀', category: 'retro_90s', size: 36 },
  { id: 's_leica', name: 'Kamera Vintage', emoji: '📷', category: 'retro_90s', size: 38 },
  { id: 's_boom', name: 'Tiket Boom Chute', text: 'BOOM CHUTE 5¢', isBadge: true, bg: '#facc15', color: '#1c1917', category: 'retro_90s', size: 85 },
  { id: 's_70s', name: 'Badge 70s Retro', text: '70s RETRO', isBadge: true, bg: '#dc2626', color: '#ffffff', category: 'retro_90s', size: 75 },

  // Love & Sparkle
  { id: 's_heart_pink', name: 'Hati Pink', emoji: '💖', category: 'love_sparkle', size: 42 },
  { id: 's_heart_red', name: 'Hati Merah', emoji: '❤️', category: 'love_sparkle', size: 40 },
  { id: 's_kiss', name: 'Kecupan Bibir', emoji: '💋', category: 'love_sparkle', size: 38 },
  { id: 's_cupid', name: 'Panah Asmara', emoji: '💘', category: 'love_sparkle', size: 42 },
  { id: 's_star', name: 'Bintang Emas', emoji: '⭐', category: 'love_sparkle', size: 38 },
  { id: 's_crown', name: 'Mahkota', emoji: '👑', category: 'love_sparkle', size: 40 },
  { id: 's_fire', name: 'Api Menyala', emoji: '🔥', category: 'love_sparkle', size: 38 },

  // Vintage Stamp
  { id: 's_approved', name: 'Cap APPROVED', text: 'APPROVED', isBadge: true, bg: '#b91c1c', color: '#ffffff', category: 'vintage_stamp', size: 70 },
  { id: 's_airmail', name: 'Cap AIR MAIL', text: 'PAR AVION ★', isBadge: true, bg: '#1e3a8a', color: '#ffffff', category: 'vintage_stamp', size: 75 },
  { id: 's_camera', name: 'Kamera Retro', emoji: '📷', category: 'vintage_stamp', size: 36 },
  { id: 's_parcel', name: 'Paket Vintage', emoji: '📦', category: 'vintage_stamp', size: 38 },
  { id: 's_film', name: 'Rol Film 35mm', emoji: '🎞️', category: 'vintage_stamp', size: 40 },
  { id: 's_coffee', name: 'Kopi Hangat', emoji: '☕', category: 'vintage_stamp', size: 36 },

  // Washi Tapes
  { id: 's_tape_kraft', name: 'Lakban Cokelat', isTape: true, bg: '#d4a373', text: '///////// MEMORIES /////////', category: 'washi_tape', size: 100 },
  { id: 's_tape_pink', name: 'Washi Pastel Pink', isTape: true, bg: '#f472b6', text: '♥ ♥ BESTIES FOREVER ♥ ♥', category: 'washi_tape', size: 100 },
  { id: 's_tape_caution', name: 'Washi Garis Hitam', isTape: true, bg: '#facc15', text: '★ PHOTOBOOTH SPECIAL ★', category: 'washi_tape', size: 105 },

  // Text Badges
  { id: 's_txt_cutie', name: 'Badge CUTIE', text: 'CUTIE ♡', isBadge: true, bg: '#ec4899', color: '#ffffff', category: 'text_badge', size: 65 },
  { id: 's_txt_xoxo', name: 'Badge XOXO', text: 'XOXO', isBadge: true, bg: '#e11d48', color: '#ffffff', category: 'text_badge', size: 55 },
  { id: 's_txt_besties', name: 'Badge BESTIES', text: 'BEST FRIENDS 👯‍♀️', isBadge: true, bg: '#8b5cf6', color: '#ffffff', category: 'text_badge', size: 90 },
  { id: 's_txt_forever', name: 'Badge FOREVER', text: 'TOGETHER FOREVER', isBadge: true, bg: '#059669', color: '#ffffff', category: 'text_badge', size: 95 },
  { id: 's_txt_vip', name: 'Badge VIP GUEST', text: '★ VIP GUEST ★', isBadge: true, bg: '#d97706', color: '#ffffff', category: 'text_badge', size: 75 },
];
