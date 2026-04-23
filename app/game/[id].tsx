import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Pause, Play } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
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
import { COLORS } from '../../constants/colors';
import { getGameById } from '../../constants/games';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VIDEO_HEIGHT = (SCREEN_WIDTH - 48) * (9 / 16); // ratio 16:9

// ── Canciones ─────────────────────────────────────────────────────────────────
const GAME_SONGS: Record<string, any> = {
  'outcome-memories': require('../../assets/GameSongs/OM.wav'),
  'grace':            require('../../assets/GameSongs/GR.wav'),
  'doors':            require('../../assets/GameSongs/DO.wav'),
};

// ── Componente de video individual ────────────────────────────────────────────
const GameplayVideo: React.FC<{ source: any; index: number }> = ({ source, index }) => {
  const player = useVideoPlayer(source, (p) => {
    p.loop = false;
    p.muted = false;
  });

  return (
    <View style={videoStyles.wrapper}>
      <GlowText variant="caption" color={COLORS.purpleWeak} style={videoStyles.label}>
        GAMEPLAY {index + 1 > 1 ? `#${index + 1}` : ''}
      </GlowText>
      <VideoView
        player={player}
        style={videoStyles.video}
        allowsFullscreen
        allowsPictureInPicture
        contentFit="contain"
      />
    </View>
  );
};

const videoStyles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    letterSpacing: 1.5,
  },
  video: {
    width:        '100%',
    height:       VIDEO_HEIGHT,
    borderRadius: 10,
    backgroundColor: COLORS.backgroundElevated,
    borderWidth:  1,
    borderColor:  COLORS.purpleAlpha30,
    overflow:     'hidden',
  },
});

// ── Pantalla principal ────────────────────────────────────────────────────────
export default function GameDetailScreen() {
  const { id }   = useLocalSearchParams<{ id: string }>();
  const router   = useRouter();
  const game     = getGameById(id);
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Animaciones
  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const slideAnim  = useRef(new Animated.Value(30)).current;
  const imageScale = useRef(new Animated.Value(1.08)).current;

  useEffect(() => {
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

    const loadAndPlay = async () => {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const song = GAME_SONGS[id];
        if (!song) return;
        const { sound } = await Audio.Sound.createAsync(song, {
          shouldPlay: true,
          isLooping:  true,
          volume:     0.7,
        });
        soundRef.current = sound;
        setIsPlaying(true);
      } catch (e) {
        console.warn('Error cargando audio:', e);
      }
    };

    loadAndPlay();

    return () => {
      setIsPlaying(false);
      soundRef.current?.stopAsync().then(() => soundRef.current?.unloadAsync());
    };
  }, [id]);

  const toggleAudio = async () => {
    if (!soundRef.current) return;
    try {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch (e) {
      console.warn('Error controlando audio:', e);
    }
  };

  if (!game) {
    return (
      <SafeAreaView style={styles.screen}>
        <GlowText variant="title" style={{ margin: 24 }}>Juego no encontrado</GlowText>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <GlowText variant="caption" color={COLORS.purpleStrong}>← VOLVER</GlowText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <Animated.View style={[styles.screen, { opacity: fadeAnim }]}>
      <SafeAreaView style={styles.screen} edges={['top']}>

        {/* Botones flotantes */}
        <TouchableOpacity onPress={() => router.back()} style={styles.floatingBackBtn} activeOpacity={0.7}>
          <GlowText variant="caption" color={COLORS.white}>← VOLVER</GlowText>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleAudio} style={styles.audioControlBtn} activeOpacity={0.75}>
          {isPlaying
            ? <Pause size={18} color={COLORS.white} strokeWidth={2.25} />
            : <Play  size={18} color={COLORS.white} fill={COLORS.white} strokeWidth={1.5} />
          }
        </TouchableOpacity>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── Hero ── */}
          <View style={styles.heroContainer}>
            <Animated.View style={[styles.heroImageWrapper, { transform: [{ scale: imageScale }] }]}>
              <Image source={game.thumbnail} style={styles.heroImage} resizeMode="cover" />
            </Animated.View>
            <View style={styles.heroOverlay} />
            <View style={styles.heroTitleBlock}>
              <AstraBadge label={game.status} variant="status" />
              <GlowText variant="display" glow style={styles.heroTitle}>
                {game.title}
              </GlowText>
            </View>
          </View>

          {/* ── Contenido ── */}
          <Animated.View
            style={[
              styles.contentBlock,
              { transform: [{ translateY: slideAnim }], opacity: fadeAnim },
            ]}
          >
            <AstraDivider variant="glow" />

            <GlowText variant="caption" color={COLORS.purpleWeak}>SOBRE EL JUEGO</GlowText>

            {game.description.split('\n\n').map((paragraph, i) => (
              <GlowText key={i} variant="body" color={COLORS.whiteAlpha80} style={styles.paragraph}>
                {paragraph}
              </GlowText>
            ))}

            {/* ── Videos de gameplay ── */}
            {game.videos.length > 0 && (
              <>
                <AstraDivider variant="glow" />
                <GlowText variant="caption" color={COLORS.purpleWeak}>GAMEPLAY</GlowText>

                {game.videos.map((src, i) => (
                  <GameplayVideo key={i} source={src} index={i} />
                ))}
              </>
            )}

            <AstraDivider variant="line" />

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
  floatingBackBtn: {
    position:          'absolute',
    top:               12,
    left:              20,
    zIndex:            30,
    backgroundColor:   COLORS.purpleAlpha30,
    paddingHorizontal: 12,
    paddingVertical:   6,
    borderRadius:      6,
    borderWidth:       1,
    borderColor:       COLORS.purpleAlpha30,
  },
  audioControlBtn: {
    position:       'absolute',
    top:            12,
    right:          20,
    zIndex:         30,
    backgroundColor: COLORS.purpleMid,
    width:          52,
    height:         52,
    borderRadius:   26,
    borderWidth:    1,
    borderColor:    COLORS.purpleAlpha30,
    alignItems:     'center',
    justifyContent: 'center',
    shadowColor:    COLORS.purpleStrong,
    shadowOffset:   { width: 0, height: 4 },
    shadowOpacity:  0.28,
    shadowRadius:   10,
    elevation:      6,
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