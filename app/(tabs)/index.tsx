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
import { Clock, Share2, Bookmark, Heart, Eye } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useNews } from '@/contexts/NewsContext';
import { NewsCategory } from '@/types/news';
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
  const { 
    allNews, 
    toggleBookmark, 
    toggleLike, 
    isBookmarked, 
    isLiked,
    getBreakingNews,
    getFeaturedArticles,
    filterByCategory,
    incrementViews 
  } = useNews();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('All');
  const [refreshing, setRefreshing] = useState(false);

  const news = filterByCategory(selectedCategory);
  const breakingNews = getBreakingNews();
  const featuredArticles = getFeaturedArticles();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleShare = async (article: any) => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(article.title);
    }
  };

  const handleArticlePress = (article: any) => {
    incrementViews(article.id);
    router.push(`/article/${article.id}`);
  };

  const renderBreakingNews = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.breakingNewsContainer}
    >
      {breakingNews.map((article) => (
        <TouchableOpacity
          key={article.id}
          style={[styles.breakingNewsCard, { backgroundColor: theme.card }]}
          onPress={() => handleArticlePress(article)}
          activeOpacity={0.9}
        >
          <Image
            source={{ uri: article.imageUrl }}
            style={styles.breakingNewsImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.breakingNewsGradient}
          >
            <View style={styles.breakingNewsContent}>
              <Text style={styles.breakingNewsBadge}>🚨 BREAKING</Text>
              <Text style={styles.breakingNewsTitle} numberOfLines={2}>
                {article.title}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderFeaturedArticle = (article: any) => (
    <TouchableOpacity
      key={article.id}
      style={[styles.featuredCard, { backgroundColor: theme.card }]}
      onPress={() => handleArticlePress(article)}
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

  const renderArticleItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.articleCard, { backgroundColor: theme.card }]}
      onPress={() => handleArticlePress(item)}
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
            <View style={styles.stats}>
              <Eye size={14} color={theme.textSecondary} />
              <Text style={[styles.statText, { color: theme.textSecondary }]}>
                {item.views}
              </Text>
              <Heart 
                size={14} 
                color={isLiked(item.id) ? '#FF3B30' : theme.textSecondary} 
                fill={isLiked(item.id) ? '#FF3B30' : 'transparent'}
              />
              <Text style={[styles.statText, { color: theme.textSecondary }]}>
                {item.likes}
              </Text>
            </View>
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>NewsHub</Text>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
          Stay informed, stay ahead
        </Text>
      </View>

      {breakingNews.length > 0 && (
        <View style={styles.breakingNewsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Breaking News</Text>
          {renderBreakingNews()}
        </View>
      )}

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
              selectedCategory === category && { backgroundColor: theme.primary },
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
          <View style={styles.featuredSection}>
            {selectedCategory === 'All' && featuredArticles.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Featured</Text>
                {renderFeaturedArticle(featuredArticles[0])}
              </>
            )}
            <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 24 }]}>
              {selectedCategory === 'All' ? 'Latest News' : selectedCategory}
            </Text>
          </View>
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
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  breakingNewsSection: {
    marginBottom: 16,
  },
  breakingNewsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  breakingNewsCard: {
    width: 280,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
  },
  breakingNewsImage: {
    width: '100%',
    height: '100%',
  },
  breakingNewsGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
    justifyContent: 'flex-end',
  },
  breakingNewsContent: {
    padding: 16,
  },
  breakingNewsBadge: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 8,
  },
  breakingNewsTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
  categoriesContainer: {
    maxHeight: 50,
    marginBottom: 16,
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
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  featuredSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
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
    fontWeight: '700',
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: '800',
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
    fontWeight: '700',
  },
  articleTitle: {
    fontSize: 15,
    fontWeight: '700',
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
    gap: 8,
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 11,
    marginRight: 8,
  },
  actionButton: {
    padding: 4,
  },
});