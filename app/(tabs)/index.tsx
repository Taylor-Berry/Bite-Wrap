import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { useTheme } from '../../components/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { Log, getLogsByDate, deleteLogMeal } from '../../utils/database';
import { useFocusEffect } from '@react-navigation/native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

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
  const theme = useTheme();

  const title = meal.location.toLowerCase() === 'home'
    ? `${meal.name} at Home`
    : `${meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)} at ${meal.location}`;

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: meal.image || DEFAULT_MEAL_IMAGE }}
          style={styles.mealImage}
          defaultSource={{ uri: DEFAULT_MEAL_IMAGE }}
        />
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => onDelete(meal.id)}
        >
          <Ionicons name="trash-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.mealInfo}>
        <Text style={styles.mealTitle}>{title}</Text>
        <Text style={styles.mealDescription}>{meal.description}</Text>
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [logs, setLogs] = useState<Log | undefined>(undefined);

  useFocusEffect(
    React.useCallback(() => {
      fetchLogs();
    }, [selectedDate])
  );

  const fetchLogs = async () => {
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const fetchedLogs = await getLogsByDate(dateString);
    if (fetchedLogs) {
      setLogs(fetchedLogs);
    } else {
      setLogs({ id: dateString, date: dateString, meals: [] });
    }
  };

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

  const headerTitle = selectedDate.toDateString() === new Date().toDateString() 
    ? 'Today' 
    : format(selectedDate, 'MMMM d, yyyy');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.push({
            pathname: '/log',
            params: { date: format(selectedDate, 'yyyy-MM-dd') }
          })}
        >
          <Text>
            <Ionicons name="add" size={24} color={theme.theme.colors.text} />
          </Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
        <TouchableOpacity onPress={() => setShowCalendar(true)}>
          <Ionicons name="calendar" size={24} color={theme.theme.colors.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {logs && logs.meals.length > 0 ? (
          logs.meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} onDelete={handleDeleteMeal} />
          ))
        ) : (
          <Text style={styles.noMealsText}>No meals logged for this day.</Text>
        )}
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
                  [format(selectedDate, 'yyyy-MM-dd')]: {selected: true, selectedDotColor: theme.theme.colors.text}
                }}
                theme={{
                  textDayFontSize: 16,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 16,
                  selectedDayBackgroundColor: theme.theme.colors.primary,
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: theme.theme.colors.primary,
                  dayTextColor: theme.theme.colors.text,
                  monthTextColor: theme.theme.colors.text,
                  textDisabledColor: theme.theme.colors.textSecondary,
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
  mealImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
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
  calories: {
    fontSize: 16,
    color: '#666',
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
  noMealsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  imageContainer: {
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderRadius: 20,
    padding: 8,
  },
});