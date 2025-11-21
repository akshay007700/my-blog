import React, { createContext, useContext, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { NewsApiService } from '@/services/newsApi';
import { NewsArticle, NewsCategory } from '@/types/news';
import { useNews } from './NewsContext';

interface AutoNewsContextType {
  isFetching: boolean;
  lastFetchTime: Date | null;
  fetchAutoNews: (category?: NewsCategory) => Promise<NewsArticle[]>;
  fetchAndSaveNews: (category?: NewsCategory) => Promise<{ added: number; skipped: number }>;
  searchAndSaveNews: (query: string) => Promise<{ added: number; skipped: number }>;
}

const AutoNewsContext = createContext<AutoNewsContextType | undefined>(undefined);

export const AutoNewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
  const { addArticle, allNews } = useNews();

  const fetchAutoNews = useCallback(async (category?: NewsCategory): Promise<NewsArticle[]> => {
    setIsFetching(true);
    try {
      console.log('Starting auto news fetch for category:', category);
      const articles = await NewsApiService.fetchTopHeadlines(category);
      console.log('Fetched articles:', articles.length);
      setLastFetchTime(new Date());
      return articles;
    } catch (error) {
      console.error('Error fetching auto news:', error);
      Alert.alert('Error', 'Failed to fetch news from API. Using demo data.');
      return [];
    } finally {
      setIsFetching(false);
    }
  }, []);

  const fetchAndSaveNews = useCallback(async (category?: NewsCategory): Promise<{ added: number; skipped: number }> => {
    console.log('Fetching and saving news for category:', category);
    const articles = await fetchAutoNews(category);
    
    let added = 0;
    let skipped = 0;

    // Filter out duplicates and save new articles
    for (const article of articles) {
      const isDuplicate = allNews.some(existing => 
        existing.title.toLowerCase() === article.title.toLowerCase()
      );
      
      if (!isDuplicate) {
        await addArticle({
          title: article.title,
          description: article.description,
          content: article.content,
          imageUrl: article.imageUrl,
          category: article.category,
          author: article.author,
          tags: article.tags,
          source: article.source,
          isBreaking: article.isBreaking,
          isFeatured: article.isFeatured,
        });
        added++;
        console.log('Added new article:', article.title);
      } else {
        skipped++;
        console.log('Skipped duplicate article:', article.title);
      }
    }

    console.log(`Fetch completed: ${added} added, ${skipped} skipped`);
    return { added, skipped };
  }, [fetchAutoNews, addArticle, allNews]);

  const searchAndSaveNews = useCallback(async (query: string): Promise<{ added: number; skipped: number }> => {
    if (!query.trim()) {
      Alert.alert('Error', 'Please enter a search query');
      return { added: 0, skipped: 0 };
    }

    setIsFetching(true);
    let added = 0;
    let skipped = 0;

    try {
      console.log('Searching and saving news for query:', query);
      const articles = await NewsApiService.searchNews(query);
      console.log('Search results:', articles.length);
      
      for (const article of articles) {
        const isDuplicate = allNews.some(existing => 
          existing.title.toLowerCase() === article.title.toLowerCase()
        );
        
        if (!isDuplicate) {
          await addArticle({
            title: article.title,
            description: article.description,
            content: article.content,
            imageUrl: article.imageUrl,
            category: article.category,
            author: article.author,
            tags: article.tags,
            source: article.source,
            isBreaking: article.isBreaking,
            isFeatured: article.isFeatured,
          });
          added++;
          console.log('Added search result:', article.title);
        } else {
          skipped++;
          console.log('Skipped duplicate search result:', article.title);
        }
      }
      
      setLastFetchTime(new Date());
      console.log(`Search completed: ${added} added, ${skipped} skipped`);
      return { added, skipped };
    } catch (error) {
      console.error('Error searching and saving news:', error);
      Alert.alert('Error', 'Failed to search news. Please try again.');
      return { added: 0, skipped: 0 };
    } finally {
      setIsFetching(false);
    }
  }, [addArticle, allNews]);

  return (
    <AutoNewsContext.Provider value={{
      isFetching,
      lastFetchTime,
      fetchAutoNews,
      fetchAndSaveNews,
      searchAndSaveNews,
    }}>
      {children}
    </AutoNewsContext.Provider>
  );
};

export const useAutoNews = () => {
  const context = useContext(AutoNewsContext);
  if (!context) throw new Error('useAutoNews must be used within AutoNewsProvider');
  return context;
};