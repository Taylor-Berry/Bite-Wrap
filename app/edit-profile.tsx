import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { useTheme } from '../components/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../components/AuthProvider';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { session, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.user_metadata?.full_name || '');
      setEmail(session.user.email || '');
      setAvatar(session.user.user_metadata?.avatar_url || null);
    }
  }, [session]);

  const handleSave = async () => {
    try {
      await updateProfile({ full_name: name, avatar_url: avatar || undefined });
      router.back();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, theme.theme.typography.header]}>Edit Profile</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content}>
        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.theme.colors.card }]}>
              <Ionicons name="person" size={40} color={theme.theme.colors.text} />
            </View>
          )}
          <View style={styles.editIconContainer}>
            <Ionicons name="pencil" size={16} color="white" />
          </View>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, theme.theme.typography.body]}>Name</Text>
          <TextInput
            style={[styles.input, { color: theme.theme.colors.text }]}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor={theme.theme.colors.textSecondary}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, theme.theme.typography.body]}>Email</Text>
          <TextInput
            style={[styles.input, { color: theme.theme.colors.text }]}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor={theme.theme.colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={styles.updateButton} onPress={handleSave}>
          <Text style={styles.updateButtonText}>Update Profile</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 8,
  },
  saveButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: '#000',
    borderRadius: 100,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  updateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

