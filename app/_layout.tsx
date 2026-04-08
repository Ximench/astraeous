import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import '../global.css';

export default function RootLayout() {
  return (
    <SafeAreaView className="flex-1" edges={['top']} style={{ backgroundColor: COLORS.background }}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}