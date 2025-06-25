import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const quizData = {
  mercury: [
    {
      question: '水星は太陽から何番目の惑星でしょう？',
      options: ['7番目', '5番目', '3番目', '1番目'],
      answer: '1番目',
    },
    {
      question: '水星の重さはどのくらいでしょう？',
      options: ['3.3×10²³kg', '50000kg', '10³kg', '10kg'],
      answer: '3.3×10²³kg',
    },
    {
      question: '水星の大きさはどのくらいでしょう？',
      options: ['4,880km', '678km', '200km', '1km'],
      answer: '4,880km',
    },
    {
      question: '水星の平均気温は何度でしょう？',
      options: ['20℃', '167℃', '-5000℃', '100℃'],
      answer: '167℃',
    },
    {
      question: '水星の特徴はどれでしょう？',
      options: ['温度差が激しい', '水で出来てる', '宇宙人が住んでる', '人が住める'],
      answer: '温度差が激しい',
    },
  ],
  venus: [
    {
      question: '金星は太陽から何番目の惑星でしょう？',
      options: ['5番目', '2番目', '3番目', '7番目'],
      answer: '2番目',
    },
    {
      question: '金星の重さはどのくらいでしょう？',
      options: ['2t', '4.87 × 10²⁴kg', '3kg', '6000kg'],
      answer: '4.87 × 10²⁴kg',
    },
    {
      question: '金星の大きさはどのくらいでしょう？',
      options: ['12,104km', '6km', '4000km', '1km'],
      answer: '12,104km',
    },
    {
      question: '金星の平均気温は何度でしょう？',
      options: ['50℃', '16℃', '464℃', '1000℃'],
      answer: '464℃',
    },
    {
      question: '金星の特徴はどれでしょう？',
      options: ['金で出来てる', '回る向きが違う', '氷がある', '衛星がある'],
      answer: '回る向きが違う',
    },
  ],
  earth: [
    {
      question: '地球は太陽から何番目の惑星でしょう？',
      options: ['6番目', '5番目', '3番目', '0番目'],
      answer: '3番目',
    },
    {
      question: '地球の重さはどのくらいでしょう？',
      options: ['800kg', '10²⁴kg', '5.97×10²⁴kg', '60kg'],
      answer: '5.97×10²⁴kg',
    },
    {
      question: '地球の大きさはどのくらいでしょう？',
      options: ['12km', '6km', '400km', '12,742km'],
      answer: '12,742km',
    },
    {
      question: '地球の平均気温は何度でしょう？',
      options: ['15℃', '50℃', '100℃', '10000℃'],
      answer: '15℃',
    },
    {
      question: '地球の特徴はどれでしょう？',
      options: ['水がある', '宇宙人がいる', 'ガスで出来てる', '危険な惑星'],
      answer: '水がある',
    },
  ],
  mars: [
    {
      question: '火星は太陽から何番目の惑星でしょう？',
      options: ['1番目', '4番目', '6番目', '7番目'],
      answer: '4番目',
    },
    {
      question: '火星の重さはどのくらいでしょう？',
      options: ['220kg', '200kg', '5t', '6.42×10²³kg'],
      answer: '6.42×10²³kg',
    },
    {
      question: '火星の大きさはどのくらいでしょう？',
      options: ['10000km', '3km', '6,779km', '4000km'],
      answer: '6,779km',
    },
    {
      question: '火星の平均気温は何度でしょう？',
      options: ['5℃', '-63℃', '100℃', '70℃'],
      answer: '-63℃',
    },
    {
      question: '火星の特徴はどれでしょう？',
      options: ['重力がない', '植物が生えてる', '宇宙人が住んでる', '水があった'],
      answer: '水があった',
    },
  ],
  jupiter: [
    {
      question: '木星は太陽から何番目の惑星でしょう？',
      options: ['5番目', '2番目', '8番目', '6番目'],
      answer: '5番目',
    },
    {
      question: '木星の重さはどのくらいでしょう？',
      options: ['20000kg', '800kg', '1.90×10²⁷kg', '5t'],
      answer: '1.90×10²⁷kg',
    },
    {
      question: '木星の大きさはどのくらいでしょう？',
      options: ['70km', '400000km', '139,820km', '1000km'],
      answer: '139,820km',
    },
    {
      question: '木星の平均気温は何度でしょう？',
      options: ['15℃', '-3℃', '-100℃', ' -145℃'],
      answer: ' -145℃',
    },
    {
      question: '木星の特徴はどれでしょう？',
      options: ['木で出来てる', 'ガスで出来てる', '一番小さい', '四角形'],
      answer: 'ガスで出来てる',
    },
  ],
  saturn: [
    {
      question: '土星は太陽から何番目の惑星でしょう？',
      options: ['5番目', '7番目', '8番目', '6番目'],
      answer: '6番目',
    },
    {
      question: '土星の重さはどのくらいでしょう？',
      options: ['20kg', '5.68×10²⁶kg', '40²⁷kg', '65t'],
      answer: '5.68×10²⁶kg',
    },
    {
      question: '土星の大きさはどのくらいでしょう？',
      options: ['1646km', '460km', '130km', '116,460km'],
      answer: '116,460km',
    },
    {
      question: '土星の平均気温は何度でしょう？',
      options: ['1℃', '-178℃', '-256℃', ' -10℃'],
      answer: '-178℃',
    },
    {
      question: '土星の特徴はどれでしょう？',
      options: ['動物がいる', '赤色の惑星', 'リングがある', '山がある'],
      answer: 'リングがある',
    },
  ],
  uranus: [
    {
      question: '天王星は太陽から何番目の惑星でしょう？',
      options: ['1番目', '7番目', '9番目', '8番目'],
      answer: '7番目',
    },
    {
      question: '天王星の重さはどのくらいでしょう？',
      options: ['8.68×10²⁵kg', '6700kg', '770²kg', '6kg'],
      answer: '8.68×10²⁵kg',
    },
    {
      question: '天王星の大きさはどのくらいでしょう？',
      options: ['7800km', '4000km', '630km', '50,724km'],
      answer: '50,724km',
    },
    {
      question: '天王星の平均気温は何度でしょう？',
      options: ['0℃', '-200℃', '-224℃', ' 80℃'],
      answer: '-224℃',
    },
    {
      question: '天王星の特徴はどれでしょう？',
      options: ['縦方向で回っている', '生命がいる', '気温が100度', '山がある'],
      answer: '縦方向で回っている',
    },
  ],
  neptune: [
    {
      question: '海王星は太陽から何番目の惑星でしょう？',
      options: ['5番目', '7番目', '6番目', '8番目'],
      answer: '8番目',
    },
    {
      question: '海王星の重さはどのくらいでしょう？',
      options: ['10.68×10²⁵kg', '6700kg', '70kg', '1.02×10²⁶kg'],
      answer: '1.02×10²⁶kg',
    },
    {
      question: '海王星の大きさはどのくらいでしょう？',
      options: ['7800km', '49,244km', '60km', '524km'],
      answer: '49,244km',
    },
    {
      question: '海王星の平均気温は何度でしょう？',
      options: ['-214℃', '-200℃', '-24℃', ' 0℃'],
      answer: '-214℃',
    },
    {
      question: '海王星の特徴はどれでしょう？',
      options: ['王様が住んでいる', '海がある', '緑色の惑星', 'ダイヤが降る'],
      answer: 'ダイヤが降る',
    },
  ],
};

export default function KuizuScreen() {
  const router = useRouter();
  const [currentPlanet, setCurrentPlanet] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handlePlanetStart = (planet) => {
    setCurrentPlanet(planet);
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
    setIsFinished(false);
  };

  const handleAnswer = (option) => {
    const question = quizData[currentPlanet][currentQuestionIndex];
    const isCorrect = option === question.answer;

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }

    const isLast = currentQuestionIndex + 1 === quizData[currentPlanet].length;

    if (!isLast) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      const total = quizData[currentPlanet].length;
      const finalScore = isCorrect ? correctCount + 1 : correctCount;

      setIsFinished(true);

      if (finalScore === total) {
        router.push(`/PrizeScreen?planet=${currentPlanet}`);
      } else {
        router.push({
          pathname: '/(tabs)/FailScreen',
          params: {
            planet: currentPlanet,
            score: String(finalScore),
            total: String(total),
          },
        });
      }
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/background-1.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.wrapper}>
        {!currentPlanet ? (
          <>
            <Text style={styles.pageTitle}>惑星のクイズ</Text>
            <View style={styles.planetSelect}>
              {Object.keys(quizData).map((planet) => (
                <Pressable
                  key={planet}
                  style={styles.planetButton}
                  onPress={() => handlePlanetStart(planet)}
                >
                  <Text style={styles.buttonText}>{planet} を始める</Text>
                </Pressable>
              ))}
            </View>
          </>
        ) : isFinished ? (
          <>
            <Text style={styles.title}>全問正解じゃなかった… 😢</Text>
            <Pressable
              style={styles.retryButton}
              onPress={() => handlePlanetStart(currentPlanet)}
            >
              <Text style={styles.retryButtonText}>もう一回チャレンジ</Text>
            </Pressable>
            <Pressable
              style={styles.backButton}
              onPress={() => setCurrentPlanet(null)}
            >
              <Text style={styles.backButtonText}>ホームへ戻る</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.pageTitle}>惑星のクイズ</Text>
            <Text style={styles.title}>
              {quizData[currentPlanet][currentQuestionIndex].question}
            </Text>
            <View style={styles.optionRow}>
              {quizData[currentPlanet][currentQuestionIndex].options.map((opt) => (
                <Pressable
                  key={opt}
                  style={styles.optionButton}
                  onPress={() => handleAnswer(opt)}
                >
                  <Text style={styles.optionText}>{opt}</Text>
                </Pressable>
              ))}
            </View>
            <Pressable
              style={styles.backButton}
              onPress={() => setCurrentPlanet(null)}
            >
              <Text style={styles.backButtonText}>ホームへ戻る</Text>
            </Pressable>
          </>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 60,
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#8A8CB5',
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderRadius: 12,
    margin: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  planetSelect: {
    marginTop: 20,
    gap: 10,
  },
  planetButton: {
    backgroundColor: '#8A8CB5',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  retryButton: {
    backgroundColor: '#8A8CB5',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#C94D89',
    padding: 10,
    borderRadius: 8,
    marginTop: 30,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});