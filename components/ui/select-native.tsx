import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

interface SelectNativeProps {
  value: string | null;
  onValueChange: (value: string) => void;
  placeholder: string;
  items: Array<{ label: string; value: string }>;
}

export function SelectNative({ value, onValueChange, placeholder, items }: SelectNativeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedItem = items.find(item => item.value === value);

  const openPicker = () => setIsOpen(true);
  const closePicker = () => setIsOpen(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={openPicker}>
        <Text style={[styles.buttonText, !selectedItem && styles.placeholder]}>
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#666" />
      </TouchableOpacity>
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={closePicker}
      >
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <TouchableOpacity onPress={closePicker}>
                <Text style={styles.doneButton}>Done</Text>
              </TouchableOpacity>
            </View>
            <Picker
              selectedValue={value}
              onValueChange={(itemValue) => {
                if (itemValue) {
                  onValueChange(itemValue.toString());
                  if (Platform.OS === 'android') {
                    closePicker();
                  }
                }
              }}
            >
              {items.map((item) => (
                <Picker.Item key={item.value} label={item.label} value={item.value} />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
  },
  placeholder: {
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  pickerHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    padding: 16,
    alignItems: 'flex-end',
  },
  doneButton: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

