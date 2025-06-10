import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getPlanetImage = (planetId: string) => {
    const map: Record<string, any> = {
      mercury: require('../../assets/planets/mercury.png'),
      venus: require('../../assets/planets/venus.png'),
      earth: require('../../assets/planets/earth.png'),
      mars: require('../../assets/planets/mars.png'),
      jupiter: require('../../assets/planets/jupiter.png'),
      saturn: require('../../assets/planets/saturn.png'),
      uranus: require('../../assets/planets/uranus.png'),
      neptune: require('../../assets/planets/neptune.png'),
      pluto: require('../../assets/planets/pluton.png'),
      moon: require('../../assets/planets/moon.png'),
      sun: require('../../assets/planets/sun.png'),
    };
  
    return map[planetId] || null;
  };
export default function PrizeScreen() {
  const router = useRouter();
  const { planet } = useLocalSearchParams();

  useEffect(() => {
    if (planet && typeof planet === 'string') {
      saveToGallery(planet);
    }
  }, [planet]);

  const saveToGallery = async (planetId: string) => {
    try {
      const existing = await AsyncStorage.getItem('gallery');
      const gallery = existing ? JSON.parse(existing) : [];
      if (!gallery.includes(planetId)) {
        gallery.push(planetId);
        await AsyncStorage.setItem('gallery', JSON.stringify(gallery));
      }
    } catch (e) {
      console.log('Error saving to gallery:', e);
    }
  };

  const planetImage = planet && typeof planet === 'string' ? getPlanetImage(planet) : null;

  return (
    <ImageBackground
      source={require('../../assets/background-1.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>おめでとう！全問正解！！</Text>
        {planetImage && <Image source={planetImage} style={styles.planet} />}
        <Text style={styles.subtitle}>君だけの惑星写真を手に入れたよ！</Text>
        <Text style={styles.note}>マイページの写真ホルダーに保存したよ</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.replace('/(tabs)/mypage')}>
          <Text style={styles.buttonText}>MyPageに戻る</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    padding: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 25,
    color: '#000000',
    marginTop: 20,
  },
  note: {
    fontSize: 20,
    color: '#000000',
    marginTop: 4,
  },
  planet: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2B31A4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
