import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Eye, TrendingUp, Bookmark, Heart, Filter, Flame } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useNews } from '@/contexts/NewsContext';
import { NewsArticle, NewsCategory } from '@/types/news';

const timeFilters = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'All Time', value: 'all' },
];

export default function TrendingScreen() {
  const { theme } = useTheme();
  const { getTrendingArticles, toggleBookmark, toggleLike, isBookmarked, isLiked } = useNews();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('today');
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('All');

  const trendingNews = getTrendingArticles();
  
  const filteredNews = trendingNews.filter(article => 
    selectedCategory === 'All' || article.category === selectedCategory
  );

  const renderItem = ({ item, index }: { item: NewsArticle; index: number }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card }]}
      onPress={() => router.push(`/article/${item.id}` as any)}
      activeOpacity={0.8}
    >
      <View style={[styles.rankBadge, { backgroundColor: theme.primary }]}>
        <Text style={styles.rankText}>#{index + 1}</Text>
      </View>
      
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
        contentFit="cover"
      />
      
      <View style={styles.content}>
        <View style={[styles.categoryBadge, { backgroundColor: theme.primary + '20' }]}>
          <TrendingUp size={12} color={theme.primary} />
          <Text style={[styles.categoryText, { color: theme.primary }]}>
            {item.category}
          </Text>
        </View>
        
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        
        <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Eye size={14} color={theme.textSecondary} />
              <Text style={[styles.statText, { color: theme.textSecondary }]}>
                {item.views.toLocaleString()}
              </Text>
            </View>
            <View style={styles.stat}>
              <Heart 
                size={14} 
                color={isLiked(item.id) ? '#FF3B30' : theme.textSecondary} 
                fill={isLiked(item.id) ? '#FF3B30' : 'transparent'}
              />
              <Text style={[styles.statText, { color: theme.textSecondary }]}>
                {item.likes}
              </Text>
            </View>
            <View style={styles.stat}>
              <Flame size={14} color="#FF9500" />
              <Text style={[styles.trendingScore, { color: '#FF9500' }]}>
                {Math.round((item.views + item.likes * 10) / 1000)}K
              </Text>
            </View>
          </View>
          
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                toggleLike(item.id);
              }}
              style={styles.actionButton}
            >
              <Heart
                size={18}
                color={isLiked(item.id) ? '#FF3B30' : theme.textSecondary}
                fill={isLiked(item.id) ? '#FF3B30' : 'transparent'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                toggleBookmark(item.id);
              }}
              style={styles.actionButton}
            >
              <Bookmark
                size={18}
                color={isBookmarked(item.id) ? theme.primary : theme.textSecondary}
                fill={isBookmarked(item.id) ? theme.primary : 'transparent'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Trending</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            Most popular stories right now
          </Text>
        </View>
        <View style={[styles.trendingIcon, { backgroundColor: theme.primary + '20' }]}>
          <TrendingUp size={24} color={theme.primary} />
        </View>
      </View>

      {/* Time Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.timeFilters}
      >
        {timeFilters.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            style={[
              styles.timeFilterChip,
              selectedTimeFilter === filter.value && { backgroundColor: theme.primary },
              selectedTimeFilter !== filter.value && {
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderWidth: 1,
              },
            ]}
            onPress={() => setSelectedTimeFilter(filter.value)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.timeFilterText,
                selectedTimeFilter === filter.value
                  ? styles.timeFilterTextActive
                  : { color: theme.text },
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredNews}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <TrendingUp size={64} color={theme.textSecondary} strokeWidth={1.5} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              No trending articles
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
              Check back later for popular stories
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  trendingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeFilters: {
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
  },
  timeFilterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  timeFilterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  timeFilterTextActive: {
    color: '#FFFFFF',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    position: 'relative',
  },
  rankBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  rankText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  image: {
    width: 120,
    height: 160,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
  },
  trendingScore: {
    fontSize: 12,
    fontWeight: '800',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});