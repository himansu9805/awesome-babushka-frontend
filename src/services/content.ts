export interface NewPost {
  content: string;
}

export interface UserPlatform {
  application: string;
  os: string;
  device: string;
}

export interface Post {
  post_id: string;
  content: string;
  image_urls?: string[];
  author: string;
  user_platform: UserPlatform;
  created_at: string;
  updated_at: string;
}

export interface LinkPreview {
  url: string;
  title: string;
  description: string;
  favicon: string;
  isLoading: boolean;
  error: boolean;
}

export interface DetectedLink {
  url: string;
  startIndex: number;
  endIndex: number;
}
