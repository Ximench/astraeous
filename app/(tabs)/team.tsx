import { SafeAreaView, StyleSheet } from 'react-native';
import TeamSection from '../../components/organisms/TeamSection';
import { COLORS } from '../../constants/colors';

export default function TeamScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <TeamSection />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});