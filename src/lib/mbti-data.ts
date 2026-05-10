export interface MBTIData {
  type: string;
  name: string;
  traits: string[];
  color: string;
  house: 'Analysts' | 'Diplomats' | 'Sentinels' | 'Explorers';
  description: string;
}

export const MBTI_TYPES: MBTIData[] = [
  // Analysts (Purple)
  {
    type: 'INTJ',
    name: 'Architect',
    traits: ['Strategic', 'Logical', 'Private', 'Independent'],
    color: '#a258ff',
    house: 'Analysts',
    description: 'Imaginative and strategic thinkers, with a plan for everything.'
  },
  {
    type: 'INTP',
    name: 'Logician',
    traits: ['Analytical', 'Original', 'Open-minded', 'Objective'],
    color: '#a258ff',
    house: 'Analysts',
    description: 'Innovative inventors with an unquenchable thirst for knowledge.'
  },
  {
    type: 'ENTJ',
    name: 'Commander',
    traits: ['Ambitious', 'Decisive', 'Strong-willed', 'Efficient'],
    color: '#a258ff',
    house: 'Analysts',
    description: 'Bold, imaginative and strong-willed leaders, always finding a way.'
  },
  {
    type: 'ENTP',
    name: 'Debater',
    traits: ['Curious', 'Quick-witted', 'Knowledgeable', 'Dynamic'],
    color: '#a258ff',
    house: 'Analysts',
    description: 'Smart and curious thinkers who cannot resist an intellectual challenge.'
  },
  
  // Diplomats (Green)
  {
    type: 'INFJ',
    name: 'Advocate',
    traits: ['Idealistic', 'Mystical', 'Quiet', 'Inspiring'],
    color: '#00bb88',
    house: 'Diplomats',
    description: 'Quiet and mystical, yet very inspiring and tireless idealists.'
  },
  {
    type: 'INFP',
    name: 'Mediator',
    traits: ['Poetic', 'Kind', 'Altruistic', 'Idealistic'],
    color: '#00bb88',
    house: 'Diplomats',
    description: 'Poetic, kind and altruistic people, always eager to help a good cause.'
  },
  {
    type: 'ENFJ',
    name: 'Protagonist',
    traits: ['Charismatic', 'Inspiring', 'Persuasive', 'Empathetic'],
    color: '#00bb88',
    house: 'Diplomats',
    description: 'Charismatic and inspiring leaders, able to mesmerize their listeners.'
  },
  {
    type: 'ENFP',
    name: 'Campaigner',
    traits: ['Enthusiastic', 'Creative', 'Sociable', 'Free-spirited'],
    color: '#00bb88',
    house: 'Diplomats',
    description: 'Enthusiastic, creative and sociable free spirits, who can always find a reason to smile.'
  },

  // Sentinels (Blue)
  {
    type: 'ISTJ',
    name: 'Logistician',
    traits: ['Practical', 'Fact-minded', 'Reliable', 'Organized'],
    color: '#00aaff',
    house: 'Sentinels',
    description: 'Practical and fact-minded individuals, whose reliability cannot be doubted.'
  },
  {
    type: 'ISFJ',
    name: 'Defender',
    traits: ['Dedicated', 'Warm', 'Protective', 'Loyal'],
    color: '#00aaff',
    house: 'Sentinels',
    description: 'Very dedicated and warm protectors, always ready to defend their loved ones.'
  },
  {
    type: 'ESTJ',
    name: 'Executive',
    traits: ['Orderly', 'Traditional', 'Decisive', 'Management'],
    color: '#00aaff',
    house: 'Sentinels',
    description: 'Excellent administrators, unsurpassed at managing things – or people.'
  },
  {
    type: 'ESFJ',
    name: 'Consul',
    traits: ['Social', 'Caring', 'Popular', 'Supportive'],
    color: '#00aaff',
    house: 'Sentinels',
    description: 'Extraordinarily caring, social and popular people, always eager to help.'
  },

  // Explorers (Yellow)
  {
    type: 'ISTP',
    name: 'Virtuoso',
    traits: ['Bold', 'Practical', 'Mastery', 'Experimental'],
    color: '#ffcc00',
    house: 'Explorers',
    description: 'Bold and practical experimenters, masters of all kinds of tools.'
  },
  {
    type: 'ISFP',
    name: 'Adventurer',
    traits: ['Flexible', 'Charming', 'Artistic', 'Experimental'],
    color: '#ffcc00',
    house: 'Explorers',
    description: 'Flexible and charming artists, always ready to explore and experience something new.'
  },
  {
    type: 'ESTP',
    name: 'Entrepreneur',
    traits: ['Energetic', 'Perceptive', 'Action-oriented', 'Social'],
    color: '#ffcc00',
    house: 'Explorers',
    description: 'Smart, energetic and very perceptive people, who truly enjoy living on the edge.'
  },
  {
    type: 'ESFP',
    name: 'Entertainer',
    traits: ['Spontaneous', 'Energetic', 'Enthusiastic', 'Playful'],
    color: '#ffcc00',
    house: 'Explorers',
    description: 'Spontaneous, energetic and enthusiastic people – life is never boring around them.'
  }
];
