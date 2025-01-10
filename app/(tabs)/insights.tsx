import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../components/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getInsights, InsightData } from '../../utils/insights';
import { ListView } from '../../components/insights/ListView';
import { DashboardView } from '../../components/insights/DashboardView';
import { SkeletonSettingItem } from '../../components/SkeletonLoading';
import { useFocusEffect } from '@react-navigation/native';

type Tab = 'list' | 'dashboard';

export default function InsightsScreen() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('list');
  const [data, setData] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      const insightData = await getInsights();
      setData(insightData);
    } catch (error) {
      console.error('Error in insights screen:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchInsights();
    }, [fetchInsights])
  );

  const tabs: { id: Tab; label: string }[] = [
    { id: 'list', label: 'List' },
    { id: 'dashboard', label: 'Dashboard' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={theme.theme.typography.header}>Insights</Text>
      </View>

      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={activeTab === 'dashboard' ? undefined : { paddingVertical: 16 }}
      >
        {loading ? (
          <>
            <SkeletonSettingItem />
            <SkeletonSettingItem />
            <SkeletonSettingItem />
            <SkeletonSettingItem />
            <SkeletonSettingItem />
          </>
        ) : data ? (
          activeTab === 'list' ? (
            <ListView data={data} />
          ) : (
            <DashboardView data={data} />
          )
        ) : (
          <Text style={[theme.theme.typography.body, styles.emptyText]}>
            No insights available yet. Start logging your meals to see your trends!
          </Text>
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
  },
  content: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    paddingHorizontal: 32,
  },
});

