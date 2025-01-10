import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useTheme } from '../../components/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../components/AuthProvider';
import { SkeletonSettingItem } from '../../components/SkeletonLoading';

type SettingItemProps = {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
};

const SettingItem = ({ icon, title, subtitle, onPress }: SettingItemProps) => {
  const { theme, isDark } = useTheme();
  
  return (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
    >
      <View style={[styles.settingIconContainer, { backgroundColor: theme.colors.card }]}>
        <Ionicons name={icon as any} size={24} color={isDark ? theme.colors.text : theme.colors.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[theme.typography.body, styles.settingTitle, { color: theme.colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[theme.typography.caption, styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={24} 
        color={theme.colors.textSecondary} 
      />
    </TouchableOpacity>
  );
};

const SectionHeader = ({ title }: { title: string }) => {
  const theme = useTheme();
  
  return (
    <Text style={[theme.theme.typography.title, styles.sectionHeader]}>
      {title}
    </Text>
  );
};

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const { signOut, session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err: any) {
      Alert.alert('Error signing out', err.message || 'Failed to sign out');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.theme.colors.background }]}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: session?.user?.user_metadata?.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }}
          style={styles.avatar}
        />
      </View>
      <View style={styles.header}>
        <Text style={[theme.theme.typography.header, styles.headerTitle]}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <>
            <SkeletonSettingItem />
            <SkeletonSettingItem />
            <SkeletonSettingItem />
            <SkeletonSettingItem />
            <SkeletonSettingItem />
          </>
        ) : (
          <>
            <SectionHeader title="Profile" />
            <SettingItem
              icon="person-outline"
              title="Edit profile"
              onPress={() => router.push('/edit-profile')}
            />

            <SectionHeader title="Notifications" />
            <SettingItem
              icon="notifications-outline"
              title="Push notifications"
              subtitle="On"
              onPress={() => {}}
            />
            <SettingItem
              icon="mail-outline"
              title="Email notifications"
              subtitle="On"
              onPress={() => {}}
            />

            <SectionHeader title="Appearance" />
            <SettingItem
              icon="moon-outline"
              title="Dark Mode"
              subtitle={isDark ? "On" : "Off"}
              onPress={toggleTheme}
            />

            <SectionHeader title="Meal logging" />
            <SettingItem
              icon="time-outline"
              title="Auto-logging"
              subtitle="Off"
              onPress={() => {}}
            />

            <SectionHeader title="Support" />
            <SettingItem
              icon="help-circle-outline"
              title="Help Center"
              onPress={() => {}}
            />
            <SettingItem
              icon="chatbubble-outline"
              title="Give feedback"
              onPress={() => {}}
            />

            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    marginTop: 32,
    marginBottom: 16,
    fontSize: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 18,
    marginBottom: 0,
  },
  settingSubtitle: {
    marginTop: 2,
  },
  logoutButton: {
    marginTop: 40,
    marginBottom: 32,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '600',
  },
  avatarContainer: {
    position: 'absolute',
    top: 65,
    right: 40,
    zIndex: 1,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 40,
  },
});

