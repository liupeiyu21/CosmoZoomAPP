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
  Dimensions,
} from 'react-native';
import planetImages from '../constants/planetAssets';

const { width } = Dimensions.get('window');

export default function PrizeScreen() {
  const router = useRouter();
  const { planet } = useLocalSearchParams();
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const planetOrder = ['earth', 'mars','venus','mercury','jupiter','saturn','uranus','neptune'];
  const currentIndex = typeof planet === 'string' ? planetOrder.indexOf(planet) : -1;

  const nextPlanet = planetOrder[currentIndex + 1];

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

  return (
    <ImageBackground
      source={require('../../assets/background-1.png')}
      style={styles.background}
      resizeMode="cover"
    >
  
      <TouchableOpacity
        style={styles.topRightButton}
        onPress={() => {
              if (nextPlanet) {
            router.replace({
              pathname: '/kuizu',
              params: { planet: nextPlanet},
            });
          } else{
            router.replace('/(tabs)/mypage');
          }
        }
      
        }
      >
        <Text style={styles.greenTopRightText}>次の惑星のクイズへ</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.title}>おめでとう！全問正解！！</Text>

        <View style={styles.planetWrapper}>
          <Image source={selectedImage} style={styles.planetImage} />
        </View>

        <Text style={styles.subtitle}>君だけの惑星写真を手に入れたよ！</Text>
        <Text style={styles.note}>マイページの写真ホルダーに保存したよ</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/(tabs)/mypage')}
        >
          <Text style={styles.buttonText}>マイページへ</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  topRightButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    backgroundColor: '#2B31A4',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    zIndex: 10,
  },
  greenTopRightText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 22,
    color: '#000',
    marginTop: 20,
    textAlign: 'center',
  },
  note: {
    fontSize: 16,
    color: '#000',
    marginTop: 4,
    textAlign: 'center',
  },
  planetWrapper: {
    width: 160,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    backgroundColor: '#000',
    marginBottom: 20,
  },
  planetImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  button: {
    backgroundColor: '#00FF2B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
