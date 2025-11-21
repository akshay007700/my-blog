import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Search as SearchIcon, X, Bookmark, Heart, Eye, Filter } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useNews } from '@/contexts/NewsContext';
import { NewsArticle, NewsCategory } from '@/types/news';

const categories: NewsCategory[] = [
  'All', 'National', 'International', 'Sports', 'Tech', 'Entertainment', 'Business', 'Health'
];

export default function SearchScreen() {
  const { theme } = useTheme();
  const { searchArticles, toggleBookmark, toggleLike, isBookmarked, isLiked } = useNews();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('All');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'views'>('relevance');

  const results = useMemo(() => {
    let filtered = searchArticles(query);
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }
    
    switch (sortBy) {
      case 'date':
        filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        break;
      case 'views':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'relevance':
      default:
        // Already sorted by relevance from search
        break;
    }
    
    return filtered;
  }, [query, selectedCategory, sortBy, searchArticles]);

  const renderItem = ({ item }: { item: NewsArticle }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card }]}
      onPress={() => router.push(`/article/${item.id}` as any)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
        contentFit="cover"
      />
      <View style={styles.content}>
        <View style={[styles.categoryBadge, { backgroundColor: theme.primary + '20' }]}>
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
          <View style={styles.meta}>
            <Text style={[styles.author, { color: theme.textSecondary }]}>
              {item.author}
            </Text>
            <View style={styles.stats}>
              <Eye size={12} color={theme.textSecondary} />
              <Text style={[styles.statText, { color: theme.textSecondary }]}>
                {item.views}
              </Text>
              <Heart 
                size={12} 
                color={isLiked(item.id) ? '#FF3B30' : theme.textSecondary} 
                fill={isLiked(item.id) ? '#FF3B30' : 'transparent'}
              />
              <Text style={[styles.statText, { color: theme.textSecondary }]}>
                {item.likes}
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Search</Text>
        <View style={[styles.searchContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <SearchIcon size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search news, topics, authors..."
            placeholderTextColor={theme.textSecondary}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearButton}>
              <X size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      {query.length > 0 && (
        <View style={styles.filtersContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterChip,
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
                    styles.filterChipText,
                    selectedCategory === category
                      ? styles.filterChipTextActive
                      : { color: theme.text },
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <View style={styles.sortContainer}>
            <Filter size={16} color={theme.textSecondary} />
            <Text style={[styles.sortLabel, { color: theme.textSecondary }]}>Sort by:</Text>
            {['relevance', 'date', 'views'].map((sort) => (
              <TouchableOpacity
                key={sort}
                style={[
                  styles.sortChip,
                  sortBy === sort && { backgroundColor: theme.primary },
                ]}
                onPress={() => setSortBy(sort as any)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.sortChipText,
                    sortBy === sort
                      ? styles.sortChipTextActive
                      : { color: theme.text },
                  ]}
                >
                  {sort}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {query.length === 0 ? (
        <View style={styles.emptyContainer}>
          <SearchIcon size={64} color={theme.textSecondary} strokeWidth={1.5} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            Search for news
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            Find articles by title, tags, description, or author
          </Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.emptyContainer}>
          <SearchIcon size={64} color={theme.textSecondary} strokeWidth={1.5} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            No results found
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            Try a different search term or filter
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={[styles.resultsText, { color: theme.textSecondary }]}>
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </Text>
          }
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoriesList: {
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sortLabel: {
    fontSize: 12,
    marginLeft: 4,
    marginRight: 8,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  sortChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sortChipTextActive: {
    color: '#FFFFFF',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  resultsText: {
    fontSize: 14,
    marginBottom: 16,
    fontWeight: '500',
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  image: {
    width: 120,
    height: 140,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    flex: 1,
  },
  author: {
    fontSize: 11,
    marginBottom: 4,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 10,
    marginRight: 8,
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

// Add ScrollView import
import { ScrollView } from 'react-native';