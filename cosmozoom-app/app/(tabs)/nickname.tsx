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
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NicknameScreen() {
  const { username } = useLocalSearchParams(); // install.tsx から受け取る
  const [nickname, setNickname] = useState('');

  const handleNext = async () => {
    Alert.alert('お知らせ','これから画面が横にまる');
    if (!nickname.trim()) {
      Alert.alert('エラー', 'ニックネームを入力してください');
      return;
    }

    try {
      // ニックネームを AsyncStorage に保存
      await AsyncStorage.setItem('nickname', nickname);

      console.log(`ユーザー: ${username} さんのニックネームは ${nickname} です`);

      // 次の画面へ遷移
      router.push({
        pathname: '/home',
        params: { username, nickname }, // nickname も渡す
      });

    } catch (error) {
      console.error('ニックネーム保存失敗:', error);
      Alert.alert('エラー', 'ニックネームの保存に失敗しました');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/login_background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <Text style={styles.title}>
        {username} さん、{"\n"}ニックネームは{"\n"}なんですか？
      </Text>

      <TextInput
        style={styles.input}
        placeholder="ニックネームを書いてください"
        placeholderTextColor="#bbb"
        value={nickname}
        onChangeText={setNickname}
      />

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>スタート</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { 
    flex: 1,
    // paddingTop: 150,
    width: "100%",
    height: "100%",
    alignItems: 'center'
  },
  title: {
    fontSize: 32,
    paddingTop: 245,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 60,
  },
  input: {
    backgroundColor: '#fff',
  
    width: '70%',
    height: 70,
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
