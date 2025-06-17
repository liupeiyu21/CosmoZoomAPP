// app/LoadingScreen.tsx
import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';

const planetImages = [
  require('../assets/planets/planet1.png'),
  require('../assets/planets/planet2.png'),
  require('../assets/planets/planet3.png'),
  require('../assets/planets/planet4.png'),
];

export default function LoadingScreen() {
  const rotation = new Animated.Value(0);
  const router = useRouter();

  useEffect(() => {
    // Анімація обертання
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Переходить на головну через 3 сек
    const timeout = setTimeout(() => {
      router.replace('/(tabs)/index'); // або explore, якщо хочеш
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ ...styles.orbit, transform: [{ rotate: spin }] }}>
        {planetImages.map((img, index) => (
          <Image key={index} source={img} style={styles.planet} />
        ))}
      </Animated.View>
      <Image source={require('../assets/planets/earth.png')} style={styles.centerPlanet} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
