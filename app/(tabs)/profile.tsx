import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../components/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type SettingItemProps = {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
};

const SettingItem = ({ icon, title, subtitle, onPress }: SettingItemProps) => {
  const theme = useTheme();
  
  return (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
    >
      <View style={styles.settingIconContainer}>
        <Ionicons name={icon as any} size={24} color={theme.colors.text} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[theme.typography.body, styles.settingTitle]}>{title}</Text>
        {subtitle && (
          <Text style={[theme.typography.caption, styles.settingSubtitle]}>
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
    <Text style={[theme.typography.title, styles.sectionHeader]}>
      {title}
    </Text>
  );
};

export default function ProfileScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[theme.typography.header, styles.headerTitle]}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Profile" />
        <SettingItem
          icon="person-outline"
          title="Edit profile"
          subtitle="Add a photo, set your name, and more"
          onPress={() => {}}
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

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
  },
  headerTitle: {
    fontSize: 32,
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
    backgroundColor: '#F5F5F5',
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
    color: '#007AFF',
    fontWeight: '600',
  },
});

