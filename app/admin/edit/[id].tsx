import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Save, ImagePlus } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useNews } from '@/contexts/NewsContext';
import { NewsCategory } from '@/types/news';

const categories: NewsCategory[] = [
  'National',
  'International',
  'Sports',
  'Tech',
  'Entertainment',
  'Business',
  'Health',
];

export default function EditNewsScreen() {
  const { theme } = useTheme();
  const { canEdit } = useAdmin();
  const { getArticleById, addArticle, updateArticle, saveDraft, getDraft } = useNews();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const isNewArticle = id === 'new';
  const draftId = useRef(`draft_${Date.now()}`).current;
  
  const existingDraft = isNewArticle ? getDraft(draftId) : null;
  const existingArticle = isNewArticle ? null : getArticleById(id);
  const initialData = existingDraft || existingArticle;

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [category, setCategory] = useState<NewsCategory>(initialData?.category || 'Tech');
  const [author, setAuthor] = useState(initialData?.author || '');
  const [tags, setTags] = useState((initialData?.tags || []).join(', ') || '');
  const [source, setSource] = useState(initialData?.source || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastAutoSaved, setLastAutoSaved] = useState<Date | null>(null);
  
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const autoSaveDraft = useCallback(async () => {
    if (!isNewArticle) return;
    
    if (!title && !description && !content) return;
    
    try {
      await saveDraft(draftId, {
        title,
        description,
        content,
        imageUrl,
        category,
        author,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        source,
      });
      setLastAutoSaved(new Date());
      console.log('Auto-saved draft:', draftId);
    } catch (error) {
      console.error('Auto-save error:', error);
    }
  }, [isNewArticle, draftId, title, description, content, imageUrl, category, author, tags, source, saveDraft]);

  useEffect(() => {
    if (!canEdit) {
      Alert.alert('Permission Denied', 'You do not have permission to edit articles');
      router.back();
    }
  }, [canEdit, router]);

  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      autoSaveDraft();
    }, 3000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [title, description, content, imageUrl, category, author, tags, source, autoSaveDraft]);

  const handleSave = async () => {
    if (isSaving) {
      console.log('Save already in progress, ignoring duplicate request');
      return;
    }

    if (!title || !description || !content || !imageUrl || !author || !source) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const articleData = {
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        imageUrl: imageUrl.trim(),
        category,
        author: author.trim(),
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        source: source.trim(),
      };

      console.log('Saving article:', isNewArticle ? 'new' : id);

      if (isNewArticle) {
        const newArticle = await addArticle(articleData, draftId);
        console.log('Article created successfully:', newArticle.id);
        Alert.alert('Success', 'Article published successfully', [
          { 
            text: 'OK', 
            onPress: () => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/admin/dashboard');
              }
            }
          },
        ]);
      } else {
        const success = await updateArticle(id, articleData);
        console.log('Article updated successfully:', success);
        Alert.alert('Success', 'Article updated successfully', [
          { 
            text: 'OK', 
            onPress: () => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/admin/dashboard');
              }
            }
          },
        ]);
      }
    } catch (error) {
      console.error('Error saving article:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save article';
      setSaveError(errorMessage);
      Alert.alert('Error', errorMessage);
      setIsSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: theme.card }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            console.log('Back button pressed');
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {isNewArticle ? 'Add News' : 'Edit News'}
        </Text>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: isSaving ? theme.textSecondary : theme.primary }]}
          onPress={handleSave}
          disabled={isSaving}
          activeOpacity={0.8}
        >
          {isSaving ? (
            <Text style={styles.savingText}>...</Text>
          ) : (
            <Save size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {isSaving && (
            <View style={[styles.savingBanner, { backgroundColor: theme.primary }]}>
              <Text style={styles.savingBannerText}>Publishing article...</Text>
            </View>
          )}
          {!isSaving && lastAutoSaved && isNewArticle && (
            <View style={[styles.draftBanner, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.draftBannerText, { color: theme.textSecondary }]}>✓ Draft saved {new Date(lastAutoSaved).toLocaleTimeString()}</Text>
            </View>
          )}
          {saveError && (
            <View style={[styles.errorBanner, { backgroundColor: '#FF3B30' }]}>
              <Text style={styles.errorBannerText}>{saveError}</Text>
            </View>
          )}
          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>Title *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
              placeholder="Enter article title"
              placeholderTextColor={theme.textSecondary}
              value={title}
              onChangeText={setTitle}
              multiline
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
              placeholder="Brief description of the article"
              placeholderTextColor={theme.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>Full Content *</Text>
            <TextInput
              style={[styles.input, styles.contentArea, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
              placeholder="Write the full article content here"
              placeholderTextColor={theme.textSecondary}
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={8}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>Image URL *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
              placeholder="https://images.unsplash.com/..."
              placeholderTextColor={theme.textSecondary}
              value={imageUrl}
              onChangeText={setImageUrl}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={styles.imagePreview}
                contentFit="cover"
              />
            ) : (
              <View style={[styles.imagePlaceholder, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <ImagePlus size={32} color={theme.textSecondary} />
                <Text style={[styles.imagePlaceholderText, { color: theme.textSecondary }]}>
                  Image preview will appear here
                </Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>Category *</Text>
            <View style={styles.categoryContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    category === cat && { backgroundColor: theme.primary },
                    category !== cat && { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 },
                  ]}
                  onPress={() => setCategory(cat)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      category === cat ? { color: '#FFFFFF' } : { color: theme.text },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>Author *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
              placeholder="Author name"
              placeholderTextColor={theme.textSecondary}
              value={author}
              onChangeText={setAuthor}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>Tags</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
              placeholder="tag1, tag2, tag3"
              placeholderTextColor={theme.textSecondary}
              value={tags}
              onChangeText={setTags}
            />
            <Text style={[styles.hint, { color: theme.textSecondary }]}>
              Separate tags with commas
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>Source *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
              placeholder="News source"
              placeholderTextColor={theme.textSecondary}
              value={source}
              onChangeText={setSource}
            />
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  input: {
    padding: 16,
    borderRadius: 12,
    fontSize: 15,
    borderWidth: 1,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  contentArea: {
    minHeight: 200,
    textAlignVertical: 'top',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 12,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  imagePlaceholderText: {
    fontSize: 13,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  hint: {
    fontSize: 12,
    marginTop: 4,
  },
  savingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700' as const,
  },
  savingBanner: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  savingBannerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  errorBanner: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  errorBannerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  draftBanner: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  draftBannerText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
});
