import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Sparkles, RefreshCw } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useNews } from '@/contexts/NewsContext';
import { detectTrendingTopics, generateNewsFromTopic, TrendingTopic } from '@/services/aiNews';

export default function AITopicsScreen() {
  const { theme } = useTheme();
  const { currentAdmin } = useAdmin();
  const { saveDraft } = useNews();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [generatingTopicId, setGeneratingTopicId] = useState<string | null>(null);

  React.useEffect(() => {
    if (!currentAdmin) {
      router.replace('/admin/login');
    }
  }, [currentAdmin, router]);

  const handleDetectTopics = async () => {
    setIsDetecting(true);
    try {
      const detectedTopics = await detectTrendingTopics();
      setTopics(detectedTopics);
      if (detectedTopics.length === 0) {
        Alert.alert('Info', 'No trending topics detected at this time');
      }
    } catch (error) {
      console.error('Error detecting topics:', error);
      Alert.alert('Error', 'Failed to detect trending topics');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleGenerateNews = async (topic: TrendingTopic) => {
    setGeneratingTopicId(topic.id);
    try {
      console.log('Generating news for topic:', topic.title);
      
      const content = await generateNewsFromTopic(
        topic,
        currentAdmin?.name || 'AI News Writer',
        'NewsMod AI'
      );

      const draftId = `ai_draft_${Date.now()}`;
      await saveDraft(draftId, {
        title: content.title,
        description: content.description,
        content: content.content,
        imageUrl: content.imageUrl,
        category: topic.category,
        author: currentAdmin?.name || 'AI News Writer',
        tags: content.tags,
        source: 'NewsMod AI',
      });

      Alert.alert(
        'Draft Created',
        'AI-generated news has been saved as a draft. Would you like to edit it now?',
        [
          { text: 'Later', style: 'cancel' },
          {
            text: 'Edit Now',
            onPress: () => {
              router.push(`/admin/edit/${draftId}` as any);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error generating news:', error);
      Alert.alert('Error', 'Failed to generate news content');
    } finally {
      setGeneratingTopicId(null);
    }
  };

  const renderTopicItem = ({ item }: { item: TrendingTopic }) => {
    const isGenerating = generatingTopicId === item.id;

    return (
      <View style={[styles.topicItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.topicHeader}>
          <View style={[styles.categoryBadge, { backgroundColor: theme.primary + '20' }]}>
            <Text style={[styles.categoryText, { color: theme.primary }]}>
              {item.category}
            </Text>
          </View>
        </View>
        <Text style={[styles.topicTitle, { color: theme.text }]}>
          {item.title}
        </Text>
        <Text style={[styles.topicDescription, { color: theme.textSecondary }]}>
          {item.description}
        </Text>
        <TouchableOpacity
          style={[
            styles.generateButton,
            { backgroundColor: isGenerating ? theme.textSecondary : theme.primary },
          ]}
          onPress={() => handleGenerateNews(item)}
          disabled={isGenerating}
          activeOpacity={0.8}
        >
          {isGenerating ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.generateButtonText}>Generating...</Text>
            </>
          ) : (
            <>
              <Sparkles size={18} color="#FFFFFF" />
              <Text style={styles.generateButtonText}>Generate News</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: theme.card }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/admin/dashboard');
            }
          }}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>AI Trending Topics</Text>
        <TouchableOpacity
          style={[styles.detectButton, { backgroundColor: isDetecting ? theme.textSecondary : theme.primary }]}
          onPress={handleDetectTopics}
          disabled={isDetecting}
          activeOpacity={0.8}
        >
          {isDetecting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <RefreshCw size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>

      {topics.length === 0 ? (
        <View style={styles.emptyState}>
          <Sparkles size={64} color={theme.textSecondary} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            No Trending Topics Yet
          </Text>
          <Text style={[styles.emptyDescription, { color: theme.textSecondary }]}>
            Tap the refresh button to detect trending news topics using AI
          </Text>
          <TouchableOpacity
            style={[styles.detectButtonLarge, { backgroundColor: theme.primary }]}
            onPress={handleDetectTopics}
            disabled={isDetecting}
            activeOpacity={0.8}
          >
            {isDetecting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <RefreshCw size={20} color="#FFFFFF" />
                <Text style={styles.detectButtonLargeText}>Detect Trending Topics</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={topics}
          renderItem={renderTopicItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  detectButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 20,
  },
  topicItem: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700' as const,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 8,
    lineHeight: 24,
  },
  topicDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700' as const,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    marginTop: 24,
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  detectButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
  },
  detectButtonLargeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
