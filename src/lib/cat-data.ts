export interface CatBreed {
  id: string;
  nameEn: string;
  nameTh: string;
  description: string;
  traits: string[];
  color: string;
}

export const CAT_BREEDS: CatBreed[] = [
  {
    id: 'siamese',
    nameEn: 'Siamese',
    nameTh: 'วิเชียรมาศ',
    description: 'Elegant and talkative with striking blue eyes and point coloration.',
    traits: ['blue eyes', 'point coloration', 'slender'],
    color: '#3d2b1f'
  },
  {
    id: 'persian',
    nameEn: 'Persian',
    nameTh: 'เปอร์เซีย',
    description: 'Glamorous and calm with long, luxurious fur and a sweet face.',
    traits: ['long fur', 'flat face', 'round eyes'],
    color: '#fdf5e6'
  },
  {
    id: 'maine-coon',
    nameEn: 'Maine Coon',
    nameTh: 'เมนคูน',
    description: 'The gentle giant with tufted ears and a magnificent bushy tail.',
    traits: ['large size', 'tufted ears', 'bushy tail'],
    color: '#8b4513'
  },
  {
    id: 'scottish-fold',
    nameEn: 'Scottish Fold',
    nameTh: 'สก็อตติช โฟลด์',
    description: 'Famous for its unique folded ears and big, round "owl-like" eyes.',
    traits: ['folded ears', 'round face', 'big eyes'],
    color: '#c0c0c0'
  },
  {
    id: 'british-shorthair',
    nameEn: 'British Shorthair',
    nameTh: 'บริติช ชอร์ตแฮร์',
    description: 'A plush, rounded cat with a calm temperament and a dense coat.',
    traits: ['dense coat', 'round cheeks', 'copper eyes'],
    color: '#4682b4'
  },
  {
    id: 'ragdoll',
    nameEn: 'Ragdoll',
    nameTh: 'แร็กดอลล์',
    description: 'Sweet-natured with blue eyes and a tendency to go limp when held.',
    traits: ['blue eyes', 'silky fur', 'white paws'],
    color: '#e6e6fa'
  },
  {
    id: 'bengal',
    nameEn: 'Bengal',
    nameTh: 'เบงกอล',
    description: 'Active and wild-looking with a stunning spotted or marbled coat.',
    traits: ['leopard spots', 'athletic', 'wild look'],
    color: '#daa520'
  },
  {
    id: 'russian-blue',
    nameEn: 'Russian Blue',
    nameTh: 'รัสเซียน บลู',
    description: 'Quiet and reserved with a shimmering silver-blue coat and green eyes.',
    traits: ['silver-blue fur', 'green eyes', 'elegant'],
    color: '#708090'
  },
  {
    id: 'munchkin',
    nameEn: 'Munchkin',
    nameTh: 'มั๊นช์กิ้น',
    description: 'Short-legged and playful, full of energy and curiosity.',
    traits: ['short legs', 'playful', 'big eyes'],
    color: '#ffa07a'
  },
  {
    id: 'abyssinian',
    nameEn: 'Abyssinian',
    nameTh: 'อะบิสซิเนียน',
    description: 'Intelligent and athletic with a ticked coat like a wild rabbit.',
    traits: ['ticked coat', 'large ears', 'almond eyes'],
    color: '#cd853f'
  },
  {
    id: 'sphynx',
    nameEn: 'Sphynx',
    nameTh: 'สฟิงซ์',
    description: 'Hairless and affectionate with big ears and a wrinkled, unique look.',
    traits: ['hairless', 'wrinkled skin', 'big ears'],
    color: '#ffdab9'
  },
  {
    id: 'bombay',
    nameEn: 'Bombay',
    nameTh: 'บอมเบย์ (แมวดำ)',
    description: 'A sleek, jet-black cat with striking copper or golden eyes, often called a "miniature panther".',
    traits: ['jet black fur', 'golden eyes', 'sleek coat'],
    color: '#1a1a1a'
  }
];
