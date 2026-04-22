import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MemberSessionProvider } from '../contexts/MemberSessionContext';
import '../global.css';

export default function RootLayout() {
  return (
    <MemberSessionProvider>
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </MemberSessionProvider>
  );
}