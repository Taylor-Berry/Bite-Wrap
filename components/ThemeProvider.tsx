import React, { createContext, useContext, ReactNode } from 'react';
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

type Theme = {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    textSecondary: string;
    card: string;
  };
  spacing: {
    small: number;
    medium: number;
    large: number;
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

const theme: Theme = {
  colors: {
    primary: '#000000',
    secondary: '#666666',
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    card: '#FFFFFF',
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
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
    },
    body: {
      fontSize: 16,
      color: '#666666',
    },
    caption: {
      fontSize: 14,
      color: '#666666',
    },
  },
  shapes: {
    borderRadius: 16,
  },
};

const ThemeContext = createContext<Theme>(theme);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
);

