import React from 'react';
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
import { ArrowLeft, Share2, Bookmark, Clock, Eye } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useNews } from '@/contexts/NewsContext';
import { LinearGradient } from 'expo-linear-gradient';

import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { getArticleById, toggleBookmark, isBookmarked } = useNews();
  const router = useRouter();

  const article = getArticleById(id || '');

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
      const shareUrl = `https://rork.app/vz569cnw4sotv320mxbwb/article/${article.id}`;
      const message = `${article.title}\n\n${article.description}\n\nRead more: ${shareUrl}`;

      if (Platform.OS === 'web') {
        if (navigator.share && navigator.canShare && navigator.canShare({ url: shareUrl })) {
          await navigator.share({
            title: article.title,
            text: article.description,
            url: shareUrl,
          });
        } else {
          await navigator.clipboard.writeText(shareUrl);
          Alert.alert('Link Copied', 'Article link has been copied to clipboard!');
        }
      } else {
        await Share.share(
          {
            message: message,
            title: article.title,
            url: shareUrl,
          },
          {
            dialogTitle: 'Share Article',
          }
        );
      }
    } catch (error: any) {
      if (error?.name !== 'AbortError') {
        console.error('Error sharing:', error);
        Alert.alert('Share Failed', 'Could not share the article. Please try again.');
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
          </View>
        </View>

        <View style={[styles.content, { backgroundColor: theme.background }]}>
          <Text style={[styles.title, { color: theme.text }]}>
            {article.title}
          </Text>

          <View style={styles.metaContainer}>
            <View style={styles.authorSection}>
              <View style={[styles.authorAvatar, { backgroundColor: theme.primary }]}>
                <Text style={styles.authorInitial}>
                  {article.author.charAt(0)}
                </Text>
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
                </View>
              </View>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <Text style={[styles.description, { color: theme.textSecondary }]}>
            {article.description}
          </Text>

          <Text style={[styles.body, { color: theme.text }]}>
            {article.content}
          </Text>

          <View style={styles.tagsContainer}>
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

          <View style={[styles.sourceCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.sourceLabel, { color: theme.textSecondary }]}>
              Source
            </Text>
            <Text style={[styles.sourceName, { color: theme.text }]}>
              {article.source}
            </Text>
          </View>
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
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700' as const,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    lineHeight: 36,
    marginBottom: 20,
  },
  metaContainer: {
    marginBottom: 20,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorInitial: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700' as const,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600' as const,
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
  divider: {
    height: 1,
    marginVertical: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    fontWeight: '500' as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  sourceCard: {
    padding: 16,
    borderRadius: 12,
  },
  sourceLabel: {
    fontSize: 12,
    marginBottom: 4,
    textTransform: 'uppercase' as const,
    fontWeight: '600' as const,
  },
  sourceName: {
    fontSize: 16,
    fontWeight: '700' as const,
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
    fontWeight: '600' as const,
  },
});
