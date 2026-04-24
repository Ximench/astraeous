import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AstraButton from '../components/atoms/AstraButton';
import AstraDivider from '../components/atoms/AstraDivider';
import GlowText from '../components/atoms/GlowText';
import { COLORS } from '../constants/colors';
import { useMemberSession } from '../contexts/MemberSessionContext';
import { fetchProfileById, updateMemberProfile } from '../lib/memberAuth';

// ── Tipos ─────────────────────────────────────────────────────────────────────
type UserStatus = 'ACTIVO' | 'INACTIVO';

const STATUS_COLORS: Record<UserStatus, string> = {
  ACTIVO:   '#4ADE80',
  INACTIVO: '#F87171',
};

// ── Componente ────────────────────────────────────────────────────────────────
export default function EditProfileScreen() {
  const router = useRouter();
  const { session, setSession, loading } = useMemberSession();

  const [photoUri,    setPhotoUri]    = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoMimeType, setPhotoMimeType] = useState<string | null>(null);
  const [username,    setUsername]    = useState('Username');
  const [status,      setStatus]      = useState<UserStatus>('ACTIVO');
  const [editingName, setEditingName] = useState(false);
  const [nameInput,   setNameInput]   = useState('Username');
  const [saving,      setSaving]      = useState(false);

  // Animación de entrada
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  // ── Cargar perfil desde DB ────────────────────────────────────────────────
  useEffect(() => {
    const loadProfile = async () => {
      if (loading) return;

      if (!session) {
        router.replace('/login');
        return;
      }

      try {
        if (session.profileId) {
          const dbProfile = await fetchProfileById(session.profileId);
          if (dbProfile) {
            const initialUsername = dbProfile.display_name ?? dbProfile.username ?? (session.email?.split('@')[0] ?? 'Username');
            setUsername(initialUsername);
            setNameInput(initialUsername);
            setStatus(session.status === 'activo' ? 'ACTIVO' : 'INACTIVO');
            setPhotoUri(dbProfile.avatar_url ?? session.profilePhotoUrl ?? null);
            return;
          }
        }

        const fallbackUsername = session.email?.split('@')[0] ?? 'Username';
        setUsername(fallbackUsername);
        setNameInput(fallbackUsername);
        setStatus(session.status === 'activo' ? 'ACTIVO' : 'INACTIVO');
        setPhotoUri(session.profilePhotoUrl ?? null);
      } catch (e) {
        console.warn('Error cargando perfil:', e);
      }
    };

    loadProfile();

    // Animaciones de entrada
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
  }, [loading, router, session]);

  // ── Seleccionar foto ───────────────────────────────────────────────────────
  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:    ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect:        [1, 1],
      quality:       0.8,
      base64:        true,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setPhotoUri(asset.uri);
      setPhotoBase64(asset.base64 ?? null);
      setPhotoMimeType(asset.mimeType ?? 'image/jpeg');
    }
  };

  // ── Guardar nombre ─────────────────────────────────────────────────────────
  const saveName = () => {
    const trimmed = nameInput.trim();
    if (trimmed.length > 0) setUsername(trimmed);
    setEditingName(false);
  };

  // ── Guardar en DB ────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!session) {
      router.replace('/login');
      return;
    }

    setSaving(true);
    try {
      const result = await updateMemberProfile({
        memberId: session.memberId,
        profileId: session.profileId,
        username,
        displayName: username,
        status,
        avatarUrl: photoBase64 ? null : photoUri,
        avatarBlobBase64: photoBase64,
        avatarMimeType: photoMimeType,
      });

      setSession({
        memberId: result.member.id,
        email: result.member.email,
        profileId: result.member.profile_id,
        profilePhotoUrl: result.member.profile_photo_url,
        status: result.member.status,
      });
      router.back();
    } catch (e) {
      console.warn('Error guardando perfil:', e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={COLORS.purpleStrong} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <Animated.View style={[styles.screen, { opacity: fadeAnim }]}>
      <SafeAreaView style={styles.screen} edges={['top']}>
        
          {/* Botón volver */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <GlowText variant="caption" color={COLORS.white}>← VOLVER</GlowText>
          </TouchableOpacity>

          <Animated.View
            style={[
              styles.content,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <GlowText variant="display" style={styles.pageTitle}>
              EDITAR PERFIL
            </GlowText>

            <AstraDivider variant="glow" />

            {/* ── Foto ── */}
            <GlowText variant="caption" color={COLORS.purpleWeak}>FOTO DE PERFIL</GlowText>

            <View style={styles.photoRow}>
              <TouchableOpacity
                onPress={pickPhoto}
                activeOpacity={0.8}
                style={styles.avatarWrapper}
              >
                {photoUri ? (
                  <Image source={{ uri: photoUri }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <GlowText variant="title" color={COLORS.purpleWeak}>US</GlowText>
                  </View>
                )}
                <View style={styles.avatarOverlay}>
                  <GlowText variant="caption" style={styles.avatarOverlayText}>
                    CAMBIAR
                  </GlowText>
                </View>
              </TouchableOpacity>

              <View style={styles.photoHint}>
                <GlowText variant="body" color={COLORS.whiteAlpha80}>
                  Toca la foto para seleccionar una imagen de tu galería.
                </GlowText>
                <GlowText variant="caption" color={COLORS.whiteAlpha40}>
                  Se recortará en formato cuadrado.
                </GlowText>
              </View>
            </View>

            <AstraDivider variant="dashed" />

            {/* ── Username ── */}
            <GlowText variant="caption" color={COLORS.purpleWeak}>NOMBRE DE USUARIO</GlowText>

            {editingName ? (
              <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    value={nameInput}
                    onChangeText={setNameInput}
                    style={styles.textInput}
                    autoFocus
                    maxLength={24}
                    onSubmitEditing={saveName}
                    returnKeyType="done"
                    placeholderTextColor={COLORS.whiteAlpha40}
                    selectionColor={COLORS.purpleStrong}
                  />
                </View>
                <TouchableOpacity onPress={saveName} style={styles.confirmBtn} activeOpacity={0.7}>
                  <GlowText variant="caption" color={COLORS.yellowPale}>✓</GlowText>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => { setNameInput(username); setEditingName(true); }}
                style={styles.nameDisplay}
                activeOpacity={0.7}
              >
                <GlowText variant="subtitle" glow>{username}</GlowText>
                <View style={styles.editChip}>
                  <GlowText variant="caption" color={COLORS.purpleStrong} style={{ fontSize: 9 }}>
                    EDITAR
                  </GlowText>
                </View>
              </TouchableOpacity>
            )}

            <AstraDivider variant="dashed" />

            {/* ── Status ── */}
            <GlowText variant="caption" color={COLORS.purpleWeak}>STATUS</GlowText>

            <View style={styles.statusRow}>
              {(['ACTIVO', 'INACTIVO'] as UserStatus[]).map((s) => {
                const active = status === s;
                return (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setStatus(s)}
                    activeOpacity={0.7}
                    style={[
                      styles.statusOption,
                      {
                        borderColor:     STATUS_COLORS[s],
                        backgroundColor: active ? `${STATUS_COLORS[s]}20` : 'transparent',
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: STATUS_COLORS[s], opacity: active ? 1 : 0.3 },
                      ]}
                    />
                    <GlowText
                      variant="caption"
                      style={{ color: STATUS_COLORS[s], opacity: active ? 1 : 0.5 }}
                    >
                      {s}
                    </GlowText>
                    {active && (
                      <View style={styles.activeCheck}>
                        <GlowText variant="caption" style={{ color: STATUS_COLORS[s], fontSize: 10 }}>
                          ✓
                        </GlowText>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <AstraDivider variant="line" />

            {/* ── Guardar ── */}
            <AstraButton
              label={saving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
              variant="primary"
              fullWidth
              onPress={handleSave}
              disabled={saving}
            />
          </Animated.View>
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
  loadingWrap: {
    flex:            1,
    alignItems:      'center',
    justifyContent:  'center',
  },
  pageTitle: {
    fontSize:   26,
    lineHeight: 32,
  },
  photoRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           20,
  },
  avatarWrapper: {
    width:         90,
    height:        90,
    borderRadius:  45,
    overflow:      'hidden',
    borderWidth:   2,
    borderColor:   COLORS.purpleStrong,
    flexShrink:    0,
    shadowColor:   COLORS.purpleStrong,
    shadowOffset:  { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius:  8,
  },
  avatarImage: {
    width:        90,
    height:       90,
    borderRadius: 45,
  },
  avatarPlaceholder: {
    flex:            1,
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: COLORS.backgroundElevated,
  },
  avatarOverlay: {
    position:        'absolute',
    bottom:          0,
    left:            0,
    right:           0,
    height:          28,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems:      'center',
    justifyContent:  'center',
  },
  avatarOverlayText: {
    fontSize:      8,
    color:         COLORS.white,
    letterSpacing: 1,
  },
  photoHint: {
    flex: 1,
    gap:  6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           10,
  },
  inputWrapper: {
    flex:              1,
    backgroundColor:   COLORS.backgroundElevated,
    borderRadius:      8,
    borderWidth:       1,
    borderColor:       COLORS.purpleStrong,
    paddingHorizontal: 14,
    paddingVertical:   10,
  },
  textInput: {
    color:      COLORS.white,
    fontSize:   16,
    fontWeight: '600',
    padding:    0,
  },
  confirmBtn: {
    backgroundColor:   COLORS.purpleAlpha30,
    borderWidth:       1,
    borderColor:       COLORS.yellowPale,
    paddingHorizontal: 14,
    paddingVertical:   10,
    borderRadius:      8,
  },
  nameDisplay: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               10,
    backgroundColor:   COLORS.backgroundElevated,
    borderRadius:      8,
    borderWidth:       1,
    borderColor:       COLORS.whiteAlpha10,
    paddingHorizontal: 14,
    paddingVertical:   12,
  },
  editChip: {
    marginLeft:        'auto',
    backgroundColor:   COLORS.purpleAlpha15,
    borderWidth:       1,
    borderColor:       COLORS.purpleStrong,
    paddingHorizontal: 8,
    paddingVertical:   2,
    borderRadius:      4,
  },
  statusRow: {
    flexDirection: 'row',
    gap:           12,
  },
  statusOption: {
    flex:              1,
    flexDirection:     'row',
    alignItems:        'center',
    gap:               8,
    paddingHorizontal: 14,
    paddingVertical:   12,
    borderRadius:      8,
    borderWidth:       1.5,
  },
  statusDot: {
    width:        8,
    height:       8,
    borderRadius: 4,
  },
  activeCheck: {
    marginLeft: 'auto',
  },
  hint: {
    textAlign:  'center',
    lineHeight: 18,
    marginTop:  -8,
  },
});