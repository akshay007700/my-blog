import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Sun, 
  Moon, 
  Smartphone, 
  Settings as SettingsIcon, 
  Info, 
  Shield, 
  LogOut,
  Bell,
  Text as TextIcon,
  PlayCircle,
  User,
  Mail,
  Lock
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useNews } from '@/contexts/NewsContext';
import { NewsCategory } from '@/types/news';

export default function SettingsScreen() {
  const { theme, themeMode, setThemeMode } = useTheme();
  const { isLoggedIn, currentAdmin, logout } = useAdmin();
  const { userPreferences, updatePreferences } = useNews();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [notifications, setNotifications] = useState(userPreferences.notifications);
  const [autoPlayVideos, setAutoPlayVideos] = useState(userPreferences.autoPlayVideos);

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun, description: 'Always light mode' },
    { value: 'dark' as const, label: 'Dark', icon: Moon, description: 'Always dark mode' },
    { value: 'auto' as const, label: 'Auto', icon: Smartphone, description: 'Follow system' },
  ];

  const fontSizeOptions = [
    { value: 'small' as const, label: 'Small', size: 14 },
    { value: 'medium' as const, label: 'Medium', size: 16 },
    { value: 'large' as const, label: 'Large', size: 18 },
  ];

  const categories: NewsCategory[] = [
    'National', 'International', 'Sports', 'Tech', 'Entertainment', 'Business', 'Health'
  ];

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

  const handleNotificationToggle = (value: boolean) => {
    setNotifications(value);
    updatePreferences({ notifications: value });
  };

  const handleAutoPlayToggle = (value: boolean) => {
    setAutoPlayVideos(value);
    updatePreferences({ autoPlayVideos: value });
  };

  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    updatePreferences({ fontSize: size });
  };

  const toggleCategoryPreference = (category: NewsCategory) => {
    const currentCategories = userPreferences.preferredCategories;
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    
    updatePreferences({ preferredCategories: newCategories });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            Customize your experience
          </Text>
        </View>
        <View style={[styles.settingsIcon, { backgroundColor: theme.primary + '20' }]}>
          <SettingsIcon size={24} color={theme.primary} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance</Text>
          <Text style={[styles.sectionDescription, { color: theme.textSecondary }]}>
            Choose how NewsHub looks
          </Text>

          <View style={styles.themeOptions}>
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = themeMode === option.value;
              
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.themeOption,
                    isSelected && {
                      backgroundColor: theme.primary,
                      borderColor: theme.primary,
                    },
                    !isSelected && {
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setThemeMode(option.value)}
                  activeOpacity={0.7}
                >
                  <Icon
                    size={24}
                    color={isSelected ? '#FFFFFF' : theme.text}
                  />
                  <View style={styles.themeOptionTexts}>
                    <Text
                      style={[
                        styles.themeOptionText,
                        isSelected
                          ? { color: '#FFFFFF' }
                          : { color: theme.text },
                      ]}
                    >
                      {option.label}
                    </Text>
                    <Text
                      style={[
                        styles.themeOptionDescription,
                        isSelected
                          ? { color: '#FFFFFF', opacity: 0.8 }
                          : { color: theme.textSecondary },
                      ]}
                    >
                      {option.description}
                    </Text>
                  </View>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Reading Preferences */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Reading</Text>
          
          {/* Font Size */}
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <TextIcon size={20} color={theme.primary} />
              <View style={styles.preferenceTexts}>
                <Text style={[styles.preferenceLabel, { color: theme.text }]}>
                  Font Size
                </Text>
                <Text style={[styles.preferenceDescription, { color: theme.textSecondary }]}>
                  Adjust text size for comfortable reading
                </Text>
              </View>
            </View>
            <View style={styles.fontSizeOptions}>
              {fontSizeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.fontSizeOption,
                    userPreferences.fontSize === option.value && {
                      backgroundColor: theme.primary,
                    },
                  ]}
                  onPress={() => handleFontSizeChange(option.value)}
                >
                  <Text
                    style={[
                      styles.fontSizeText,
                      userPreferences.fontSize === option.value
                        ? { color: '#FFFFFF' }
                        : { color: theme.text },
                    ]}
                  >
                    A
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Preferred Categories */}
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <TextIcon size={20} color={theme.primary} />
              <View style={styles.preferenceTexts}>
                <Text style={[styles.preferenceLabel, { color: theme.text }]}>
                  Favorite Categories
                </Text>
                <Text style={[styles.preferenceDescription, { color: theme.textSecondary }]}>
                  Choose categories you're interested in
                </Text>
              </View>
            </View>
            <View style={styles.categoriesGrid}>
              {categories.map((category) => {
                const isSelected = userPreferences.preferredCategories.includes(category);
                return (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      isSelected && { backgroundColor: theme.primary },
                      !isSelected && {
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        borderWidth: 1,
                      },
                    ]}
                    onPress={() => toggleCategoryPreference(category)}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        isSelected
                          ? { color: '#FFFFFF' }
                          : { color: theme.text },
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Notifications</Text>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Bell size={20} color={theme.primary} />
              <View style={styles.preferenceTexts}>
                <Text style={[styles.preferenceLabel, { color: theme.text }]}>
                  Push Notifications
                </Text>
                <Text style={[styles.preferenceDescription, { color: theme.textSecondary }]}>
                  Receive breaking news alerts
                </Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: theme.border, true: theme.primary + '80' }}
              thumbColor={notifications ? theme.primary : '#f4f3f4'}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <PlayCircle size={20} color={theme.primary} />
              <View style={styles.preferenceTexts}>
                <Text style={[styles.preferenceLabel, { color: theme.text }]}>
                  Auto-play Videos
                </Text>
                <Text style={[styles.preferenceDescription, { color: theme.textSecondary }]}>
                  Automatically play videos in articles
                </Text>
              </View>
            </View>
            <Switch
              value={autoPlayVideos}
              onValueChange={handleAutoPlayToggle}
              trackColor={{ false: theme.border, true: theme.primary + '80' }}
              thumbColor={autoPlayVideos ? theme.primary : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Admin Section */}
        {isLoggedIn ? (
          <View style={[styles.section, { backgroundColor: theme.card }]}>
            <View style={styles.sectionHeader}>
              <Shield size={20} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 0 }]}>
                Admin Account
              </Text>
            </View>
            
            <View style={styles.adminInfo}>
              <View style={styles.adminDetail}>
                <User size={16} color={theme.textSecondary} />
                <Text style={[styles.adminText, { color: theme.text }]}>
                  {currentAdmin?.name}
                </Text>
              </View>
              <View style={styles.adminDetail}>
                <Mail size={16} color={theme.textSecondary} />
                <Text style={[styles.adminText, { color: theme.text }]}>
                  {currentAdmin?.email}
                </Text>
              </View>
              <View style={[styles.roleBadge, { backgroundColor: theme.primary + '20' }]}>
                <Shield size={14} color={theme.primary} />
                <Text style={[styles.roleText, { color: theme.primary }]}>
                  {currentAdmin?.role.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={[styles.adminButton, { backgroundColor: theme.background, borderColor: theme.border }]}
              onPress={() => router.push('/admin/dashboard' as any)}
              activeOpacity={0.7}
            >
              <Shield size={18} color={theme.text} />
              <Text style={[styles.adminButtonText, { color: theme.text }]}>Admin Dashboard</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.adminButton, styles.logoutBtn, { backgroundColor: '#FF3B3020', borderColor: '#FF3B30' }]}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <LogOut size={18} color="#FF3B30" />
              <Text style={[styles.adminButtonText, { color: '#FF3B30' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.adminLoginCard, { backgroundColor: theme.primary }]}
            onPress={() => router.push('/admin/login' as any)}
            activeOpacity={0.8}
          >
            <Shield size={32} color="#FFFFFF" />
            <View style={styles.adminLoginContent}>
              <Text style={styles.adminLoginTitle}>Admin Access</Text>
              <Text style={styles.adminLoginSubtitle}>
                Manage content and settings
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* App Info */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <Info size={20} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 0 }]}>
              About
            </Text>
          </View>
          <Text style={[styles.aboutText, { color: theme.textSecondary }]}>
            NewsHub v2.0
          </Text>
          <Text style={[styles.aboutText, { color: theme.textSecondary, marginTop: 8 }]}>
            A modern news application with advanced features and beautiful design.
          </Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.primary + '10', borderColor: theme.primary + '30' }]}>
          <Text style={[styles.infoTitle, { color: theme.primary }]}>
            NewsHub Advanced
          </Text>
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            Built with React Native • Expo • TypeScript
          </Text>
        </View>
      </ScrollView>
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
  settingsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 20,
  },
  themeOptions: {
    gap: 12,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    position: 'relative',
  },
  themeOptionTexts: {
    flex: 1,
    marginLeft: 12,
  },
  themeOptionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  themeOptionDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  checkmark: {
    position: 'absolute',
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  preferenceItem: {
    marginBottom: 24,
  },
  preferenceInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  preferenceTexts: {
    flex: 1,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  fontSizeOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  fontSizeOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontSizeText: {
    fontSize: 16,
    fontWeight: '700',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  adminInfo: {
    marginBottom: 16,
    gap: 8,
  },
  adminDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adminText: {
    fontSize: 14,
    fontWeight: '500',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    marginTop: 8,
  },
  adminButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  logoutBtn: {
    marginTop: 8,
  },
  adminLoginCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    gap: 16,
  },
  adminLoginContent: {
    flex: 1,
  },
  adminLoginTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  adminLoginSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});