import { NewsArticle, NewsCategory } from '@/types/news';

export interface ApiConfig {
  baseUrl: string;
  apiKey?: string;
}

const DEFAULT_CONFIG: ApiConfig = {
  baseUrl: 'https://api.example.com',
  apiKey: undefined,
};

let apiConfig: ApiConfig = { ...DEFAULT_CONFIG };

export function configureApi(config: Partial<ApiConfig>) {
  apiConfig = { ...apiConfig, ...config };
  console.log('API configured:', { ...apiConfig, apiKey: apiConfig.apiKey ? '***' : undefined });
}

export function getApiConfig(): ApiConfig {
  return { ...apiConfig };
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${apiConfig.baseUrl}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  if (apiConfig.apiKey) {
    headers['Authorization'] = `Bearer ${apiConfig.apiKey}`;
  }

  console.log(`API Request: ${options.method || 'GET'} ${endpoint}`);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${response.status}`, errorText);
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`API Response: ${endpoint} succeeded`);
    return data;
  } catch (error) {
    console.error(`API Request failed: ${endpoint}`, error);
    throw error;
  }
}

export interface CreateArticleDto {
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  category: NewsCategory;
  author: string;
  tags: string[];
  source: string;
}

export type UpdateArticleDto = Partial<CreateArticleDto>;

export const NewsApi = {
  async getAllNews(): Promise<NewsArticle[]> {
    return request<NewsArticle[]>('/news');
  },

  async getNewsById(id: string): Promise<NewsArticle> {
    return request<NewsArticle>(`/news/${id}`);
  },

  async createNews(data: CreateArticleDto): Promise<NewsArticle> {
    return request<NewsArticle>('/news', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateNews(id: string, data: UpdateArticleDto): Promise<NewsArticle> {
    return request<NewsArticle>(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteNews(id: string): Promise<void> {
    return request<void>(`/news/${id}`, {
      method: 'DELETE',
    });
  },

  async getTrendingNews(): Promise<NewsArticle[]> {
    return request<NewsArticle[]>('/news/trending');
  },

  async searchNews(query: string): Promise<NewsArticle[]> {
    return request<NewsArticle[]>(`/news/search?q=${encodeURIComponent(query)}`);
  },

  async getNewsByCategory(category: NewsCategory): Promise<NewsArticle[]> {
    return request<NewsArticle[]>(`/news/category/${category}`);
  },
};

export const AdminApi = {
  async login(email: string, password: string): Promise<{ token: string; admin: any }> {
    return request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async logout(): Promise<void> {
    return request('/admin/logout', {
      method: 'POST',
    });
  },

  async getAdmins(): Promise<any[]> {
    return request('/admin/users');
  },

  async createAdmin(data: any): Promise<any> {
    return request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteAdmin(id: string): Promise<void> {
    return request(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  },
};

export default {
  configureApi,
  getApiConfig,
  NewsApi,
  AdminApi,
};
