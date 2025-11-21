import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Share,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Share2, Bookmark, Heart, Clock, Eye, User } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useNews } from '@/contexts/NewsContext';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { 
    getArticleById, 
    toggleBookmark, 
    toggleLike, 
    isBookmarked, 
    isLiked,
    incrementViews,
    getRecommendedArticles 
  } = useNews();
  const router = useRouter();

  const article = getArticleById(id || '');
  const recommendedArticles = getRecommendedArticles(id);

  useEffect(() => {
    if (article && id) {
      incrementViews(id);
    }
  }, [article, id]);

  if (!article) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.text }]}>
            Article not found
          </Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        title: article.title,
        message: `${article.title}\n\n${article.description}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share article');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: article.imageUrl }}
            style={styles.headerImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent', 'transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
          
          <SafeAreaView edges={['top']} style={styles.topBar}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.topActions}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleShare}
              >
                <Share2 size={22} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => toggleLike(article.id)}
              >
                <Heart
                  size={22}
                  color="#FFF"
                  fill={isLiked(article.id) ? '#FF3B30' : 'transparent'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => toggleBookmark(article.id)}
              >
                <Bookmark
                  size={22}
                  color="#FFF"
                  fill={isBookmarked(article.id) ? '#FFF' : 'transparent'}
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          <View style={styles.imageMeta}>
            <View style={[styles.categoryBadge, { backgroundColor: theme.primary }]}>
              <Text style={styles.categoryBadgeText}>{article.category}</Text>
            </View>
            {article.isBreaking && (
              <View style={[styles.breakingBadge, { backgroundColor: '#FF3B30' }]}>
                <Text style={styles.breakingBadgeText}>🚨 BREAKING</Text>
              </View>
            )}
          </View>
        </View>

        {/* Content */}
        <View style={[styles.content, { backgroundColor: theme.background }]}>
          <Text style={[styles.title, { color: theme.text }]}>
            {article.title}
          </Text>

          {/* Article Meta */}
          <View style={styles.metaContainer}>
            <View style={styles.authorSection}>
              <View style={[styles.authorAvatar, { backgroundColor: theme.primary }]}>
                <User size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={[styles.authorName, { color: theme.text }]}>
                  {article.author}
                </Text>
                <View style={styles.metaRow}>
                  <Clock size={12} color={theme.textSecondary} />
                  <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                    {new Date(article.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                  <Text style={[styles.metaText, { color: theme.textSecondary }]}>•</Text>
                  <Eye size={12} color={theme.textSecondary} />
                  <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                    {article.views.toLocaleString()} views
                  </Text>
                  <Text style={[styles.metaText, { color: theme.textSecondary }]}>•</Text>
                  <Heart size={12} color={theme.textSecondary} />
                  <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                    {article.likes} likes
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={[styles.readingTime, { backgroundColor: theme.card }]}>
              <Clock size={14} color={theme.textSecondary} />
              <Text style={[styles.readingTimeText, { color: theme.textSecondary }]}>
                {article.readingTime} min read
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* Description */}
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            {article.description}
          </Text>

          {/* Content */}
          <Text style={[styles.body, { color: theme.text }]}>
            {article.content}
          </Text>

          {/* Tags */}
          {article.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              <Text style={[styles.tagsLabel, { color: theme.text }]}>Tags:</Text>
              <View style={styles.tagsList}>
                {article.tags.map((tag) => (
                  <View
                    key={tag}
                    style={[styles.tag, { backgroundColor: theme.card, borderColor: theme.border }]}
                  >
                    <Text style={[styles.tagText, { color: theme.textSecondary }]}>
                      #{tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Source */}
          <View style={[styles.sourceCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.sourceLabel, { color: theme.textSecondary }]}>
              Source
            </Text>
            <Text style={[styles.sourceName, { color: theme.text }]}>
              {article.source}
            </Text>
          </View>

          {/* Recommended Articles */}
          {recommendedArticles.length > 0 && (
            <View style={styles.recommendedSection}>
              <Text style={[styles.recommendedTitle, { color: theme.text }]}>
                Recommended for you
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recommendedList}
              >
                {recommendedArticles.map((recArticle) => (
                  <TouchableOpacity
                    key={recArticle.id}
                    style={[styles.recommendedCard, { backgroundColor: theme.card }]}
                    onPress={() => router.push(`/article/${recArticle.id}`)}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: recArticle.imageUrl }}
                      style={styles.recommendedImage}
                      contentFit="cover"
                    />
                    <View style={styles.recommendedContent}>
                      <Text style={[styles.recommendedArticleTitle, { color: theme.text }]} numberOfLines={2}>
                        {recArticle.title}
                      </Text>
                      <View style={styles.recommendedMeta}>
                        <Text style={[styles.recommendedMetaText, { color: theme.textSecondary }]}>
                          {recArticle.category}
                        </Text>
                        <Text style={[styles.recommendedMetaText, { color: theme.textSecondary }]}>•</Text>
                        <Text style={[styles.recommendedMetaText, { color: theme.textSecondary }]}>
                          {recArticle.readingTime} min
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    width: width,
    height: 400,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  topActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageMeta: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    flexDirection: 'row',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  breakingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  breakingBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 36,
    marginBottom: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
  },
  readingTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  readingTimeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    fontWeight: '500',
  },
  body: {
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 24,
  },
  tagsContainer: {
    marginBottom: 24,
  },
  tagsLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  sourceCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  sourceLabel: {
    fontSize: 12,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  sourceName: {
    fontSize: 16,
    fontWeight: '700',
  },
  recommendedSection: {
    marginBottom: 20,
  },
  recommendedTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  recommendedList: {
    gap: 12,
  },
  recommendedCard: {
    width: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
  },
  recommendedImage: {
    width: '100%',
    height: 120,
  },
  recommendedContent: {
    padding: 12,
  },
  recommendedArticleTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 8,
  },
  recommendedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recommendedMetaText: {
    fontSize: 11,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});