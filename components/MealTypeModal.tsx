import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import { useTheme } from './ThemeProvider';

interface MealTypeModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (mealType: 'breakfast' | 'lunch' | 'dinner', description: string) => void;
}

export function MealTypeModal({ isVisible, onClose, onSelect }: MealTypeModalProps) {
  const theme = useTheme();
  const [description, setDescription] = React.useState('');
  const mealTypes: ('breakfast' | 'lunch' | 'dinner')[] = ['breakfast', 'lunch', 'dinner'];

  const handleSelect = (type: 'breakfast' | 'lunch' | 'dinner') => {
    onSelect(type, description);
    setDescription('');
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: theme.colors.background }]}>
          <Text style={[theme.typography.title, styles.modalTitle]}>Add Meal Details</Text>
          
          <View style={styles.inputContainer}>
            <Text style={theme.typography.body}>Description</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter meal description"
              multiline
            />
          </View>

          <Text style={[theme.typography.body, styles.sectionTitle]}>Select Meal Type</Text>
          {mealTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
              onPress={() => handleSelect(type)}
            >
              <Text style={[theme.typography.body, styles.buttonText]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={[theme.typography.body, styles.closeButtonText]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'stretch',
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
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
  },
  closeButtonText: {
    textAlign: 'center',
  },
});

