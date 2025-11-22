import { createContext, useState, ReactNode } from "react";

type NewsArticle = {
  id: string;
  title: string;
  category: string;
  content: string;
};

type NewsContextType = {
  articles: NewsArticle[];
  setArticles: (a: NewsArticle[]) => void;
};

export const NewsContext = createContext<NewsContextType>({
  articles: [],
  setArticles: () => {},
});

export function NewsProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  return (
    <NewsContext.Provider value={{ articles, setArticles }}>
      {children}
    </NewsContext.Provider>
  );
}
