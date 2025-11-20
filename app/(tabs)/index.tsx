import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Clock, Share2, Bookmark } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useNews } from '@/contexts/NewsContext';
import { NewsCategory, NewsArticle } from '@/types/news';
import { LinearGradient } from 'expo-linear-gradient';
import * as Sharing from 'expo-sharing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



const categories: NewsCategory[] = [
  'All',
  'National',
  'International',
  'Sports',
  'Tech',
  'Entertainment',
  'Business',
  'Health',
];

export default function HomeScreen() {
  const { theme } = useTheme();
  const { filterByCategory, toggleBookmark, isBookmarked } = useNews();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('All');
  const [refreshing, setRefreshing] = useState(false);

  const news = filterByCategory(selectedCategory);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleShare = async (article: NewsArticle) => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync('', {
        dialogTitle: article.title,
      });
    }
  };

  const renderFeaturedArticle = (article: NewsArticle) => (
    <TouchableOpacity
      key={article.id}
      style={[styles.featuredCard, { backgroundColor: theme.card }]}
      onPress={() => router.push(`/article/${article.id}`)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: article.imageUrl }}
        style={styles.featuredImage}
        contentFit="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.featuredGradient}
      >
        <View style={styles.featuredContent}>
          <View style={[styles.categoryBadge, { backgroundColor: theme.primary }]}>
            <Text style={styles.categoryBadgeText}>{article.category}</Text>
          </View>
          <Text style={styles.featuredTitle} numberOfLines={3}>
            {article.title}
          </Text>
          <View style={styles.featuredMeta}>
            <Clock size={14} color="#FFF" />
            <Text style={styles.featuredMetaText}>
              {new Date(article.publishedAt).toLocaleDateString()}
            </Text>
            <Text style={styles.featuredMetaText}>•</Text>
            <Text style={styles.featuredMetaText}>{article.author}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderArticleItem = ({ item }: { item: NewsArticle }) => (
    <TouchableOpacity
      style={[styles.articleCard, { backgroundColor: theme.card }]}
      onPress={() => router.push(`/article/${item.id}`)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.articleImage}
        contentFit="cover"
      />
      <View style={styles.articleContent}>
        <View style={[styles.smallCategoryBadge, { backgroundColor: theme.primary + '20' }]}>
          <Text style={[styles.smallCategoryText, { color: theme.primary }]}>
            {item.category}
          </Text>
        </View>
        <Text style={[styles.articleTitle, { color: theme.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.articleDescription, { color: theme.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.articleFooter}>
          <View style={styles.articleMeta}>
            <Text style={[styles.articleMetaText, { color: theme.textSecondary }]}>
              {item.author}
            </Text>
            <Text style={[styles.articleMetaText, { color: theme.textSecondary }]}>•</Text>
            <Text style={[styles.articleMetaText, { color: theme.textSecondary }]}>
              {new Date(item.publishedAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.articleActions}>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                handleShare(item);
              }}
              style={styles.actionButton}
            >
              <Share2 size={18} color={theme.textSecondary} />
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>NewsMod</Text>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
          Your news, your way
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && {
                backgroundColor: theme.primary,
              },
              selectedCategory !== category && {
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderWidth: 1,
              },
            ]}
            onPress={() => setSelectedCategory(category)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === category
                  ? styles.categoryChipTextActive
                  : { color: theme.text },
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={news}
        renderItem={renderArticleItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          news.length > 0 ? (
            <View style={styles.featuredSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Featured</Text>
              {renderFeaturedArticle(news[0])}
              <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 24 }]}>
                Latest News
              </Text>
            </View>
          ) : null
        }
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
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
  categoriesContainer: {
    maxHeight: 50,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  featuredSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  featuredCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    height: 320,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
    justifyContent: 'flex-end',
  },
  featuredContent: {
    padding: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700' as const,
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 30,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featuredMetaText: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.9,
  },
  listContent: {
    paddingBottom: 20,
  },
  articleCard: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  articleImage: {
    width: 120,
    height: 120,
  },
  articleContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  smallCategoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  smallCategoryText: {
    fontSize: 10,
    fontWeight: '700' as const,
  },
  articleTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    lineHeight: 20,
    marginBottom: 4,
  },
  articleDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  articleMetaText: {
    fontSize: 11,
  },
  articleActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
});
