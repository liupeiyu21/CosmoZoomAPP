import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import planetImages from '../constants/planetAssets';

export default function PrizeScreen() {
  const router = useRouter();
  const { planet } = useLocalSearchParams();
  const [selectedImage, setSelectedImage] = useState<any>(null);

  useEffect(() => {
    if (planet && typeof planet === 'string') {
      const planetKey = planet.toLowerCase();
      const imageList = planetImages[planetKey];

      if (imageList && imageList.length > 0) {
        const randomIndex = Math.floor(Math.random() * imageList.length);
        const selected = imageList[randomIndex];
        setSelectedImage(selected);
        saveToGallery(planetKey, randomIndex);
      }
    }
  }, [planet]);

  const saveToGallery = async (planetId: string, index: number) => {
    try {
      const key = `${planetId}_${index}`;
      const existing = await AsyncStorage.getItem('gallery');
      const gallery = existing ? JSON.parse(existing) : [];

      if (!gallery.includes(key)) {
        gallery.push(key);
        await AsyncStorage.setItem('gallery', JSON.stringify(gallery));
        console.log(`✅ Saved: ${key}`);
      } else {
        console.log(`ℹ️ Already exists: ${key}`);
      }
    } catch (e) {
      console.log('❌ Error saving to gallery:', e);
    }
  };

  // РОЗКОМЕНТУЙ ЦЕ ДЛЯ ТЕСТУ, щоб очистити всю галерею
  /*
  useEffect(() => {
    const clearCache = async () => {
      await AsyncStorage.clear();
      console.log('🧹 AsyncStorage cleared');
    };
    clearCache();
  }, []);
  */

  return (
    <ImageBackground
      source={require('../../assets/background-1.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>おめでとう！全問正解！！</Text>

        {selectedImage && (
          <Image source={selectedImage} style={styles.planet} />
        )}

        <Text style={styles.subtitle}>君だけの惑星写真を手に入れたよ！</Text>
        <Text style={styles.note}>マイページの写真ホルダーに保存したよ</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/(tabs)/mypage')}
        >
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
    color: '#000',
    marginTop: 20,
  },
  note: {
    fontSize: 18,
    color: '#000',
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
