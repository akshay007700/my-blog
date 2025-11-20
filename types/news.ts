export type NewsCategory = 'All' | 'National' | 'International' | 'Sports' | 'Tech' | 'Entertainment' | 'Business' | 'Health';

export type ArticleStatus = 'published' | 'draft';

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
  tags: string[];
  source: string;
  status?: ArticleStatus;
  lastSavedAt?: string;
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
}

export interface Theme {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  primary: string;
  border: string;
  tabBar: string;
  tabBarActive: string;
}
