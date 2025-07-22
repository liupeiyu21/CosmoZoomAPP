import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import planetAssets from '../constants/planetAssets';
import * as ScreenOrientation from 'expo-screen-orientation'; // 


const { width } = Dimensions.get('window');

const COLS = 3;   // 横に並べる写真の数（3〜5くらいがちょうどよい）
const GAP = 10;   // 写真ボックスの余白（単位はピクセル）

const allPlanets = [
  'mercury', 'venus', 'earth', 'mars', 'jupiter',
  'saturn', 'uranus', 'neptune', 'pluto', 'moon', 'sun'
];

const planetNameMap: Record<string, string> = {
  mercury: '水星',
  venus: '金星',
  earth: '地球',
  mars: '火星',
  jupiter: '木星',
  saturn: '土星',
  uranus: '天王星',
  neptune: '海王星',
  pluto: '冥王星',
  moon: '月',
  sun: '太陽',
};

const logo = require('../../assets/logo.png'); 

export default function MyPage() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [editNick, setEditNick] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [orderedGallery, setOrderedGallery] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    // マイページ表示時に横向きに固定
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  
    return () => {
      // 他の画面に戻るときは縦向きに戻す（必要であれば）
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        const savedName = await AsyncStorage.getItem('nickname');
        const savedEmail = await AsyncStorage.getItem('email');
        const savedImage = await AsyncStorage.getItem('imageUri');
        const savedGallery = await AsyncStorage.getItem('gallery');

        if (savedName) setNickname(savedName);
        if (savedEmail) setEmail(savedEmail);
        if (savedImage) setImageUri(savedImage);

        const gallery = savedGallery ? JSON.parse(savedGallery) : [];
        const planetBaseKeys = gallery.map((g: string) => g.split('_')[0]);
        const remaining = allPlanets.filter(p => !planetBaseKeys.includes(p));
        const totalSlots = 15;
        const withPlaceholders = [
          ...gallery,
          ...Array(Math.max(0, totalSlots - gallery.length)).fill('unknown'),
        ];

        setOrderedGallery(withPlaceholders);
      };

      loadData();
    }, [])
  );

  

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      await AsyncStorage.setItem('imageUri', uri);
    }
  };

  const handleSaveNickname = async () => {
    await AsyncStorage.setItem('nickname', nickname);
    setEditNick(false);
  };

  const handleSaveEmail = async () => {
    await AsyncStorage.setItem('email', email);
    setEditEmail(false);
  };

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.headerRow}>
  <TouchableOpacity onPress={() => router.push('/(tabs)/mypage')}>
    <Image source={logo} style={styles.logo} resizeMode="contain" />
  </TouchableOpacity>
  <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.push("/kuizu")}>
              <Text style={styles.backText}>クイズへ戻る</Text>
            </TouchableOpacity>
            
          </View>
        </View>

        <View style={styles.profileBox}>
          <View style={styles.avatarWrapper}>
            <TouchableOpacity onPress={pickImage}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.avatar} />
              ) : (
                <View style={styles.avatar} />
              )}
            </TouchableOpacity>
            <Text style={styles.avatarHint}>タップして変更</Text>
          </View>

          <View style={styles.infoBox}>
            {editNick ? (
              <>
                <TextInput
                  value={nickname}
                  onChangeText={setNickname}
                  style={styles.inputField}
                />
                <TouchableOpacity style={styles.greenButton} onPress={handleSaveNickname}>
                  <Text style={styles.greenText}>保存</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.label}>ニックネーム：{nickname || '未設定'}</Text>
                <TouchableOpacity style={styles.greenButton} onPress={() => setEditNick(true)}>
                  <Text style={styles.greenText}>ニックネームを変更</Text>
                </TouchableOpacity>
              </>
            )}

            {editEmail ? (
              <>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  style={styles.inputField}
                  keyboardType="email-address"
                />
                <TouchableOpacity style={styles.greenButton} onPress={handleSaveEmail}>
                  <Text style={styles.greenText}>保存</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.label}>メールアドレス：{email || '未設定'}</Text>
                <TouchableOpacity style={styles.greenButton} onPress={() => setEditEmail(true)}>
                  <Text style={styles.greenText}>メールアドレスを変更</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <Text style={styles.sectionTitle}>惑星写真ホルダー</Text>
        <View style={styles.photoGrid}>
          {orderedGallery.map((planetKey, index) => {
            if (planetKey === 'unknown') {
              return (
                <View key={index} style={styles.photoBox}>
                  <View style={styles.unknownBox}>
                    <Text style={styles.unknownText}>
                      ここにはどんな{'\n'}惑星が入るかな
                    </Text>
                  </View>
                </View>
              );
            }

            const [planetName, imgIndexStr] = planetKey.split('_');
            const imgIndex = parseInt(imgIndexStr, 10);
            const image = planetAssets[planetName]?.[imgIndex];

            return (
              <View key={index} style={styles.photoBox}>
                {image ? (
                  <>
                    <Image source={image} style={styles.planetImage} />
                    <Text style={styles.planetName}>{planetNameMap[planetName]}</Text>
                  </>
                ) : (
                  <View style={styles.unknownBox}>
                    <Text style={styles.unknownText}>画像なし</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
    paddingHorizontal: 65, // ← ★ 左右に余白（中央寄せ効果）
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 40,
  },
  logo: {
    // paddingTop: 40,
    // left: -30,
    height: 0,
    width: 160,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#2B31A4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  backText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  profileBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    borderWidth: 2,
    borderColor: '#ccc',
  },
  avatarHint: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  infoBox: {
    flex: 1,
    paddingLeft: 10,
    minWidth: 250,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },
  greenButton: {
    backgroundColor: '#00FF2B',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  greenText: {
    color: '#000',
    fontWeight: 'bold',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 6,
    marginBottom: 6,
    borderRadius: 6,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: GAP,
    // paddingHorizontal: 20,        // ← 左右に余白を追加（必要に応じて調整）
  },
  photoBox: {
    width: `${100 / COLS - 2}%`,
    aspectRatio: 1,
    alignItems: 'center',
  },
  planetImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'cover',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  planetName: {
    marginTop: 6,
    fontSize: 19,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  unknownBox: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unknownText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
});
