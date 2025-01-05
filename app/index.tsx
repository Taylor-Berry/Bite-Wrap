import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '../components/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';

const mockMeals = [
  {
    id: '1',
    title: 'Breakfast at home',
    description: 'Fried eggs, avocado toast, and fresh orange juice',
    calories: 450,
    image: require('../assets/images/eggs.png'),
  },
  {
    id: '2',
    title: 'Lunch at Sweetgreen',
    description: 'Chicken pesto salad with veggies',
    calories: 500,
    image: require('../assets/images/cobb-salad.png'),
  },
  {
    id: '3',
    title: 'Dinner at home',
    description: 'Pork stir fried with bok choy',
    calories: 600,
    image: require('../assets/images/pork-stir-fry.jpg'),
  },
];

const MealCard = ({ meal }: { meal: { id: string; title: string; description: string; calories: number; image: any } }) => {
  const theme = useTheme();

  return (
    <View style={styles.card}>
      <Image
        source={meal.image}
        style={[styles.mealImage, { borderRadius: theme.shapes.borderRadius }]}
      />
      <View style={styles.mealInfo}>
        <Text style={theme.typography.title}>{meal.title}</Text>
        <Text style={theme.typography.body}>{meal.description}</Text>
        <Text style={theme.typography.caption}>Cal {meal.calories}</Text>
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateChange = (day: any) => {
    // Create date with local timezone
    const selectedDate = new Date(day.year, day.month - 1, day.day);
    setSelectedDate(selectedDate);
    setShowCalendar(false);
    console.log('Selected date:', format(selectedDate, 'yyyy-MM-dd'));
  };

  const headerTitle = selectedDate.toDateString() === new Date().toDateString() 
    ? 'Today' 
    : format(selectedDate, 'MMMM d, yyyy');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={theme.typography.header}>{headerTitle}</Text>
        <TouchableOpacity onPress={() => setShowCalendar(true)}>
          <Ionicons name="calendar" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {mockMeals.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showCalendar}
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Calendar
              onDayPress={handleDateChange}
              markedDates={{
                [format(selectedDate, 'yyyy-MM-dd')]: {selected: true, selectedDotColor: theme.colors.text}
              }}

            />
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
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 24,
  },
  mealImage: {
    width: '100%',
    height: 200,
    marginBottom: 12,
  },
  mealInfo: {
    paddingHorizontal: 4,
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
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
  },
  closeButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});

