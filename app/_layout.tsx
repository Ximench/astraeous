import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { COLORS } from '../constants/colors';
import '../global.css';

export default function RootLayout() {
  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}