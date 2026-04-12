import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileSection from '../../components/organisms/ ProfileSection';

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ProfileSection />
    </SafeAreaView>
  );
}