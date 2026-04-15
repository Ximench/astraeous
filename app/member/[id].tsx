import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AstraBadge from '../../components/atoms/AstraBadge';
import AstraDivider from '../../components/atoms/AstraDivider';
import GlowText from '../../components/atoms/GlowText';
import MemberCard from '../../components/molecules/ MemberCard';
import { COLORS } from '../../constants/colors';
import { getMemberById } from '../../constants/members';

export default function MemberDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const member = getMemberById(id);

  // ── Animaciones ───────────────────────────────────────────────────────────
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue:         1,
        duration:        380,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue:         0,
        duration:        440,
        delay:           60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // ── Miembro no encontrado ─────────────────────────────────────────────────
  if (!member) {
    return (
      <SafeAreaView style={styles.screen}>
        <GlowText variant="title" style={{ margin: 24 }}>
          Miembro no encontrado
        </GlowText>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <GlowText variant="caption" color={COLORS.purpleStrong}>← VOLVER</GlowText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <Animated.View style={[styles.screen, { opacity: fadeAnim }]}>
      <SafeAreaView style={styles.screen} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── Botón volver ── */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <GlowText variant="caption" color={COLORS.white}>← VOLVER</GlowText>
          </TouchableOpacity>

          {/* ── Contenido deslizante ── */}
          <Animated.View
            style={[
              styles.content,
              {
                opacity:   fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* ── Apodo + foto ── */}
            <View style={styles.heroBlock}>
              {/* Foto grande */}
              <View style={[styles.avatarLarge, member.isLead && styles.avatarLead]}>
                {member.uri ? (
                  <Image
                    source={member.uri}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                ) : (
                  <GlowText variant="display" color={COLORS.purpleWeak}>
                    {member.initials}
                  </GlowText>
                )}
              </View>

              {/* Apodo grande */}
              <View style={styles.heroText}>
                <AstraBadge label={member.role} variant={member.isLead ? 'status' : 'role'} />
                <GlowText variant="display" glow={member.isLead} style={styles.nickname}>
                  {member.name}
                </GlowText>
                <GlowText variant="caption" color={COLORS.whiteAlpha40}>
                  {member.initials}
                </GlowText>
              </View>
            </View>

            <AstraDivider variant="glow" />

            {/* ── Bio ── */}
            <GlowText variant="caption" color={COLORS.purpleWeak}>
              SOBRE EL INTEGRANTE
            </GlowText>
            <GlowText variant="body" color={COLORS.whiteAlpha80} style={styles.bio}>
              {member.bio}
            </GlowText>

            <AstraDivider variant="dashed" />

            {/* ── Carta del miembro (sin foto real aún) ── */}
            <GlowText variant="caption" color={COLORS.purpleWeak}>
              ¿QUIÉN ES?
            </GlowText>
            <MemberCard
              name={member.realName}
              role={member.role}
              initials={member.initials}
              isLead={member.isLead}
              uri={member.uri_2}
              // uri vacío intencional — se pasará cuando haya foto real
            />

            {/* Símbolo decorativo inferior */}
            <GlowText variant="display" glow style={styles.bottomSymbol}>✦</GlowText>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex:            1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 64,
  },
  backBtn: {
    alignSelf:         'flex-start',
    margin:            20,
    backgroundColor:   COLORS.purpleAlpha30,
    paddingHorizontal: 12,
    paddingVertical:   6,
    borderRadius:      6,
    borderWidth:       1,
    borderColor:       COLORS.purpleAlpha30,
  },
  content: {
    paddingHorizontal: 24,
    gap:               20,
  },

  // Hero
  heroBlock: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           20,
  },
  avatarLarge: {
    width:           100,
    height:          100,
    borderRadius:    50,
    backgroundColor: COLORS.backgroundElevated,
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     2,
    borderColor:     COLORS.whiteAlpha10,
    overflow:        'hidden',
    flexShrink:      0,
  },
  avatarLead: {
    borderColor:   COLORS.purpleStrong,
    shadowColor:   COLORS.purpleStrong,
    shadowOffset:  { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius:  12,
  },
  avatarImage: {
    width:        100,
    height:       100,
    borderRadius: 50,
  },
  heroText: {
    flex: 1,
    gap:  6,
  },
  nickname: {
    fontSize:   26,
    lineHeight: 32,
  },

  // Bio
  bio: {
    lineHeight: 24,
  },

  // Símbolo inferior
  bottomSymbol: {
    textAlign:    'center',
    fontSize:     28,
    marginTop:    8,
    marginBottom: 16,
    opacity:      0.4,
  },
});