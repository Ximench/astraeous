import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/typography';

interface TabIconProps {
  symbol: string;
  label: string;
  focused: boolean;
}

function TabIcon({ symbol, label, focused }: TabIconProps) {
  return (
    <View className="items-center justify-center relative" style={{ gap: 2, paddingTop: 4 }}>
      {focused && (
        <View
          style={{
            position: 'absolute',
            top: -4,
            width: 20,
            height: 2,
            backgroundColor: COLORS.yellowPale,
            borderRadius: 1,
            shadowColor: COLORS.yellowPale,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 4,
          }}
        />
      )}
      <Text
        style={[
          { fontSize: 20, color: COLORS.whiteAlpha40 },
          focused && {
            color: COLORS.purpleStrong,
            textShadowColor: COLORS.purpleStrong,
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 8,
          },
        ]}
      >
        {symbol}
      </Text>
      <Text
        style={[
          FONTS.caption,
          { fontSize: 9, color: COLORS.whiteAlpha40 },
          focused && {
            color: COLORS.yellowPale,
            textShadowColor: COLORS.yellowPale,
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 6,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.backgroundCard,
          borderTopWidth: 1,
          borderTopColor: COLORS.purpleAlpha30,
          height: 64,
          paddingBottom: 8,
          paddingTop: 4,
          elevation: 0,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: COLORS.yellowPale,
        tabBarInactiveTintColor: COLORS.whiteAlpha40,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon symbol="⬡" label="INICIO" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon symbol="✦" label="PROYECTOS" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="team"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon symbol="◈" label="EQUIPO" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon symbol="◎" label="PERFIL" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}