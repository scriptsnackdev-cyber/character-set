/* ────────────────────────────────────────────────────
   Tarot Card Data & Helpers
   ──────────────────────────────────────────────────── */

export const MAJOR_ARCANA = [
  "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
  "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
  "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
  "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
  "Judgement", "The World"
];

export const CARD_BACK = "Card Back";
export const SPECIAL_CARDS = [CARD_BACK];

export const MINOR_ARCANA_SUITS = ["Wands", "Cups", "Swords", "Pentacles"];

export const MINOR_ARCANA_RANKS = [
  "Ace", "Two", "Three", "Four", "Five", "Six", "Seven",
  "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"
];

export const TAROT_CARDS = [
  ...MAJOR_ARCANA,
  ...MINOR_ARCANA_SUITS.flatMap(suit =>
    MINOR_ARCANA_RANKS.map(rank => `${rank} of ${suit}`)
  )
];

export const CARD_SYMBOLS: Record<string, string> = {
  "The Fool": "☽", "The Magician": "✦", "The High Priestess": "◈",
  "The Empress": "✾", "The Emperor": "◆", "The Hierophant": "⊕",
  "The Lovers": "♡", "The Chariot": "⟡", "Strength": "◉",
  "The Hermit": "⊙", "Wheel of Fortune": "⊛", "Justice": "⚖",
  "The Hanged Man": "∞", "Death": "✕", "Temperance": "⋈",
  "The Devil": "◬", "The Tower": "△", "The Star": "★",
  "The Moon": "☾", "The Sun": "☀", "Judgement": "♩", "The World": "◎",
  "Wands": "🪄", "Cups": "🍷", "Swords": "⚔", "Pentacles": "🪙",
  "Card Back": "🎴"
};

export const ROMAN = [
  "0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII",
  "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI",
  "XVII", "XVIII", "XIX", "XX", "XXI"
];

export function getCardSymbol(card: string): string {
  if (CARD_SYMBOLS[card]) return CARD_SYMBOLS[card];
  if (card.includes("Wands")) return "🪄";
  if (card.includes("Cups")) return "🍷";
  if (card.includes("Swords")) return "⚔";
  if (card.includes("Pentacles")) return "🪙";
  return "✦";
}

export type CardResult = {
  url?: string;
  loading?: boolean;
  error?: string;
};
