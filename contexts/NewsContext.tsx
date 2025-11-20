import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { mockNews } from '@/mocks/news';
import { NewsArticle, NewsCategory, DraftArticle } from '@/types/news';

export const [NewsProvider, useNews] = createContextHook(() => {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [allNews, setAllNews] = useState<NewsArticle[]>(mockNews);
  const [drafts, setDrafts] = useState<DraftArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem('bookmarkedNews'),
      AsyncStorage.getItem('allNews'),
      AsyncStorage.getItem('draftArticles'),
    ]).then(([bookmarks, news, draftData]) => {
      if (bookmarks) {
        setBookmarkedIds(JSON.parse(bookmarks));
      }
      if (news) {
        setAllNews(JSON.parse(news));
      }
      if (draftData) {
        setDrafts(JSON.parse(draftData));
      }
      setIsLoading(false);
    });
  }, []);

  const toggleBookmark = useCallback((articleId: string) => {
    setBookmarkedIds((prev) => {
      const newBookmarks = prev.includes(articleId)
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId];
      AsyncStorage.setItem('bookmarkedNews', JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  }, []);

  const isBookmarked = useCallback((articleId: string) => {
    return bookmarkedIds.includes(articleId);
  }, [bookmarkedIds]);

  const getBookmarkedArticles = useCallback((): NewsArticle[] => {
    return mockNews.filter(article => bookmarkedIds.includes(article.id));
  }, [bookmarkedIds]);

  const filterByCategory = useCallback((category: NewsCategory): NewsArticle[] => {
    if (category === 'All') return allNews;
    return allNews.filter(article => article.category === category);
  }, [allNews]);

  const searchArticles = useCallback((query: string): NewsArticle[] => {
    const lowerQuery = query.toLowerCase();
    return allNews.filter(article =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.description.toLowerCase().includes(lowerQuery) ||
      article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }, [allNews]);

  const getTrendingArticles = useCallback((): NewsArticle[] => {
    return [...allNews].sort((a, b) => b.views - a.views).slice(0, 10);
  }, [allNews]);

  const getArticleById = useCallback((id: string): NewsArticle | undefined => {
    return allNews.find(article => article.id === id);
  }, [allNews]);

  const saveDraft = useCallback(async (draftId: string, draftData: Partial<DraftArticle>): Promise<void> => {
    try {
      const existingDraft = drafts.find(d => d.id === draftId);
      const updatedDraft: DraftArticle = existingDraft
        ? { ...existingDraft, ...draftData, lastSavedAt: new Date().toISOString() }
        : {
            id: draftId,
            title: draftData.title || '',
            description: draftData.description || '',
            content: draftData.content || '',
            imageUrl: draftData.imageUrl || '',
            category: draftData.category || 'Tech',
            author: draftData.author || '',
            tags: draftData.tags || [],
            source: draftData.source || '',
            lastSavedAt: new Date().toISOString(),
          };

      const updatedDrafts = existingDraft
        ? drafts.map(d => d.id === draftId ? updatedDraft : d)
        : [updatedDraft, ...drafts];

      setDrafts(updatedDrafts);
      await AsyncStorage.setItem('draftArticles', JSON.stringify(updatedDrafts));
      console.log('Draft saved:', draftId);
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  }, [drafts]);

  const getDraft = useCallback((draftId: string): DraftArticle | undefined => {
    return drafts.find(d => d.id === draftId);
  }, [drafts]);

  const deleteDraft = useCallback(async (draftId: string): Promise<void> => {
    const updatedDrafts = drafts.filter(d => d.id !== draftId);
    setDrafts(updatedDrafts);
    await AsyncStorage.setItem('draftArticles', JSON.stringify(updatedDrafts));
    console.log('Draft deleted:', draftId);
  }, [drafts]);

  const addArticle = useCallback(async (article: Omit<NewsArticle, 'id' | 'views' | 'publishedAt'>, draftId?: string): Promise<NewsArticle> => {
    const newArticle: NewsArticle = {
      ...article,
      id: Date.now().toString(),
      views: 0,
      publishedAt: new Date().toISOString(),
      status: 'published',
    };
    const updatedNews = [newArticle, ...allNews];
    setAllNews(updatedNews);
    await AsyncStorage.setItem('allNews', JSON.stringify(updatedNews));
    
    if (draftId) {
      await deleteDraft(draftId);
    }
    
    console.log('Article added:', newArticle.title);
    return newArticle;
  }, [allNews, deleteDraft]);

  const updateArticle = useCallback(async (id: string, updates: Partial<NewsArticle>): Promise<boolean> => {
    const updatedNews = allNews.map(article => 
      article.id === id ? { ...article, ...updates } : article
    );
    setAllNews(updatedNews);
    await AsyncStorage.setItem('allNews', JSON.stringify(updatedNews));
    console.log('Article updated:', id);
    return true;
  }, [allNews]);

  const deleteArticle = useCallback(async (id: string): Promise<boolean> => {
    try {
      console.log('Deleting article:', id);
      const updatedNews = allNews.filter(article => article.id !== id);
      
      setAllNews(updatedNews);
      await AsyncStorage.setItem('allNews', JSON.stringify(updatedNews));
      
      const bookmarksUpdated = bookmarkedIds.filter(bid => bid !== id);
      if (bookmarksUpdated.length !== bookmarkedIds.length) {
        setBookmarkedIds(bookmarksUpdated);
        await AsyncStorage.setItem('bookmarkedNews', JSON.stringify(bookmarksUpdated));
      }
      
      console.log('Article deleted successfully:', id);
      return true;
    } catch (error) {
      console.error('Error deleting article:', error);
      return false;
    }
  }, [allNews, bookmarkedIds]);

  return useMemo(() => ({
    allNews,
    bookmarkedIds,
    drafts,
    toggleBookmark,
    isBookmarked,
    getBookmarkedArticles,
    filterByCategory,
    searchArticles,
    getTrendingArticles,
    getArticleById,
    addArticle,
    updateArticle,
    deleteArticle,
    saveDraft,
    getDraft,
    deleteDraft,
    isLoading,
  }), [
    allNews,
    bookmarkedIds,
    drafts,
    toggleBookmark,
    isBookmarked,
    getBookmarkedArticles,
    filterByCategory,
    searchArticles,
    getTrendingArticles,
    getArticleById,
    addArticle,
    updateArticle,
    deleteArticle,
    saveDraft,
    getDraft,
    deleteDraft,
    isLoading
  ]);
});
