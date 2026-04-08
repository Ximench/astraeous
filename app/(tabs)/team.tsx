import { SafeAreaView } from 'react-native-safe-area-context';
import TeamSection from '../../components/organisms/TeamSection';
import { COLORS } from '../../constants/colors';

export default function TeamScreen() {
  return (
    <SafeAreaView className="flex-1" edges={['top']} style={{ backgroundColor: COLORS.background }}>
      <TeamSection />
    </SafeAreaView>
  );
}