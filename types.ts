export interface ImageState {
  file: File | null;
  previewUrl: string | null;
  base64Data: string | null; // Raw base64 without prefix
  mimeType: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface GeneratedImage {
  url: string;
  originalPrompt: string;
}