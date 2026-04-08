import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileSection from '../../components/organisms/ ProfileSection';
import { COLORS } from '../../constants/colors';

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1" edges={['top']} style={{ backgroundColor: COLORS.background }}>
      <ProfileSection />
    </SafeAreaView>
  );
}