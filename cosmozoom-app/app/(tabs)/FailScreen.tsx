import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function FailScreen() {
  const { score = '0', total = '4', planet } = useLocalSearchParams();
  const router = useRouter();

  const scoreNum = parseInt(score as string, 10);
  const totalNum = parseInt(total as string, 10);

  const message = () => {
    if (scoreNum === 3) return `惜しい！！\n${scoreNum}/${totalNum}正解！！`;
    return `残念！！\n${scoreNum}/${totalNum}正解！！\nもう一回チャレンジしよう！`;
  };

  return (
    <ImageBackground
      source={require('../../assets/background-2.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>{message()}</Text>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#2B31A4' }]}
            onPress={() => router.replace('/(tabs)/index')}
          >
            <Text style={styles.buttonText}>ホームに戻る</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#00FF2B' }]}
            onPress={() =>
              router.replace({
                pathname: '/quiz', // заміни на свій реальний маршрут до квізу
                params: { planet },
              })
            }
          >
            <Text style={[styles.buttonText, { color: '#000' }]}>もう一回</Text>
          </TouchableOpacity>
        </View>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultBox: {
    backgroundColor: '#D64E8A',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  resultText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    whiteSpace: 'pre-line',
  },
  buttons: {
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
