import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = {
  colors: {
    background: string;
    text: string;
    textSecondary: string;
    primary: string;
    card: string;
    border: string;
    input: string;
  };
  typography: {
    header: TextStyle;
    title: TextStyle;
    body: TextStyle;
    caption: TextStyle;
  };
  shapes: {
    borderRadius: number;
  };
};

const lightTheme: Theme = {
  colors: {
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    primary: '#000000',
    card: '#F5F5F5',
    border: '#EEEEEE',
    input: '#F5F5F5',
  },
  typography: {
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#000000',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#000000',
      marginBottom: 4,
    },
    body: {
      fontSize: 16,
      color: '#666666',
      marginBottom: 4,
    },
    caption: {
      fontSize: 16,
      color: '#666666',
    },
  },
  shapes: {
    borderRadius: 16,
  },
};

const darkTheme: Theme = {
  colors: {
    background: '#121212',
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    primary: '#FFFFFF',
    card: '#1E1E1E',
    border: '#2A2A2A',
    input: '#1E1E1E',
  },
  typography: {
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    body: {
      fontSize: 16,
      color: '#A0A0A0',
      marginBottom: 4,
    },
    caption: {
      fontSize: 16,
      color: '#A0A0A0',
    },
  },
  shapes: {
    borderRadius: 16,
  },
};

type ThemeContextType = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  React.useEffect(() => {
    // Load saved theme preference
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('isDarkMode');
        setIsDark(savedTheme === 'true');
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };
    loadThemePreference();
  }, []);

  const toggleTheme = useCallback(async () => {
    try {
      const newIsDark = !isDark;
      setIsDark(newIsDark);
      await AsyncStorage.setItem('isDarkMode', String(newIsDark));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }, [isDark]);

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

