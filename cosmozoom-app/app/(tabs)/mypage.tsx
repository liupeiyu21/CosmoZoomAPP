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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function MyPage() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [editNick, setEditNick] = useState(false);
  const [editEmail, setEditEmail] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const savedName = await AsyncStorage.getItem('nickname');
      const savedEmail = await AsyncStorage.getItem('email');
      const savedImage = await AsyncStorage.getItem('imageUri');
      if (savedName) setNickname(savedName);
      if (savedEmail) setEmail(savedEmail);
      if (savedImage) setImageUri(savedImage);
    };
    loadData();
  }, []);

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
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>ホームへ戻る</Text>
        </TouchableOpacity>

        <View style={styles.profileBox}>
          <View style={{ alignItems: 'center', marginRight: 16 }}>
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
          {[...Array(12)].map((_, i) => (
            <View key={i} style={styles.photoBox} />
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    padding: 20,
  },
  backButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#2B31A4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  backText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  profileBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
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
    width: 250,
    maxWidth: '100%',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  photoBox: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 10,
  },
});
