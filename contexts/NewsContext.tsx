import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NewsArticle, NewsCategory, DraftArticle, UserPreferences } from '@/types/news';

interface NewsContextType {
  allNews: NewsArticle[];
  bookmarkedIds: string[];
  likedIds: string[];
  drafts: DraftArticle[];
  userPreferences: UserPreferences;
  isLoading: boolean;
  toggleBookmark: (articleId: string) => void;
  toggleLike: (articleId: string) => void;
  incrementViews: (articleId: string) => void;
  isBookmarked: (articleId: string) => boolean;
  isLiked: (articleId: string) => boolean;
  getBookmarkedArticles: () => NewsArticle[];
  getLikedArticles: () => NewsArticle[];
  getBreakingNews: () => NewsArticle[];
  getFeaturedArticles: () => NewsArticle[];
  filterByCategory: (category: NewsCategory) => NewsArticle[];
  searchArticles: (query: string) => NewsArticle[];
  getTrendingArticles: () => NewsArticle[];
  getArticleById: (id: string) => NewsArticle | undefined;
  getRecommendedArticles: (currentArticleId?: string) => NewsArticle[];
  addArticle: (article: Omit<NewsArticle, 'id' | 'views' | 'likes' | 'publishedAt' | 'readingTime'>, draftId?: string) => Promise<NewsArticle>;
  updateArticle: (id: string, updates: Partial<NewsArticle>) => Promise<boolean>;
  deleteArticle: (id: string) => Promise<boolean>;
  saveDraft: (draftId: string, draftData: Partial<DraftArticle>) => Promise<void>;
  getDraft: (draftId: string) => DraftArticle | undefined;
  deleteDraft: (draftId: string) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

const mockNews: NewsArticle[] = [
  {
    id: '1',
    title: '🚨 Breaking: Major Scientific Discovery Changes Everything We Know About Space',
    description: 'Astronomers detect unprecedented cosmic phenomenon that challenges existing physics theories',
    content: 'In a groundbreaking discovery that has sent shockwaves through the scientific community, researchers using the James Webb Space Telescope have observed a cosmic phenomenon that fundamentally challenges our understanding of physics.',
    imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800',
    category: 'Tech',
    author: 'Dr. Elena Rodriguez',
    publishedAt: new Date().toISOString(),
    views: 25420,
    likes: 1845,
    tags: ['Space', 'Science', 'Discovery'],
    source: 'Science Daily',
    status: 'published',
    readingTime: 4,
    isBreaking: true,
    isFeatured: true
  },
  {
    id: '2',
    title: 'AI Revolution: New Model Achieves Human-Level Reasoning',
    description: 'Breakthrough artificial intelligence system demonstrates unprecedented problem-solving capabilities',
    content: 'Researchers at DeepMind have developed an AI system that demonstrates human-level reasoning across multiple domains.',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    category: 'Tech',
    author: 'Sarah Johnson',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    views: 18700,
    likes: 1250,
    tags: ['AI', 'Technology', 'Innovation'],
    source: 'Tech Review',
    status: 'published',
    readingTime: 3,
    isBreaking: false,
    isFeatured: true
  },
];

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [allNews, setAllNews] = useState<NewsArticle[]>(mockNews);
  const [drafts, setDrafts] = useState<DraftArticle[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    preferredCategories: ['Tech', 'Sports', 'Entertainment'],
    notifications: true,
    fontSize: 'medium',
    autoPlayVideos: false
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bookmarks, news, draftData, preferences, likes] = await Promise.all([
          AsyncStorage.getItem('bookmarkedNews'),
          AsyncStorage.getItem('allNews'),
          AsyncStorage.getItem('draftArticles'),
          AsyncStorage.getItem('userPreferences'),
          AsyncStorage.getItem('likedNews'),
        ]);

        if (bookmarks) setBookmarkedIds(JSON.parse(bookmarks));
        if (news) setAllNews(JSON.parse(news));
        if (draftData) setDrafts(JSON.parse(draftData));
        if (preferences) setUserPreferences(JSON.parse(preferences));
        if (likes) setLikedIds(JSON.parse(likes));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const toggleBookmark = useCallback((articleId: string) => {
    setBookmarkedIds((prev) => {
      const newBookmarks = prev.includes(articleId) ? prev.filter(id => id !== articleId) : [...prev, articleId];
      AsyncStorage.setItem('bookmarkedNews', JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  }, []);

  const toggleLike = useCallback((articleId: string) => {
    setLikedIds((prev) => {
      const newLikes = prev.includes(articleId) ? prev.filter(id => id !== articleId) : [...prev, articleId];
      AsyncStorage.setItem('likedNews', JSON.stringify(newLikes));
      setAllNews(prevNews => prevNews.map(article => 
        article.id === articleId ? { ...article, likes: prev.includes(articleId) ? article.likes - 1 : article.likes + 1 } : article
      ));
      return newLikes;
    });
  }, []);

  const incrementViews = useCallback((articleId: string) => {
    setAllNews(prevNews => prevNews.map(article => 
      article.id === articleId ? { ...article, views: article.views + 1 } : article
    ));
  }, []);

  const isBookmarked = useCallback((articleId: string) => bookmarkedIds.includes(articleId), [bookmarkedIds]);
  const isLiked = useCallback((articleId: string) => likedIds.includes(articleId), [likedIds]);

  const getBookmarkedArticles = useCallback(() => allNews.filter(article => bookmarkedIds.includes(article.id)), [allNews, bookmarkedIds]);
  const getLikedArticles = useCallback(() => allNews.filter(article => likedIds.includes(article.id)), [allNews, likedIds]);
  const getBreakingNews = useCallback(() => allNews.filter(article => article.isBreaking).slice(0, 5), [allNews]);
  const getFeaturedArticles = useCallback(() => allNews.filter(article => article.isFeatured).slice(0, 10), [allNews]);

  const filterByCategory = useCallback((category: NewsCategory) => {
    if (category === 'All') return allNews;
    return allNews.filter(article => article.category === category);
  }, [allNews]);

  const searchArticles = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return [];
    return allNews.filter(article =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.description.toLowerCase().includes(lowerQuery) ||
      article.content.toLowerCase().includes(lowerQuery) ||
      article.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      article.author.toLowerCase().includes(lowerQuery)
    );
  }, [allNews]);

  const getTrendingArticles = useCallback(() => {
    return [...allNews].sort((a, b) => (b.views + b.likes * 10) - (a.views + a.likes * 10)).slice(0, 15);
  }, [allNews]);

  const getArticleById = useCallback((id: string) => allNews.find(article => article.id === id), [allNews]);

  const getRecommendedArticles = useCallback((currentArticleId?: string) => {
    const currentArticle = currentArticleId ? getArticleById(currentArticleId) : null;
    if (!currentArticle) return getTrendingArticles().slice(0, 6);
    return allNews.filter(article => 
      article.id !== currentArticleId && (article.category === currentArticle.category || article.tags.some(tag => currentArticle.tags.includes(tag)))
    ).sort((a, b) => (b.views + b.likes) - (a.views + a.likes)).slice(0, 6);
  }, [allNews, getArticleById, getTrendingArticles]);

  const addArticle = useCallback(async (article: Omit<NewsArticle, 'id' | 'views' | 'likes' | 'publishedAt' | 'readingTime'>, draftId?: string) => {
    const readingTime = Math.max(1, Math.ceil(article.content.split(' ').length / 200));
    const newArticle: NewsArticle = {
      ...article,
      id: `article_${Date.now()}`,
      views: 0,
      likes: 0,
      publishedAt: new Date().toISOString(),
      readingTime,
      status: 'published',
      isBreaking: article.isBreaking || false,
      isFeatured: article.isFeatured || false,
    };
    const updatedNews = [newArticle, ...allNews];
    setAllNews(updatedNews);
    await AsyncStorage.setItem('allNews', JSON.stringify(updatedNews));
    if (draftId) await deleteDraft(draftId);
    return newArticle;
  }, [allNews]);

  const updateArticle = useCallback(async (id: string, updates: Partial<NewsArticle>) => {
    const updatedNews = allNews.map(article => article.id === id ? { ...article, ...updates } : article);
    setAllNews(updatedNews);
    await AsyncStorage.setItem('allNews', JSON.stringify(updatedNews));
    return true;
  }, [allNews]);

  const deleteArticle = useCallback(async (id: string) => {
    const updatedNews = allNews.filter(article => article.id !== id);
    setAllNews(updatedNews);
    await AsyncStorage.setItem('allNews', JSON.stringify(updatedNews));
    const bookmarksUpdated = bookmarkedIds.filter(bid => bid !== id);
    const likesUpdated = likedIds.filter(lid => lid !== id);
    if (bookmarksUpdated.length !== bookmarkedIds.length) {
      setBookmarkedIds(bookmarksUpdated);
      await AsyncStorage.setItem('bookmarkedNews', JSON.stringify(bookmarksUpdated));
    }
    if (likesUpdated.length !== likedIds.length) {
      setLikedIds(likesUpdated);
      await AsyncStorage.setItem('likedNews', JSON.stringify(likesUpdated));
    }
    return true;
  }, [allNews, bookmarkedIds, likedIds]);

  const saveDraft = useCallback(async (draftId: string, draftData: Partial<DraftArticle>) => {
    const existingDraft = drafts.find(d => d.id === draftId);
    const updatedDraft: DraftArticle = existingDraft ? { ...existingDraft, ...draftData, lastSavedAt: new Date().toISOString() } : {
      id: draftId, title: draftData.title || '', description: draftData.description || '', content: draftData.content || '',
      imageUrl: draftData.imageUrl || '', category: draftData.category || 'Tech', author: draftData.author || '',
      tags: draftData.tags || [], source: draftData.source || '', lastSavedAt: new Date().toISOString(), scheduledFor: draftData.scheduledFor,
    };
    const updatedDrafts = existingDraft ? drafts.map(d => d.id === draftId ? updatedDraft : d) : [updatedDraft, ...drafts];
    setDrafts(updatedDrafts);
    await AsyncStorage.setItem('draftArticles', JSON.stringify(updatedDrafts));
  }, [drafts]);

  const getDraft = useCallback((draftId: string) => drafts.find(d => d.id === draftId), [drafts]);
  const deleteDraft = useCallback(async (draftId: string) => {
    const updatedDrafts = drafts.filter(d => d.id !== draftId);
    setDrafts(updatedDrafts);
    await AsyncStorage.setItem('draftArticles', JSON.stringify(updatedDrafts));
  }, [drafts]);

  const updatePreferences = useCallback((preferences: Partial<UserPreferences>) => {
    const newPreferences = { ...userPreferences, ...preferences };
    setUserPreferences(newPreferences);
    AsyncStorage.setItem('userPreferences', JSON.stringify(newPreferences));
  }, [userPreferences]);

  const value: NewsContextType = {
    allNews, bookmarkedIds, likedIds, drafts, userPreferences, isLoading,
    toggleBookmark, toggleLike, incrementViews, isBookmarked, isLiked,
    getBookmarkedArticles, getLikedArticles, getBreakingNews, getFeaturedArticles,
    filterByCategory, searchArticles, getTrendingArticles, getArticleById, getRecommendedArticles,
    addArticle, updateArticle, deleteArticle, saveDraft, getDraft, deleteDraft, updatePreferences,
  };

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) throw new Error('useNews must be used within NewsProvider');
  return context;
};