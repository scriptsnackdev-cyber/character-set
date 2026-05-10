export interface SBTIType {
  id: string;
  nameEn: string;
  nameTh: string;
  description: string;
  color: string;
  outfit: string;
  pose: string;
  trait: string;
}

export const SBTI_TYPES: SBTIType[] = [
  {
    id: 'CTRL',
    nameEn: 'Controller',
    nameTh: 'สายบงการ',
    description: 'Everything must be under control and perfectly organized.',
    color: '#3b82f6',
    outfit: 'wearing a sharp professional suit with a clipboard and a sleek digital watch.',
    pose: 'pointing forward with a serious but cute expression, like a manager.',
    trait: 'organized, perfectionist, blue tech aura'
  },
  {
    id: 'ATM',
    nameEn: 'The Walking ATM',
    nameTh: 'ตู้ ATM เคลื่อนที่',
    description: 'Generous to a fault, always ready to pay for everything.',
    color: '#10b981',
    outfit: 'wearing luxury designer clothes with gold chains and carrying a fancy wallet.',
    pose: 'happily handing out a golden credit card with a sparkling smile.',
    trait: 'generous, wealthy vibe, green money sparks'
  },
  {
    id: 'DIOR-S',
    nameEn: 'The Underdog',
    nameTh: 'สายสู้ชีวิต',
    description: 'Hustling hard despite the challenges, never giving up.',
    color: '#6366f1',
    outfit: 'wearing a trendy but practical outfit with a "Never Give Up" headband.',
    pose: 'wiping sweat from the forehead with a determined and cute smile.',
    trait: 'resilient, hardworking, indigo spirit'
  },
  {
    id: 'BOSS',
    nameEn: 'The Boss',
    nameTh: 'สายสั่งการ',
    description: 'Natural born leader who loves to take charge and give orders.',
    color: '#ef4444',
    outfit: 'wearing a majestic velvet cape over a stylish outfit and a small golden crown.',
    pose: 'standing tall with arms crossed confidently, looking like a little royalty.',
    trait: 'dominant, confident, red fire energy'
  },
  {
    id: 'THAN-K',
    nameEn: 'The Grateful',
    nameTh: 'สายขอบคุณ',
    description: 'Always appreciative and thankful for everything and everyone.',
    color: '#f472b6',
    outfit: 'wearing a soft pastel outfit with a "Thank You" badge and holding a heart.',
    pose: 'bowing slightly with hands together and a warm, loving smile.',
    trait: 'appreciative, kind, pink gratitude glow'
  },
  {
    id: 'OH-NO',
    nameEn: 'The Alarmist',
    nameTh: 'สายตื่นตูม',
    description: 'Constantly worried and over-reacting to small things.',
    color: '#fbbf24',
    outfit: 'wearing a yellow raincoat and carrying a survival kit, looking prepared for anything.',
    pose: 'holding both cheeks with wide eyes and a "surprised" expression.',
    trait: 'anxious, cautious, yellow alert aura'
  },
  {
    id: 'GOGO',
    nameEn: 'The Doer',
    nameTh: 'สายลุย',
    description: 'Fast-paced and proactive, always on the move to get things done.',
    color: '#2dd4bf',
    outfit: 'wearing sporty activewear with a smartwatch and a "Go" energy drink.',
    pose: 'in a running start position or giving a quick thumbs up while moving.',
    trait: 'proactive, energetic, teal speed lines'
  },
  {
    id: 'SEXY',
    nameEn: 'The Heartthrob',
    nameTh: 'สายเสน่ห์',
    description: 'Naturally charismatic and attractive, effortlessly drawing attention.',
    color: '#ec4899',
    outfit: 'wearing a stylish and slightly glamorous outfit with heart-shaped accessories.',
    pose: 'striking a confident model pose with a charming wink.',
    trait: 'charismatic, attractive, pink charm sparks'
  },
  {
    id: 'LOVE-R',
    nameEn: 'The Romantic',
    nameTh: 'สายคลั่งรัก',
    description: 'Always in love or searching for romance, sees the world in rose color.',
    color: '#f43f5e',
    outfit: 'wearing a romantic outfit with heart patterns and holding a bouquet of roses.',
    pose: 'making heart eyes and blowing a kiss with floating hearts around.',
    trait: 'romantic, affectionate, rose heart aura'
  },
  {
    id: 'MUM',
    nameEn: 'The Mom Friend',
    nameTh: 'สายแม่',
    description: 'Nurturing and protective, always taking care of the group.',
    color: '#fb923c',
    outfit: 'wearing a cozy cardigan and carrying a big bag full of "just in case" items.',
    pose: 'holding a band-aid or a snack with a caring and gentle expression.',
    trait: 'nurturing, protective, orange warmth'
  },
  {
    id: 'FAKE',
    nameEn: 'The Masker',
    nameTh: 'สายเฟค',
    description: 'Excellent at hiding true feelings behind a polite or happy mask.',
    color: '#94a3b8',
    outfit: 'wearing a neutral outfit and holding a literal "happy face" mask over their real expression.',
    pose: 'peeking out from behind a smiling mask with a mysterious look.',
    trait: 'elusive, polite, grey mist'
  },
  {
    id: 'OG8K',
    nameEn: 'The Whatever',
    nameTh: 'สายแล้วแต่',
    description: 'Extremely easy-going, has no preference and goes with the flow.',
    color: '#9ca3af',
    outfit: 'wearing a plain oversized t-shirt and slippers, looking very relaxed.',
    pose: 'shrugging with palms up and a "whatever" chill expression.',
    trait: 'easy-going, detached, grey chill clouds'
  },
  {
    id: 'MALO',
    nameEn: 'The Chaos',
    nameTh: 'สายป่วน',
    description: 'A bit chaotic, unpredictable, and always brings wild energy.',
    color: '#8b5cf6',
    outfit: 'wearing a wild mismatched outfit with monkey ears or chaotic accessories.',
    pose: 'jumping around or doing something unexpected with a mischievous grin.',
    trait: 'unpredictable, wild, purple chaotic energy'
  },
  {
    id: 'JOKE-R',
    nameEn: 'The Jester',
    nameTh: 'สายฮา',
    description: 'Always making people laugh, life of the party with a sense of humor.',
    color: '#f59e0b',
    outfit: 'wearing a colorful mismatched outfit with a small clown nose or funny hat.',
    pose: 'juggling or making a funny face with sparkling eyes.',
    trait: 'humorous, chaotic good, orange confetti'
  },
  {
    id: 'WOC!',
    nameEn: 'The WTF',
    nameTh: 'สายอิหยังวะ',
    description: 'Constantly confused or witnessing confusing situations.',
    color: '#f87171',
    outfit: 'wearing a t-shirt with a giant "?" and holding a confused-looking pet.',
    pose: 'scratching the head with a total "WTF" puzzled face.',
    trait: 'confused, baffled, red question marks'
  },
  {
    id: 'THIN-K',
    nameEn: 'The Overthinker',
    nameTh: 'สายคิดเยอะ',
    description: 'Analyzes everything to death, mind never stops working.',
    color: '#34d399',
    outfit: 'wearing glasses and a turtleneck, surrounded by floating thought bubbles.',
    pose: 'leaning on one hand with a deeply thoughtful and slightly stressed look.',
    trait: 'analytical, thoughtful, green brainwaves'
  },
  {
    id: 'SHIT',
    nameEn: 'The Cynic',
    nameTh: 'สายขวางโลก',
    description: 'Cynical and often unsatisfied with the current state of things.',
    color: '#4b5563',
    outfit: 'wearing a dark hoodie with a grumpy face print on it.',
    pose: 'looking away with a small pout and arms crossed, looking skeptical.',
    trait: 'cynical, skeptical, dark grey clouds'
  },
  {
    id: 'ZZZZ',
    nameEn: 'The Snoozer',
    nameTh: 'สายง่วงนอน',
    description: 'Can sleep anywhere, anytime. Bed is the best friend.',
    color: '#6366f1',
    outfit: 'wearing cute pajamas with a sleeping mask and holding a fluffy pillow.',
    pose: 'cuddling a pillow or drifting off to sleep with "Z" symbols around.',
    trait: 'sleepy, cozy, indigo dream clouds'
  },
  {
    id: 'POOR',
    nameEn: 'The Minimalist',
    nameTh: 'สายจน(ทิพย์)',
    description: 'Living a simple life, or at least pretending to be broke.',
    color: '#d1d5db',
    outfit: 'wearing a plain white t-shirt and holding an empty wallet with a cute cry face.',
    pose: 'pulling out empty pockets with a relatable "I\'m broke" look.',
    trait: 'minimalist, relatable, silver dust'
  },
  {
    id: 'MONK',
    nameEn: 'The Monk',
    nameTh: 'สายละทางโลก',
    description: 'Reached a state of pure peace, nothing can disturb their mind.',
    color: '#ea580c',
    outfit: 'wearing a simple orange/brown robe-style outfit with a peaceful wooden bead bracelet.',
    pose: 'sitting in a calm floating pose with eyes closed and a serene smile.',
    trait: 'peaceful, zen, golden aura'
  },
  {
    id: 'IMSB',
    nameEn: 'The Fool',
    nameTh: 'สายตลกบริโภค',
    description: 'Often roasts themselves and makes silly mistakes for fun.',
    color: '#fb923c',
    outfit: 'wearing a t-shirt that says "I\'m Silly" and a prop arrow through the head.',
    pose: 'tripping over air or doing something clumsy with a happy laugh.',
    trait: 'clumsy, self-deprecating, orange bubbles'
  },
  {
    id: 'SOLO',
    nameEn: 'The Lone Wolf',
    nameTh: 'สายโสด/สายลุยเดี่ยว',
    description: 'Strong and independent, prefers doing things alone.',
    color: '#1f2937',
    outfit: 'wearing a cool dark leather jacket and a single wolf-ear headband.',
    pose: 'standing in a cool, independent pose looking at the distance.',
    trait: 'independent, cool, dark moon energy'
  },
  {
    id: 'FU?K',
    nameEn: 'The Wild Card',
    nameTh: 'สายห้าว',
    description: 'Unpredictable and bold, doesn\'t care about the rules.',
    color: '#dc2626',
    outfit: 'wearing a punk-style outfit with spiked accessories and a "Wild" patch.',
    pose: 'showing a rock-on sign or a bold defiant look.',
    trait: 'bold, rebellious, red lightning'
  },
  {
    id: 'DEAD',
    nameEn: 'The Deadpan',
    nameTh: 'สายหมดไฟ/สายตายด้าน',
    description: 'Completely exhausted from life, energy level is zero.',
    color: '#6b7280',
    outfit: 'wearing a slightly messy oversized hoodie and dark circles under the eyes.',
    pose: 'slumping over or leaning against a wall with a tired but cute expression.',
    trait: 'exhausted, relatable, grey soul smoke'
  },
  {
    id: 'IMFW',
    nameEn: 'The Fragile',
    nameTh: 'สายใจเปราะบาง',
    description: 'Soft-hearted and easily hurt by the smallest things.',
    color: '#f9a8d4',
    outfit: 'wearing a soft fuzzy outfit and holding a glass heart carefully.',
    pose: 'looking worried and holding themselves as if they might break.',
    trait: 'fragile, sensitive, pink glass shards'
  },
  {
    id: 'HHHH',
    nameEn: 'The Happy Idiot',
    nameTh: 'สายขำกลิ้ง',
    description: 'Finds everything funny and laughs at almost anything.',
    color: '#fbbf24',
    outfit: 'wearing a bright yellow t-shirt with a giant smiley face and colorful accessories.',
    pose: 'doubled over in laughter with tears of joy and a wide open mouth.',
    trait: 'cheerful, infectious laughter, yellow sparkles'
  },
  {
    id: 'DRUNK',
    nameEn: 'The Drunkard',
    nameTh: 'สายเมา',
    description: 'Always the first one to get tipsy and have a good time.',
    color: '#ec4899',
    outfit: 'wearing a festive party outfit with a glow-stick necklace and a pink flush on cheeks.',
    pose: 'swaying slightly with a happy, dizzy smile and holding a cute cocktail glass.',
    trait: 'tipsy, joyful, pink bubble aura'
  },
  {
    id: 'MYSTERY',
    nameEn: 'The Mystery',
    nameTh: 'ปริศนา',
    description: 'Unknown and unpredictable, hidden in the shadows.',
    color: '#000000',
    outfit: 'rendered as a solid black silhouette, completely dark like a shadow.',
    pose: 'standing in a mysterious pose with glowing white eyes looking at the camera.',
    trait: 'mysterious, hidden, dark shadow energy with a subtle purple glow'
  }
];
