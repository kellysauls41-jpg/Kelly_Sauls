
export interface Wallpaper {
  id: string;
  url: string;
  prompt: string;
  author: string;
  aspectRatio: string;
  createdAt: number;
}

export type View = 'gallery' | 'generate' | 'my-walls';

export interface GenerationParams {
  prompt: string;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  style?: string;
}
