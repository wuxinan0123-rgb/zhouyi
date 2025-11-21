export interface HexagramData {
  id: number;
  name: string;
  pinyin: string;
  english: string;
  symbol: number[]; // Array of 6 numbers (0 for Yin/Broken, 1 for Yang/Solid), bottom to top
  nature?: string; // e.g., "Heaven over Earth"
  luck: string; // e.g., "上上", "中上", "中平", "中下", "下下"
}

export interface Interpretation {
  general: string;
  judgment: string;
  image: string;
  advice: string;
}