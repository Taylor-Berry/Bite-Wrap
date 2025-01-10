import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface SelectProps {
  value: string | null;
  onValueChange: (value: string) => void;
  placeholder: string;
  items: Array<{ label: string; value: string; }>;
}

export function Select({ value, onValueChange, placeholder, items }: SelectProps) {
  return (
    <View style={styles.container}>
      <Picker
        selectedValue={value || ""}
        onValueChange={onValueChange}
        style={styles.picker}
      >
        <Picker.Item label={placeholder} value="" />
        {items.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  picker: {
    height: 36,
    fontSize: 13,
    color: '#333',
    backgroundColor: 'transparent',
  }
}); 