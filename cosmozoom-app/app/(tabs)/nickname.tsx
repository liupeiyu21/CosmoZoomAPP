import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from "expo-router";
import { router } from 'expo-router';

export default function NicknameScreen() {
  const { username } = useLocalSearchParams(); // ← install.tsxから受け取る
  const [nickname, setNickname] = useState('');

  const handleNext = () => {
    if (!nickname.trim()) {
      Alert.alert('エラー', 'ニックネームを入力してください');
      return;
    }
    console.log(`ユーザー: ${username} さんのニックネームは ${nickname} です`);
    // 🔁 次の画面に遷移したい場合はここで router.push() を使用
    router.push({
      pathname: '/home',
      params: { username, nickname }, // nicknameも渡す
    });
  };

  return (
    <ImageBackground
      source={require('../../assets/images/login_background.png')}
      style={styles.background}
    //   resizeMode="cover"
    >
      <Text style={styles.title}>
        {username} さん、{"\n"}ニックネームは{"\n"}なんですか？
      </Text>

      <TextInput
        style={styles.input}
        placeholder="ニックネームを書いてください"
        placeholderTextColor="#333"
        value={nickname}
        onChangeText={setNickname}
      />

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>次</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { 
    flex: 1,
    paddingTop: 150,
    width: "100%",
    height: "100%",
    alignItems: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 60,
  },
  input: {
    backgroundColor: '#fff',

    width: '30%',
    height: 60,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 5,
    borderColor: '#db5c97',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  nextButton: {
    width: 100,
    height: 100,
    backgroundColor: '#c04a80',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 60,
    right: 30,
    elevation: 5,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
