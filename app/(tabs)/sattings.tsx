import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sun, Moon, Smartphone, Settings as SettingsIcon, Info, Shield, LogOut } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAdmin } from '@/contexts/AdminContext';

export default function SettingsScreen() {
  const { theme, themeMode, setThemeMode } = useTheme();
  const { isLoggedIn, currentAdmin, logout } = useAdmin();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'auto' as const, label: 'Auto', icon: Smartphone },
  ];

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
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance</Text>
          <Text style={[styles.sectionDescription, { color: theme.textSecondary }]}>
            Choose how NewsHub looks to you
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

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <Info size={20} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 0 }]}>
              About
            </Text>
          </View>
          <Text style={[styles.aboutText, { color: theme.textSecondary }]}>
            NewsHub v1.0
          </Text>
          <Text style={[styles.aboutText, { color: theme.textSecondary, marginTop: 8 }]}>
            A beautiful news application built with React Native and Expo.
          </Text>
        </View>

        {isLoggedIn ? (
          <View style={[styles.section, { backgroundColor: theme.card }]}>
            <View style={styles.sectionHeader}>
              <Shield size={20} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 0 }]}>
                Admin Account
              </Text>
            </View>
            <View style={styles.adminInfo}>
              <Text style={[styles.adminEmail, { color: theme.text }]}>
                {currentAdmin?.email}
              </Text>
              <View style={[styles.roleBadge, { backgroundColor: theme.primary + '20' }]}>
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
              <Text style={[styles.adminButtonText, { color: theme.text }]}>Open Admin Panel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.adminButton, styles.logoutBtn, { backgroundColor: '#FF3B3020', borderColor: '#FF3B30' }]}
              onPress={logout}
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
              <Text style={styles.adminLoginTitle}>Admin Login</Text>
              <Text style={styles.adminLoginSubtitle}>
                Access the admin panel to manage content
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <View style={[styles.infoCard, { backgroundColor: theme.primary + '10', borderColor: theme.primary + '30' }]}>
          <Text style={[styles.infoTitle, { color: theme.primary }]}>
            NewsMod v1.0
          </Text>
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            A powerful news management application with admin capabilities.
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
    fontWeight: '800' as const,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
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
  themeOptionText: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginLeft: 12,
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
    fontWeight: '700' as const,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
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
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  adminInfo: {
    marginTop: 12,
    marginBottom: 16,
    gap: 8,
  },
  adminEmail: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700' as const,
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
    fontWeight: '700' as const,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  adminLoginContent: {
    flex: 1,
  },
  adminLoginTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  adminLoginSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
});
