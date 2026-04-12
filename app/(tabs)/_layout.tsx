import { type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import { FolderKanban, House, UserRoundCog, UsersRound } from 'lucide-react-native';
import { type ComponentType, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';

type LucideIcon = ComponentType<{
  color?: string;
  size?: number;
  strokeWidth?: number;
}>;

const TAB_BAR_HEIGHT = 74;
const TAB_BAR_INSET = 10;
const BUBBLE_WIDTH = 58;
const BUBBLE_HEIGHT = 38;

function TabIcon({
  icon: Icon,
  focused,
  color,
}: {
  icon: LucideIcon;
  focused: boolean;
  color: string;
}) {
  return (
    <View className="h-10 w-14 items-center justify-center">
      <Icon color={color} size={23} strokeWidth={focused ? 2.5 : 2.1} />
    </View>
  );
}

function SpaceTabBar(props: BottomTabBarProps) {
  const bubbleX = useSharedValue(TAB_BAR_INSET);
  const trailX1 = useSharedValue(TAB_BAR_INSET);
  const trailX2 = useSharedValue(TAB_BAR_INSET);
  const [barWidth, setBarWidth] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (barWidth <= 0) return;
    const count = props.state.routes.length;
    if (count === 0) return;

    const availableWidth = Math.max(0, barWidth - TAB_BAR_INSET * 2);
    const localSlotWidth = availableWidth / count;
    const targetX = TAB_BAR_INSET + props.state.index * localSlotWidth + localSlotWidth / 2 - BUBBLE_WIDTH / 2;

    const minX = TAB_BAR_INSET;
    const maxX = Math.max(minX, barWidth - TAB_BAR_INSET - BUBBLE_WIDTH);
    const clampedTargetX = Math.min(Math.max(targetX, minX), maxX);

    bubbleX.value = withTiming(clampedTargetX, {
      duration: 280,
      easing: Easing.out(Easing.cubic),
    });
    trailX1.value = withDelay(
      50,
      withTiming(clampedTargetX, {
        duration: 320,
        easing: Easing.out(Easing.cubic),
      })
    );
    trailX2.value = withDelay(
      100,
      withTiming(clampedTargetX, {
        duration: 360,
        easing: Easing.out(Easing.cubic),
      })
    );

  }, [barWidth, bubbleX, props.state.index, props.state.routes.length, trailX1, trailX2]);

  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: bubbleX.value }],
  }));

  const trailStyle1 = useAnimatedStyle(() => ({
    transform: [{ translateX: trailX1.value }, { scale: 0.97 }],
  }));

  const trailStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateX: trailX2.value }, { scale: 0.93 }],
  }));

  const iconMap: Record<string, LucideIcon> = {
    home: House,
    projects: FolderKanban,
    team: UsersRound,
    profile: UserRoundCog,
  };

  return (
    <View className="bg-background-card" style={{ paddingBottom: insets.bottom }}>
      <View
        className="relative flex-row border-t border-purple-alpha-30"
        style={{
          height: TAB_BAR_HEIGHT,
          paddingHorizontal: TAB_BAR_INSET,
        }}
        onLayout={(event) => setBarWidth(event.nativeEvent.layout.width)}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              top: Math.round((TAB_BAR_HEIGHT - BUBBLE_HEIGHT) / 2) + 2,
              left: 0,
              width: BUBBLE_WIDTH,
              height: BUBBLE_HEIGHT,
              borderRadius: 14,
              backgroundColor: COLORS.purpleStrong,
              opacity: 0.16,
            },
            trailStyle2,
          ]}
        />

        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              top: Math.round((TAB_BAR_HEIGHT - BUBBLE_HEIGHT) / 2) + 1,
              left: 0,
              width: BUBBLE_WIDTH,
              height: BUBBLE_HEIGHT,
              borderRadius: 14,
              backgroundColor: COLORS.whiteAlpha10,
              borderWidth: 1,
              borderColor: COLORS.yellowAlpha30,
              opacity: 0.28,
            },
            trailStyle1,
          ]}
        />

        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              top: Math.round((TAB_BAR_HEIGHT - BUBBLE_HEIGHT) / 2),
              left: 0,
              width: BUBBLE_WIDTH,
              height: BUBBLE_HEIGHT,
              borderRadius: 14,
              backgroundColor: COLORS.whiteAlpha10,
              borderWidth: 1,
              borderColor: COLORS.yellowAlpha30,
              shadowColor: COLORS.yellowPale,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
            },
            bubbleStyle,
          ]}
        />

        {props.state.routes.map((route, index) => {
          const focused = props.state.index === index;
          const color = focused ? COLORS.yellowPale : COLORS.whiteAlpha40;
          const Icon = iconMap[route.name] ?? House;

          const onPress = () => {
            const event = props.navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              props.navigation.navigate(route.name as never);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={props.descriptors[route.key].options.tabBarAccessibilityLabel}
              testID={props.descriptors[route.key].options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={() => props.navigation.emit({ type: 'tabLongPress', target: route.key })}
              className="flex-1 items-center justify-center"
              style={{ height: TAB_BAR_HEIGHT }}
            >
              <TabIcon icon={Icon} focused={focused} color={color} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <SpaceTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="projects" />
      <Tabs.Screen name="team" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
