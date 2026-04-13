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
import { Audio } from 'expo-av';
import { COLORS } from '../../constants/colors';
import { getGameById } from '../../constants/games';
import AstraBadge from '../../components/atoms/AstraBadge';
import GlowText from '../../components/atoms/GlowText';
import AstraDivider from '../../components/atoms/AstraDivider';

// ── Canciones por id de juego ─────────────────────────────────────────────────
const GAME_SONGS: Record<string, any> = {
  'outcome-memories': require('../../assets/GameSongs/OM.wav'),
  'grace':            require('../../assets/GameSongs/GR.wav'),
  'doors':            require('../../assets/GameSongs/DO.wav'),
};

export default function GameDetailScreen() {
  const { id }   = useLocalSearchParams<{ id: string }>();
  const router   = useRouter();
  const game     = getGameById(id);
  const soundRef = useRef<Audio.Sound | null>(null);

  // ── Animaciones ───────────────────────────────────────────────────────────
  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const slideAnim  = useRef(new Animated.Value(30)).current;
  const imageScale = useRef(new Animated.Value(1.08)).current;

  // ── Audio + animaciones al montar ─────────────────────────────────────────
  useEffect(() => {
    // Animaciones de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue:         1,
        duration:        420,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue:         0,
        duration:        480,
        delay:           80,
        useNativeDriver: true,
      }),
      Animated.timing(imageScale, {
        toValue:         1,
        duration:        600,
        useNativeDriver: true,
      }),
    ]).start();

    // Cargar y reproducir canción del juego
    const loadAndPlay = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,  // suena aunque el iPhone esté en silencio
        });

        const song = GAME_SONGS[id];
        if (!song) return;

        const { sound } = await Audio.Sound.createAsync(song, {
          shouldPlay: true,
          isLooping:  true,
          volume:     0.7,
        });

        soundRef.current = sound;
      } catch (e) {
        // Si falla el audio la pantalla sigue funcionando
        console.warn('Error cargando audio:', e);
      }
    };

    loadAndPlay();

    // Detener y liberar al salir de la pantalla
    return () => {
      soundRef.current?.stopAsync().then(() => {
        soundRef.current?.unloadAsync();
      });
    };
  }, [id]);

  // ── Juego no encontrado ───────────────────────────────────────────────────
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

            <View style={styles.heroOverlay} />

            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <GlowText variant="caption" color={COLORS.white}>← VOLVER</GlowText>
            </TouchableOpacity>

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

            <GlowText variant="display" glow style={styles.bottomSymbol}>
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
    position:          'absolute',
    top:               16,
    left:              20,
    backgroundColor:   COLORS.purpleAlpha30,
    paddingHorizontal: 12,
    paddingVertical:   6,
    borderRadius:      6,
    borderWidth:       1,
    borderColor:       COLORS.purpleAlpha30,
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
  contentBlock: {
    paddingHorizontal: 24,
    paddingTop:        8,
    gap:               16,
  },
  paragraph: {
    lineHeight: 24,
  },
  bottomSymbol: {
    textAlign:    'center',
    fontSize:     28,
    marginTop:    8,
    marginBottom: 16,
    opacity:      0.4,
  },
});