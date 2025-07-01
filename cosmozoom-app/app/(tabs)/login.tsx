import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const orbitRadius = width * 0.15;
const centerX = width / 2;
const centerY = height / 2;

const planets = [
  { key: 'planet1', source: require('../../assets/images/angle0.png'), angleOffset: 0 },
  { key: 'planet2', source: require('../../assets/images/angle90.png'), angleOffset: 90 },
  { key: 'planet3', source: require('../../assets/images/angle180.png'), angleOffset: 180 },
  { key: 'planet4', source: require('../../assets/images/angle270.png'), angleOffset: 270 },
];

export default function LoadingScreen() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(2 * Math.PI, { duration: 10000 }),
      -1
    );
  }, []);

  const renderPlanet = (planet: typeof planets[0]) => {
    const angleOffset = (planet.angleOffset * Math.PI) / 180;

    const animatedStyle = useAnimatedStyle(() => {
      const angle = progress.value + angleOffset;
      const x = orbitRadius * Math.cos(angle);
      const y = orbitRadius * Math.sin(angle);

      const scale = interpolate(
        Math.sin(angle),
        [-1, 0, 1],
        [0.6, 1.2, 0.6]
      );

      const opacity = interpolate(
        Math.sin(angle),
        [-1, 0, 1],
        [0.4, 1, 0.4]
      );

      return {
        position: 'absolute',
        transform: [
          { translateX: x + centerX - 50 },
          { translateY: y + centerY - 50 },
          { scale },
        ],
        opacity,
      };
    });

    return (
      <Animated.Image
        key={planet.key}
        source={planet.source}
        style={[styles.planet, animatedStyle]}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/login_background.png')}
        style={styles.background}
      />
      {/* 軌道の円 */}
      <View
        style={[
          styles.orbitCircle,
          {
            width: orbitRadius * 2,
            height: orbitRadius * 2,
            borderRadius: orbitRadius,
            top: centerY - orbitRadius,
            left: centerX - orbitRadius,
          },
        ]}
      />
      {/* 惑星たち */}
      <View style={styles.centerContainer}>
        {planets.map(renderPlanet)}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
    },
    background: {
      ...StyleSheet.absoluteFillObject,
      resizeMode: 'cover',
    },
    centerContainer: {
      flex: 1,
    },
    orbitCircle: {
      position: 'absolute',
      borderWidth: 1,
      borderColor: 'white',
      opacity: 0.3,
    },
    planet: {
      width: 100,
      height: 100,
    },
  });
  