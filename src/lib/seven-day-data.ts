export interface DayConfig {
  id: string;
  nameEn: string;
  nameTh: string;
  colorName: string;
  hexColor: string;
  pose: string;
  trait: string;
}

export const SEVEN_DAYS: DayConfig[] = [
  {
    id: 'sunday',
    nameEn: 'Sunday',
    nameTh: 'วันอาทิตย์',
    colorName: 'Red',
    hexColor: '#FF0000',
    pose: 'vibrant and energetic, making a large hand-heart above the head with a big wink',
    trait: 'radiant sun energy, sparkling red theme'
  },
  {
    id: 'monday',
    nameEn: 'Monday',
    nameTh: 'วันจันทร์',
    colorName: 'Yellow',
    hexColor: '#FFFF00',
    pose: 'soft and cozy, holding a tiny moon plushie or making "cat paw" hands near the face',
    trait: 'gentle moon glow, soft yellow vibes'
  },
  {
    id: 'tuesday',
    nameEn: 'Tuesday',
    nameTh: 'วันอังคาร',
    colorName: 'Pink',
    hexColor: '#FFC0CB',
    pose: 'playful and sassy, doing a trendy "peace sign" next to the eye with a cheeky tongue out',
    trait: 'energetic pink sparks, cute and bold'
  },
  {
    id: 'wednesday',
    nameEn: 'Wednesday',
    nameTh: 'วันพุธ',
    colorName: 'Green',
    hexColor: '#008000',
    pose: 'smart and trendy, holding a boba tea or a cute gadget with a curious tilted head',
    trait: 'refreshing forest vibe, modern clover green'
  },
  {
    id: 'thursday',
    nameEn: 'Thursday',
    nameTh: 'วันพฤหัสบดี',
    colorName: 'Orange',
    hexColor: '#FFA500',
    pose: 'cool and successful, sitting on a floating star or making a "number one" sign with a confident smile',
    trait: 'golden wisdom, bright orange success'
  },
  {
    id: 'friday',
    nameEn: 'Friday',
    nameTh: 'วันศุกร์',
    colorName: 'Blue',
    hexColor: '#00BFFF',
    pose: 'happy and rhythmic, in a cute dancing pose like a TikTok trend with musical notes around',
    trait: 'clear sky harmony, joyful blue energy'
  },
  {
    id: 'saturday',
    nameEn: 'Saturday',
    nameTh: 'วันเสาร์',
    colorName: 'Purple',
    hexColor: '#800080',
    pose: 'chill and stylish, wearing cute oversized sunglasses or leaning in a cool "idol" pose',
    trait: 'mystical purple aura, trendy and mysterious'
  }
];

export interface OutfitConfig {
  id: string;
  nameEn: string;
  nameTh: string;
  description: string;
  promptSnippet: string;
}

export const OUTFITS: OutfitConfig[] = [
  {
    id: 'cat_suit',
    nameEn: 'Cat Suit',
    nameTh: 'ชุดแมวเหมียว',
    description: 'Cozy cat onesie or hoodie with ears and tail.',
    promptSnippet: 'wearing a full cat-themed outfit (onesie or hoodie with cat ears, tail, and paws).'
  },
  {
    id: 'magical_celestial',
    nameEn: 'Magical Celestial',
    nameTh: 'จอมเวทย์ดวงดาว',
    description: 'Translucent robes with floating star particles.',
    promptSnippet: 'wearing magical translucent celestial robes with floating star particles and a small magical staff.'
  },
  {
    id: 'cyber_streetwear',
    nameEn: 'Cyber Streetwear',
    nameTh: 'สตรีทแวร์ล้ำยุค',
    description: 'Oversized hoodie with glowing neon straps.',
    promptSnippet: 'wearing modern oversized cyber-streetwear with glowing neon straps and futuristic sneakers.'
  },
  {
    id: 'royal_guardian',
    nameEn: 'Royal Guardian',
    nameTh: 'อัศวินผู้พิทักษ์',
    description: 'Cute light armor with a flowing cape.',
    promptSnippet: 'wearing cute royal light armor with polished metallic surfaces and a short flowing cape.'
  },
  {
    id: 'oriental_bloom',
    nameEn: 'Oriental Bloom',
    nameTh: 'กิโมโนประยุกต์',
    description: 'Modern traditional dress with floral patterns.',
    promptSnippet: 'wearing a modern stylized oriental dress (like a mini-kimono or hanbok) with vibrant floral patterns.'
  }
];

export interface StyleConfig {
  id: string;
  nameEn: string;
  nameTh: string;
  promptSnippet: string;
}

export const STYLES: StyleConfig[] = [
  {
    id: 'kawaii_digital',
    nameEn: 'Kawaii Digital',
    nameTh: 'ดิจิทัลน่ารัก',
    promptSnippet: 'Modern kawaii digital art style, soft gradients, clean lineart, sparkling elements.'
  },
  {
    id: '3d_isometric',
    nameEn: '3D Isometric',
    nameTh: '3D สามมิติ',
    promptSnippet: 'High-quality 3D render style, isometric view, soft clay-like textures, Octane render, cute proportions.'
  },
  {
    id: 'watercolor_anime',
    nameEn: 'Watercolor Anime',
    nameTh: 'สีน้ำอนิเมะ',
    promptSnippet: 'Beautiful watercolor anime style, soft bleeding edges, paper texture, delicate hand-painted look.'
  },
  {
    id: 'retro_90s',
    nameEn: '90s Retro',
    nameTh: 'อนิเมะ 90s',
    promptSnippet: '90s retro anime style, cel-shaded, slightly grainy film texture, vibrant nostalgic colors.'
  }
];
