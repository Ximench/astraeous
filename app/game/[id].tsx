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
import { COLORS } from '../../constants/colors';
import { getGameById } from '../../constants/games';
import AstraBadge from '../../components/atoms/AstraBadge';
import GlowText from '../../components/atoms/GlowText';
import AstraDivider from '../../components/atoms/AstraDivider';

export default function GameDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const game   = getGameById(id);

  // ── Animaciones ──────────────────────────────────────────────────────────
  const fadeAnim    = useRef(new Animated.Value(0)).current;  // fundido entrada
  const slideAnim   = useRef(new Animated.Value(30)).current; // contenido sube
  const imageScale  = useRef(new Animated.Value(1.08)).current; // Ken Burns sutil

  useEffect(() => {
    Animated.parallel([
      // Fundido de pantalla completa
      Animated.timing(fadeAnim, {
        toValue:         1,
        duration:        420,
        useNativeDriver: true,
      }),
      // Contenido sube suavemente
      Animated.timing(slideAnim, {
        toValue:         0,
        duration:        480,
        delay:           80,
        useNativeDriver: true,
      }),
      // Imagen hace zoom-out sutil
      Animated.timing(imageScale, {
        toValue:         1,
        duration:        600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Juego no encontrado
  if (!game) {
    return (
      <SafeAreaView style={styles.screen}>
        <GlowText variant="title" style={{ margin: 24 }}>
          Juego no encontrado
        </GlowText>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <GlowText variant="caption" color={COLORS.purpleStrong}>← VOLVER</GlowText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    // Capa de fundido que envuelve toda la pantalla
    <Animated.View style={[styles.screen, { opacity: fadeAnim }]}>
      <SafeAreaView style={styles.screen} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── Hero: imagen con Ken Burns ── */}
          <View style={styles.heroContainer}>
            <Animated.View
              style={[
                styles.heroImageWrapper,
                { transform: [{ scale: imageScale }] },
              ]}
            >
              <Image
                source={game.thumbnail}
                style={styles.heroImage}
                resizeMode="cover"
              />
            </Animated.View>

            {/* Overlay oscuro inferior */}
            <View style={styles.heroOverlay} />

            {/* Botón volver flotante */}
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <GlowText variant="caption" color={COLORS.white}>← VOLVER</GlowText>
            </TouchableOpacity>

            {/* Título encima de la imagen */}
            <View style={styles.heroTitleBlock}>
              <AstraBadge label={game.status} variant="status" />
              <GlowText variant="display" glow style={styles.heroTitle}>
                {game.title}
              </GlowText>
            </View>
          </View>

          {/* ── Contenido animado ── */}
          <Animated.View
            style={[
              styles.contentBlock,
              {
                transform: [{ translateY: slideAnim }],
                opacity:   fadeAnim,
              },
            ]}
          >
            <AstraDivider variant="glow" />

            <GlowText variant="caption" color={COLORS.purpleWeak}>
              SOBRE EL JUEGO
            </GlowText>

            {game.description.split('\n\n').map((paragraph, i) => (
              <GlowText
                key={i}
                variant="body"
                color={COLORS.whiteAlpha80}
                style={styles.paragraph}
              >
                {paragraph}
              </GlowText>
            ))}

            <AstraDivider variant="line" />

            {/* Decoración inferior con símbolo */}
            <GlowText
              variant="display"
              glow
              style={styles.bottomSymbol}
            >
              ✦
            </GlowText>
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

  // Hero
  heroContainer: {
    height:   300,
    position: 'relative',
    overflow: 'hidden',
  },
  heroImageWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  heroImage: {
    width:  '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.purpleDeep,
    opacity:         0.55,
  },
  backBtn: {
    position:        'absolute',
    top:             16,
    left:            20,
    backgroundColor: COLORS.purpleAlpha30,
    paddingHorizontal: 12,
    paddingVertical:   6,
    borderRadius:    6,
    borderWidth:     1,
    borderColor:     COLORS.purpleAlpha30,
  },
  heroTitleBlock: {
    position: 'absolute',
    bottom:   24,
    left:     20,
    right:    20,
    gap:      8,
  },
  heroTitle: {
    fontSize:   28,
    lineHeight: 34,
  },

  // Contenido
  contentBlock: {
    paddingHorizontal: 24,
    paddingTop:        8,
    gap:               16,
  },
  paragraph: {
    lineHeight: 24,
  },
  bottomSymbol: {
    textAlign:   'center',
    fontSize:    28,
    marginTop:   8,
    marginBottom: 16,
    opacity:     0.4,
  },
});