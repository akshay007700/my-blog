import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Eye, TrendingUp, Bookmark } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useNews } from '@/contexts/NewsContext';
import { NewsArticle } from '@/types/news';

export default function TrendingScreen() {
  const { theme } = useTheme();
  const { getTrendingArticles, toggleBookmark, isBookmarked } = useNews();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const trendingNews = getTrendingArticles();

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
          <View style={styles.viewsContainer}>
            <Eye size={16} color={theme.textSecondary} />
            <Text style={[styles.viewsText, { color: theme.textSecondary }]}>
              {item.views.toLocaleString()} views
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              toggleBookmark(item.id);
            }}
            style={styles.bookmarkButton}
          >
            <Bookmark
              size={20}
              color={isBookmarked(item.id) ? theme.primary : theme.textSecondary}
              fill={isBookmarked(item.id) ? theme.primary : 'transparent'}
            />
          </TouchableOpacity>
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
            Most viewed stories
          </Text>
        </View>
        <View style={[styles.trendingIcon, { backgroundColor: theme.primary + '20' }]}>
          <TrendingUp size={24} color={theme.primary} />
        </View>
      </View>

      <FlatList
        data={trendingNews}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
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
    fontWeight: '800' as const,
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
    fontWeight: '800' as const,
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
    fontWeight: '700' as const,
  },
  title: {
    fontSize: 16,
    fontWeight: '700' as const,
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
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewsText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  bookmarkButton: {
    padding: 4,
  },
});
