import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '../../components/ThemeProvider';
import { InsightData } from '../../utils/insights';

interface ListViewProps {
  data: InsightData;
}

const DEFAULT_IMAGE = 'https://placehold.co/600x400/png';

const getImageSource = (imageUrl?: string | null) => {
  console.log('Getting image source for URL:', imageUrl);
  if (!imageUrl) return { uri: DEFAULT_IMAGE };
  try {
    const url = new URL(imageUrl);
    console.log('Validated URL:', url.toString());
    return { uri: url.toString() };
  } catch (error) {
    console.log('URL validation error:', error);
    return { uri: DEFAULT_IMAGE };
  }
};

export function ListView({ data }: ListViewProps) {
  const theme = useTheme();

  const hasData = (
    data.mostVisitedRestaurants.thisYear.length > 0 ||
    data.mostCookedDishes.length > 0 ||
    data.topIngredients.length > 0
  );

  if (!hasData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[theme.theme.typography.body, styles.emptyText]}>
          No insights available yet. Start logging your meals to see your trends!
        </Text>
      </View>
    );
  }

  const renderItem = (
    title: string,
    subtitle: string,
    key: string,
    image?: string | null
  ) => {
    const imageSource = getImageSource(image);
    
    return (
      <View key={key} style={styles.item}>
        <Image
          source={imageSource}
          style={styles.itemImage}
          defaultSource={{ uri: DEFAULT_IMAGE }}
          onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
        />
        <View style={styles.itemContent}>
          <Text style={[theme.theme.typography.body, styles.itemTitle]}>
            {title}
          </Text>
          <Text style={[theme.theme.typography.caption, styles.itemSubtitle]}>
            {subtitle}
          </Text>
        </View>
      </View>
    );
  };

  const renderSection = (title: string, items: JSX.Element[]) => (
    <View key={title} style={styles.section}>
      <Text style={[theme.theme.typography.title, styles.sectionTitle]}>
        {title}
      </Text>
      <View style={styles.sectionContent}>
        {items.length > 0 ? (
          items
        ) : (
          <Text style={[theme.theme.typography.body, styles.emptySection]}>
            Not enough data to show {title.toLowerCase()} yet.
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderSection(
        'Most cooked dishes',
        data.mostCookedDishes.map((dish) =>
          renderItem(
            dish.name,
            `${dish.count} ${dish.count === 1 ? 'time' : 'times'}`,
            `dish-${dish.name}`,
            dish.image
          )
        )
      )}

      {renderSection(
        'Top 5 Most visited restaurants (This Year)',
        data.mostVisitedRestaurants.thisYear.slice(0, 5).map((restaurant) =>
          renderItem(
            restaurant.name,
            `${restaurant.count} visits`,
            `restaurant-${restaurant.name}`,
            restaurant.image
          )
        )
      )}

      {renderSection(
        'Top ingredients',
        data.topIngredients.map((ingredient) =>
          renderItem(
            ingredient.name,
            `${ingredient.count}`,
            `ingredient-${ingredient.name}`,
            null
          )
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  sectionContent: {
    gap: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    marginBottom: 2,
  },
  itemSubtitle: {
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
  emptySection: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    paddingVertical: 16,
  },
});

