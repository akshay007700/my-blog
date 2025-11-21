import { NewsArticle, NewsCategory } from '@/types/news';

// Free NewsAPI.org key - you need to register and get your own
const NEWS_API_KEY = 'your_newsapi_key_here'; // Replace with your actual API key
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

export interface NewsApiArticle {
  title: string;
  description: string;
  content: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  author: string;
  url: string;
}

export class NewsApiService {
  static async fetchTopHeadlines(category?: NewsCategory, country: string = 'us'): Promise<NewsArticle[]> {
    try {
      console.log('Fetching headlines for category:', category);
      
      const categoryParam = category && category !== 'All' ? `&category=${category.toLowerCase()}` : '';
      const url = `${NEWS_API_BASE_URL}/top-headlines?country=${country}${categoryParam}&pageSize=20&apiKey=${NEWS_API_KEY}`;
      
      console.log('API URL:', url.replace(NEWS_API_KEY, '***'));
      
      const response = await fetch(url);
      const data = await response.json();

      console.log('API Response status:', data.status);
      console.log('Articles received:', data.articles?.length);

      if (data.status === 'ok' && data.articles) {
        return data.articles
          .filter((article: NewsApiArticle) => article.title && article.title !== '[Removed]')
          .map((article: NewsApiArticle, index: number) => this.transformApiArticle(article, index));
      }
      
      throw new Error(data.message || 'Failed to fetch news');
    } catch (error) {
      console.error('Error fetching news from API:', error);
      // Return mock data if API fails
      return this.getMockNews(category);
    }
  }

  static async searchNews(query: string, language: string = 'en'): Promise<NewsArticle[]> {
    try {
      console.log('Searching news for query:', query);
      
      const url = `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(query)}&language=${language}&sortBy=publishedAt&pageSize=15&apiKey=${NEWS_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'ok' && data.articles) {
        return data.articles
          .filter((article: NewsApiArticle) => article.title && article.title !== '[Removed]')
          .map((article: NewsApiArticle, index: number) => this.transformApiArticle(article, index));
      }
      
      throw new Error(data.message || 'Failed to search news');
    } catch (error) {
      console.error('Error searching news:', error);
      return this.getMockSearchNews(query);
    }
  }

  private static transformApiArticle(apiArticle: NewsApiArticle, index: number): NewsArticle {
    const content = apiArticle.content?.replace(/\[\+\d+ chars\]/g, '') || apiArticle.description || 'Read the full article for more details.';
    const readingTime = Math.max(1, Math.ceil(content.length / 200));
    
    return {
      id: `api_${Date.now()}_${index}`,
      title: apiArticle.title || 'No title available',
      description: apiArticle.description || 'No description available',
      content: content,
      imageUrl: apiArticle.urlToImage || this.getRandomImage(),
      category: this.detectCategory(apiArticle.title, apiArticle.description),
      author: apiArticle.author || apiArticle.source?.name || 'Unknown Author',
      publishedAt: apiArticle.publishedAt || new Date().toISOString(),
      views: Math.floor(Math.random() * 5000) + 1000,
      likes: Math.floor(Math.random() * 200),
      tags: this.extractTags(apiArticle.title, apiArticle.description),
      source: apiArticle.source?.name || 'News API',
      status: 'published',
      readingTime,
      isBreaking: index < 2, // First 2 articles are breaking
      isFeatured: index < 5, // First 5 articles are featured
    };
  }

  private static detectCategory(title: string = '', description: string = ''): NewsCategory {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('sport') || text.includes('game') || text.includes('match') || text.includes('player')) return 'Sports';
    if (text.includes('tech') || text.includes('ai') || text.includes('computer') || text.includes('software') || text.includes('digital')) return 'Tech';
    if (text.includes('movie') || text.includes('music') || text.includes('celebrity') || text.includes('film') || text.includes('entertainment')) return 'Entertainment';
    if (text.includes('health') || text.includes('medical') || text.includes('hospital') || text.includes('doctor') || text.includes('disease')) return 'Health';
    if (text.includes('business') || text.includes('market') || text.includes('economy') || text.includes('company') || text.includes('stock')) return 'Business';
    if (text.includes('politics') || text.includes('government') || text.includes('election') || text.includes('minister')) return 'National';
    
    return 'International';
  }

  private static extractTags(title: string = '', description: string = ''): string[] {
    const text = (title + ' ' + description).toLowerCase();
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'this', 'that'];
    
    const words = text.split(/[\s,.;!?]+/)
      .filter(word => word.length > 3 && !commonWords.includes(word.toLowerCase()))
      .slice(0, 5)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1));
    
    return [...new Set(words)]; // Remove duplicates
  }

  private static getRandomImage(): string {
    const images = [
      'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800',
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
      'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=800',
    ];
    return images[Math.floor(Math.random() * images.length)];
  }

  private static getMockNews(category?: NewsCategory): NewsArticle[] {
    const baseNews = [
      {
        title: 'Latest Technology Trends in 2024',
        description: 'Exploring the most exciting technology developments this year',
        content: 'The technology landscape continues to evolve rapidly with advancements in AI, quantum computing, and sustainable tech solutions.',
        category: 'Tech' as NewsCategory,
      },
      {
        title: 'Sports Championship Updates',
        description: 'Latest scores and highlights from major sporting events',
        content: 'Exciting matches and unexpected outcomes characterize this season of sports championships worldwide.',
        category: 'Sports' as NewsCategory,
      },
      {
        title: 'Global Economic Outlook',
        description: 'Analysis of current economic trends and future predictions',
        content: 'Economists discuss the current global economic situation and provide insights into future market directions.',
        category: 'Business' as NewsCategory,
      }
    ];

    return baseNews
      .filter(news => !category || category === 'All' || news.category === category)
      .map((news, index) => ({
        id: `mock_${Date.now()}_${index}`,
        ...news,
        imageUrl: this.getRandomImage(),
        author: 'News System',
        publishedAt: new Date().toISOString(),
        views: Math.floor(Math.random() * 3000) + 500,
        likes: Math.floor(Math.random() * 150),
        tags: [news.category, 'News', 'Update'],
        source: 'NewsHub Auto',
        status: 'published' as const,
        readingTime: 2,
        isBreaking: index === 0,
        isFeatured: true,
      }));
  }

  private static getMockSearchNews(query: string): NewsArticle[] {
    return [
      {
        id: `search_${Date.now()}_1`,
        title: `Latest News About ${query}`,
        description: `Recent developments and updates related to ${query}`,
        content: `This article covers the most recent information and developments concerning ${query}. Stay informed with the latest updates.`,
        imageUrl: this.getRandomImage(),
        category: 'Tech',
        author: 'News System',
        publishedAt: new Date().toISOString(),
        views: Math.floor(Math.random() * 2000) + 300,
        likes: Math.floor(Math.random() * 100),
        tags: [query, 'News', 'Information'],
        source: 'NewsHub Search',
        status: 'published',
        readingTime: 2,
        isBreaking: false,
        isFeatured: false,
      }
    ];
  }
}