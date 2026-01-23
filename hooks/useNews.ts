/**
 * useNews Hook
 * Fetches news articles with fallback to static data
 */

import { useState, useEffect, useCallback } from 'react';
import { newsService } from '@/services/news';
import { newsData } from '@/constants/AntData';
import type { NewsItem } from '@/types/api';

// Transform static data to API format
function transformStaticNews(staticData: typeof newsData): NewsItem[] {
  return staticData.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    link: item.link,
    image: item.image,
    source: 'Static Data',
  }));
}

interface UseNewsOptions {
  limit?: number;
  useFallback?: boolean;
}

interface UseNewsReturn {
  news: NewsItem[];
  loading: boolean;
  error: Error | null;
  lastUpdated: string | null;
  refetch: () => Promise<void>;
  isUsingFallback: boolean;
}

export function useNews(options: UseNewsOptions = {}): UseNewsReturn {
  const { limit = 20, useFallback = true } = options;
  
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await newsService.getNews(limit);
      
      // If API returns empty but we have fallback, use fallback
      if (response.items.length === 0 && useFallback) {
        const fallbackData = transformStaticNews(newsData);
        setNews(fallbackData);
        setIsUsingFallback(true);
      } else {
        setNews(response.items);
        setLastUpdated(response.last_updated || null);
        setIsUsingFallback(false);
      }
    } catch (err) {
      console.warn('Failed to fetch news from API, using fallback:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch news'));
      
      // Use fallback data on error
      if (useFallback) {
        const fallbackData = transformStaticNews(newsData);
        setNews(fallbackData);
        setIsUsingFallback(true);
      }
    } finally {
      setLoading(false);
    }
  }, [limit, useFallback]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return {
    news,
    loading,
    error,
    lastUpdated,
    refetch: fetchNews,
    isUsingFallback,
  };
}

export default useNews;
