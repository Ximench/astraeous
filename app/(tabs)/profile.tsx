import { SafeAreaView } from 'react-native';
import ProfileSection from '../../components/organisms/ ProfileSection';
import { COLORS } from '../../constants/colors';

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLORS.background }}>
      <ProfileSection />
    </SafeAreaView>
  );
}