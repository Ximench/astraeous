import React from 'react';
import { TextInput, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import AstraButton from '../atoms/AstraButton';
import AstraDivider from '../atoms/AstraDivider';
import GlowText from '../atoms/GlowText';

interface MemberLoginFormProps {
  onSubmit?: (payload: { username: string; password: string }) => void;
  onCancel?: () => void;
}

const inputBaseClassName =
  'w-full rounded-[10px] border border-white-alpha-10 bg-background-card px-4 py-3 text-white';

const MemberLoginForm: React.FC<MemberLoginFormProps> = ({ onSubmit, onCancel }) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <View style={{ gap: 14 }}>
      <View style={{ gap: 6 }}>
        <GlowText variant="caption" color={COLORS.whiteAlpha40}>
          USUARIO
        </GlowText>
        <TextInput
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Tu usuario"
          placeholderTextColor={COLORS.whiteAlpha40}
          className={inputBaseClassName}
        />
      </View>

      <View style={{ gap: 6 }}>
        <GlowText variant="caption" color={COLORS.whiteAlpha40}>
          CONTRASEÑA
        </GlowText>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor={COLORS.whiteAlpha40}
          className={inputBaseClassName}
        />
      </View>

      <AstraDivider variant="line" />

      <View style={{ gap: 10 }}>
        <AstraButton
          label="INGRESAR"
          variant="primary"
          fullWidth
          onPress={() => onSubmit?.({ username: username.trim(), password })}
          disabled={!username.trim() || !password}
        />
        <AstraButton label="VOLVER" variant="ghost" fullWidth onPress={onCancel} />

        <GlowText variant="caption" color={COLORS.whiteAlpha40} style={{ textAlign: 'center' }}>
          (Demo) Usa email + contraseña (se valida contra la tabla members).
        </GlowText>
      </View>
    </View>
  );
};

export default MemberLoginForm;
