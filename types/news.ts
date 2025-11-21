export type NewsCategory = 'All' | 'National' | 'International' | 'Sports' | 'Tech' | 'Entertainment' | 'Business' | 'Health';

export type ArticleStatus = 'published' | 'draft' | 'scheduled';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  category: NewsCategory;
  author: string;
  publishedAt: string;
  views: number;
  likes: number;
  tags: string[];
  source: string;
  status: ArticleStatus;
  readingTime: number;
  isBreaking: boolean;
  isFeatured: boolean;
}

export interface DraftArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  category: NewsCategory;
  author: string;
  tags: string[];
  source: string;
  lastSavedAt: string;
  scheduledFor?: string;
}

export interface Theme {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  primary: string;
  border: string;
  tabBar: string;
  success: string;
  error: string;
  warning: string;
}

export interface UserPreferences {
  preferredCategories: NewsCategory[];
  notifications: boolean;
  fontSize: 'small' | 'medium' | 'large';
  autoPlayVideos: boolean;
}