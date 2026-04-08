import { SafeAreaView } from 'react-native';
import TeamSection from '../../components/organisms/TeamSection';
import { COLORS } from '../../constants/colors';

export default function TeamScreen() {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLORS.background }}>
      <TeamSection />
    </SafeAreaView>
  );
}