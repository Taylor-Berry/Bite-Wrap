import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { useTheme } from '../../components/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { Log, getLogsByDate, deleteLogMeal } from '../../utils/database';
import { useFocusEffect } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DEFAULT_MEAL_IMAGE = 'https://placehold.co/600x400/png';

const MealCard = ({ meal, onDelete }: { 
  meal: { 
    id: string; 
    name: string; 
    mealType: string;
    location: string;
    description: string;
    image?: string;
  },
  onDelete: (id: string) => void
}) => {
  console.log('MealCard - Received Image:', meal.image);
  const theme = useTheme();
  const [imageError, setImageError] = useState(false);

  const title = meal.location.toLowerCase() === 'home'
    ? `${meal.name} at Home`
    : `${meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)} at ${meal.location}`;

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageError ? DEFAULT_MEAL_IMAGE : (meal.image || DEFAULT_MEAL_IMAGE) }}
          style={styles.mealImage}
          defaultSource={{ uri: DEFAULT_MEAL_IMAGE }}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
      </View>
      <View style={styles.mealInfo}>
        <Text style={styles.mealTitle}>{title}</Text>
        <Text style={styles.mealDescription}>{meal.description}</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(meal.id)}>
        <Ionicons name="trash-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const AddMealCard = ({ mealType, onPress }: { mealType: string; onPress: () => void }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity style={styles.addMealCard} onPress={onPress}>
      <Ionicons name="add-circle-outline" size={48} color={theme.colors.text} />
      <Text style={styles.addMealText}>{mealType}</Text>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [logs, setLogs] = useState<Log | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchLogs = useCallback(async () => {
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const fetchedLogs = await getLogsByDate(dateString);
    console.log('Fetched logs:', JSON.stringify(fetchedLogs, null, 2));
    setLogs(fetchedLogs || { id: dateString, date: dateString, meals: [] });
    setLogs(fetchedLogs ? { ...fetchedLogs } : { id: dateString, date: dateString, meals: [] });
    setRefreshKey(prevKey => prevKey + 1);
  }, [selectedDate]);

  useFocusEffect(
    useCallback(() => {
      fetchLogs();
    }, [fetchLogs])
  );

  const handleDateChange = (day: any) => {
    const selectedDate = new Date(day.year, day.month - 1, day.day);
    setSelectedDate(selectedDate);
    setShowCalendar(false);
  };

  const handleDeleteMeal = async (mealId: string) => {
    if (logs) {
      const updatedMeals = logs.meals.filter(meal => meal.id !== mealId);
      setLogs({ ...logs, meals: updatedMeals });
      await deleteLogMeal(logs.date, mealId);
    }
  };

  const handleAddMeal = (mealType: string) => {
    router.push({
      pathname: '/log',
      params: { date: format(selectedDate, 'yyyy-MM-dd'), mealType }
    });
  };

  const headerTitle = selectedDate.toDateString() === new Date().toDateString() 
    ? 'Today' 
    : format(selectedDate, 'MMMM d, yyyy');

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowCalendar(true)}>
          <Ionicons name="calendar" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
        <View style={{ width: 24 }}>
          <Text> </Text>
        </View>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        key={refreshKey}
      >
        {mealTypes.map((mealType) => {
          const meal = logs?.meals.find(m => m.mealType.toLowerCase() === mealType.toLowerCase());
          return meal ? (
            <MealCard key={`${meal.id}-${refreshKey}`} meal={meal} onDelete={handleDeleteMeal} />
          ) : (
            <AddMealCard key={`${mealType}-${refreshKey}`} mealType={mealType} onPress={() => handleAddMeal(mealType.toLowerCase())} />
          );
        })}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showCalendar}
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.calendarContainer}>
              <Calendar
                onDayPress={handleDateChange}
                markedDates={{
                  [format(selectedDate, 'yyyy-MM-dd')]: {selected: true, selectedDotColor: theme.colors.text}
                }}
                theme={{
                  textDayFontSize: 16,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 16,
                  selectedDayBackgroundColor: theme.colors.primary,
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: theme.colors.primary,
                  dayTextColor: theme.colors.text,
                  monthTextColor: theme.colors.text,
                  textDisabledColor: theme.colors.textSecondary,
                  calendarBackground: 'white',
                  dayTextMarginTop: 4,
                  dayTextMarginBottom: 4,
                  arrowColor: 'black',
                }}
                style={{
                  width: '100%',
                  minHeight: 350,
                }}
              />
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCalendar(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  mealImage: {
    width: '100%',
    height: '100%',
  },
  mealInfo: {
    padding: 16,
  },
  mealTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mealDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderRadius: 20,
    padding: 8,
  },
  addMealCard: {
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  addMealText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '95%',
  },
  calendarContainer: {
    width: '100%',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});