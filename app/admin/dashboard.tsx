import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Shield, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  TrendingUp,
  FileText,
  Sparkles,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useNews } from '@/contexts/NewsContext';
import { NewsArticle } from '@/types/news';

export default function AdminDashboardScreen() {
  const { theme } = useTheme();
  const { currentAdmin, logout, canEdit, canDelete } = useAdmin();
  const { allNews, deleteArticle } = useNews();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);

  useEffect(() => {
    if (!currentAdmin) {
      console.log('No admin logged in, redirecting to login');
      router.replace('/admin/login');
    }
  }, [currentAdmin, router]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(tabs)');
          },
        },
      ]
    );
  };

  const handleDeleteArticle = (article: NewsArticle) => {
    if (!canDelete) {
      Alert.alert('Permission Denied', 'Only super admin can delete articles');
      return;
    }

    Alert.alert(
      'Delete Article',
      `Are you sure you want to delete "${article.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Starting delete for article:', article.id);
              setIsDeleting(article.id);
              
              const success = await deleteArticle(article.id);
              
              if (success) {
                console.log('Article deleted successfully from database:', article.id);
                Alert.alert('Success', 'Article deleted successfully', [
                  { text: 'OK', style: 'default' }
                ]);
              } else {
                console.error('Delete failed:', article.id);
                Alert.alert('Error', 'Failed to delete article from database');
              }
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'An error occurred while deleting the article');
            } finally {
              setIsDeleting(null);
            }
          },
        },
      ]
    );
  };

  const totalViews = allNews.reduce((sum, article) => sum + article.views, 0);

  const renderArticleItem = ({ item }: { item: NewsArticle }) => {
    const isBeingDeleted = isDeleting === item.id;

    return (
      <View style={[styles.articleItem, { backgroundColor: theme.card, borderColor: theme.border, opacity: isBeingDeleted ? 0.5 : 1 }]}>
        {isBeingDeleted && (
          <View style={styles.deletingOverlay}>
            <Text style={[styles.deletingText, { color: theme.text }]}>Deleting...</Text>
          </View>
        )}
        {!isBeingDeleted && (
          <>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.articleItemImage}
              contentFit="cover"
            />
            <View style={styles.articleItemContent}>
              <Text style={[styles.articleItemTitle, { color: theme.text }]} numberOfLines={2}>
                {item.title}
              </Text>
              <View style={[styles.categoryBadge, { backgroundColor: theme.primary + '20' }]}>
                <Text style={[styles.categoryBadgeText, { color: theme.primary }]}>
                  {item.category}
                </Text>
              </View>
              <View style={styles.articleItemMeta}>
                <View style={styles.viewsContainer}>
                  <Eye size={14} color={theme.textSecondary} />
                  <Text style={[styles.articleItemMetaText, { color: theme.textSecondary }]}>
                    {item.views.toLocaleString()} views
                  </Text>
                </View>
                <Text style={[styles.articleItemMetaText, { color: theme.textSecondary }]}>
                  {new Date(item.publishedAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <View style={styles.articleItemActions}>
              {canEdit && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: theme.primary + '20' }]}
                  onPress={() => router.push(`/admin/edit/${item.id}` as any)}
                  activeOpacity={0.7}
                >
                  <Edit size={18} color={theme.primary} />
                </TouchableOpacity>
              )}
              {canDelete && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#FF3B3020' }]}
                  onPress={() => handleDeleteArticle(item)}
                  activeOpacity={0.7}
                >
                  <Trash2 size={18} color="#FF3B30" />
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 20, backgroundColor: theme.card }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={[styles.adminIcon, { backgroundColor: theme.primary }]}>
              <Shield size={24} color="#FFFFFF" />
            </View>
            <View>
              <Text style={[styles.welcomeText, { color: theme.textSecondary }]}>
                Welcome back
              </Text>
              <Text style={[styles.adminName, { color: theme.text }]}>
                {currentAdmin?.name}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: theme.background }]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <LogOut size={20} color={theme.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: theme.background }]}>
            <FileText size={20} color={theme.primary} />
            <Text style={[styles.statValue, { color: theme.text }]}>
              {allNews.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Articles
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.background }]}>
            <Eye size={20} color={theme.primary} />
            <Text style={[styles.statValue, { color: theme.text }]}>
              {totalViews.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Total Views
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.background }]}>
            <TrendingUp size={20} color={theme.primary} />
            <Text style={[styles.statValue, { color: theme.text }]}>
              {currentAdmin?.role === 'super_admin' ? 'Full' : currentAdmin?.role === 'editor' ? 'Editor' : 'Read'}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Access
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Manage Articles</Text>
          <View style={styles.headerButtons}>
            {canEdit && (
              <TouchableOpacity
                style={[styles.aiButton, { backgroundColor: theme.primary + '20', borderColor: theme.primary }]}
                onPress={() => router.push('/admin/ai-topics' as any)}
                activeOpacity={0.8}
              >
                <Sparkles size={18} color={theme.primary} />
              </TouchableOpacity>
            )}
            {canEdit && (
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: theme.primary }]}
                onPress={() => router.push('/admin/edit/new' as any)}
                activeOpacity={0.8}
              >
                <Plus size={20} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Add News</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <FlatList
          data={allNews}
          renderItem={renderArticleItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  adminIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 13,
  },
  adminName: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800' as const,
  },
  statLabel: {
    fontSize: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700' as const,
  },
  listContent: {
    paddingBottom: 20,
  },
  articleItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    gap: 12,
    position: 'relative',
  },
  articleItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  articleItemContent: {
    flex: 1,
    gap: 6,
  },
  articleItemTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    lineHeight: 18,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
  },
  articleItemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  articleItemMetaText: {
    fontSize: 11,
  },
  articleItemActions: {
    gap: 8,
    justifyContent: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deletingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  deletingText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
