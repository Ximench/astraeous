import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Pause, Play } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
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

// ── Canciones ─────────────────────────────────────────────────────────────────
const GAME_SONGS: Record<string, any> = {
  'outcome-memories': require('../../assets/GameSongs/OM.wav'),
  'grace':            require('../../assets/GameSongs/GR.wav'),
  'doors':            require('../../assets/GameSongs/DO.wav'),
};

// ── Video Hero con fundido ────────────────────────────────────────────────────
const HeroVideo: React.FC<{ source: any; thumbnail: ImageSourcePropType }> = ({ source, thumbnail }) => {
  const player = useVideoPlayer(source, (p) => {
    p.loop  = true;
    p.muted = true;
    p.play();
  });

  const videoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(videoOpacity, {
        toValue:         1,
        duration:        800,
        useNativeDriver: true,
      }).start();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={StyleSheet.absoluteFill}>
      <Image
        source={thumbnail}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: videoOpacity }]}>
        <VideoView
          player={player}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          nativeControls={false}
        />
      </Animated.View>
    </View>
  );
};

// ── Pantalla principal ────────────────────────────────────────────────────────
export default function GameDetailScreen() {
  const { id }   = useLocalSearchParams<{ id: string }>();
  const router   = useRouter();
  const game     = getGameById(id);
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

        {/* Botón flotante de volver — se queda */}
        <TouchableOpacity onPress={() => router.back()} style={styles.floatingBackBtn} activeOpacity={0.7}>
          <GlowText variant="caption" color={COLORS.white}>← VOLVER</GlowText>
        </TouchableOpacity>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── Hero ── */}
          <Animated.View style={[styles.heroContainer, { transform: [{ scale: imageScale }] }]}>
            {game.videos.length > 0
              ? <HeroVideo source={game.videos[0]} thumbnail={game.thumbnail} />
              : <Image source={game.thumbnail} style={StyleSheet.absoluteFill} resizeMode="cover" />
            }
            <View style={styles.heroOverlay} />

            {/* Título + icono de audio al lado */}
            <View style={styles.heroTitleBlock}>
              <AstraBadge label={game.status} variant="status" />
              <View style={styles.titleRow}>
                <GlowText variant="display" glow style={[styles.heroTitle, styles.heroTitleFlex]}>
                  {game.title}
                </GlowText>
                <TouchableOpacity onPress={toggleAudio} activeOpacity={0.7} style={styles.inlineAudioBtn}>
                  {isPlaying
                    ? <Pause size={22} color={COLORS.yellowPale} strokeWidth={2.25} />
                    : <Play  size={22} color={COLORS.yellowPale} fill={COLORS.yellowPale} strokeWidth={1.5} />
                  }
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

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
  heroContainer: {
    height:   300,
    position: 'relative',
    overflow: 'hidden',
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
  titleRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           10,
  },
  heroTitleFlex: {
    flex: 1,
  },
  heroTitle: {
    fontSize:   28,
    lineHeight: 34,
  },
  inlineAudioBtn: {
    paddingBottom: 2, // alineación visual con el texto
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