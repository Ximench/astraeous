import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileGate from '../../components/organisms/ProfileGate';

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ProfileGate />
    </SafeAreaView>
  );
}
