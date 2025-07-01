import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, Image, ImageBackground, Pressable, StyleSheet, Text, View, } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming, } from 'react-native-reanimated';
const { width, height } = Dimensions.get('window');
const DOT_COUNT = 12;
const DURATION = 1000;

const wakusei_kuizu = [
  {
    id: 'mercury',
    questions: [
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
  },
  {
    id: 'venus',
    questions: [
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
  },
  {
    id: 'earth',
    questions: [
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
  },
  {
    id: 'mars',
    questions: [
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
  },
  {
    id: 'jupiter',
    questions: [
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
  },
  {
    id: 'saturn',
    questions: [
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
  },
  {
    id: 'uranus',
    questions: [
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
  },
  {
    id: 'neptune',
    questions: [
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
  },
];

const shuffleArray = (array: any[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const taiyoukei = [
  { id: 'sun', name: '太陽/sun', img: require('../../assets/images/taiyou.png'), clickable: false },
  { id: 'mercury', name: '水星/mercury', img: require('../../assets/images/suisei.png'), clickable: true },
  { id: 'venus', name: '金星/venus', img: require('../../assets/images/kinsei.png'), clickable: true },
  { id: 'earth', name: '地球/earth', img: require('../../assets/images/tikyuu.png'), clickable: true },
  { id: 'mars', name: '火星/mars', img: require('../../assets/images/kasei.png'), clickable: true },
  { id: 'jupiter', name: '木星/jupiter', img: require('../../assets/images/mokusei.png'), clickable: true },
  { id: 'saturn', name: '土星/saturn', img: require('../../assets/images/dosei.png'), clickable: true },
  { id: 'uranus', name: '天王星/uranus', img: require('../../assets/images/tennousei.png'), clickable: true },
  { id: 'neptune', name: '海王星/neptune', img: require('../../assets/images/kaiousei.png'), clickable: true },
];






export default function KuizuScreen() {
  const router = useRouter();
  const progress = useSharedValue(0);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [clearedPlanets, setClearedPlanets] = useState<string[]>([]);

  // shuffledQuizを定義
  const [shuffledQuiz, setShuffledQuiz] = useState<typeof wakusei_kuizu[0] | null>(null);


  const planetOrder = ['earth', 'mars','venus','mercury','jupiter','saturn','uranus','neptune','80枚の惑星写真集め'];
  const nextPlanetIndex = clearedPlanets.length;
  const nextPlanet = planetOrder [nextPlanetIndex];
  
  // ここで型アサーションを追加し、nullの可能性を明示的にする
  const currentQuiz: typeof wakusei_kuizu[0] | null = shuffledQuiz;
  const currentQuestion = currentQuiz?.questions[currentQuestionIndex];
  const totalQuestions = currentQuiz?.questions?.length ?? 0;

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: DURATION, easing: Easing.out(Easing.exp) }),
      -1,
      true
    );
    const timer = setTimeout(() => setLoading(false), 2600);
    return () => clearTimeout(timer);
  }, []);

  // クイズ終了時に全問正解していれば惑星をクリア済みにする
  useEffect(() => {
    if (isQuizFinished && shuffledQuiz) {
      if (correctCount === shuffledQuiz.questions.length && shuffledQuiz.id === nextPlanet) {
        setClearedPlanets((prev) => [...prev, shuffledQuiz.id]);
      }
    }
  }, [isQuizFinished, correctCount, shuffledQuiz, nextPlanet]);


  const dotStyles = [...Array(DOT_COUNT)].map((_, i) => {
    const angle = (2 * Math.PI * i) / DOT_COUNT;
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    return useAnimatedStyle(() => ({
      transform: [
        { translateX: x * progress.value * 1000 },
        { translateY: y * progress.value * 500 },
        { scale: 1 - progress.value },
      ],
      opacity: 1 - progress.value,
    }));
  });


const handlePlanetPress = (planetId: string) => {
  const isCleared = clearedPlanets.includes(planetId);
  const isNext = planetId === nextPlanet;

  if (!isCleared && !isNext) {
    Alert.alert('まだこの惑星には挑戦できません', `次は「${nextPlanet}」に挑戦しよう！`);
    return;
  }

  const selectedQuizData = wakusei_kuizu.find((quiz) => quiz.id === planetId);
  if (selectedQuizData) {
    const shuffledQuestions = shuffleArray(selectedQuizData.questions).slice(0, 4);
    setShuffledQuiz({ id: planetId, questions: shuffledQuestions });
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
    setIsQuizFinished(false);
    setShowQuiz(true);
  }
};

  const handleOptionPress = (option: string) => {
    if (!currentQuestion || !currentQuiz) return;

    const isCorrect = option === currentQuestion.answer;
    const isLast = currentQuestionIndex + 1 === currentQuiz.questions.length;

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }

    if (isLast) {
      setIsQuizFinished(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleCloseQuiz = () => {
    setShowQuiz(false);
    setShuffledQuiz(null);
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
    setIsQuizFinished(false);
  };

  return (
    <View style={styles.container}>
      {loading && dotStyles.map((style, i) => <Animated.View key={i} style={[styles.dot, style]} />)}

      {!loading && (
        <ImageBackground
          source={
            showQuiz
              ? require('../../assets/images/kuizu_bac.png')
              : require('../../assets/images/haikei.png')
          }
          style={styles.background}
          resizeMode="cover"
        >
        <Pressable
  style={styles.mypageButtonAbsolute}
  onPress={() => router.push('/mypage')}
>
  <Text style={styles.greenText}>マイページへ</Text>
</Pressable>

          <Pressable onPress={() => router.push('/')} style={styles.button}>
            <Text style={styles.buttonText}>ホームへ戻る</Text>
          </Pressable>

          {!showQuiz && (
            <>
              <FlatList
                data={taiyoukei}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => {
                  const cleared = clearedPlanets.includes(item.id); // この惑星はクリア済みか
                  const isSun = item.id === 'sun'; // この惑星は太陽か
                  const isClickableNext = item.id === nextPlanet && item.clickable; // 次に挑戦すべき惑星でクリック可能か

                  return (
                    <Pressable
                     onPress={() => {
                     if (item.clickable && (cleared || isClickableNext)) {
                     handlePlanetPress(item.id);
                      } else if (item.clickable && !cleared && !isClickableNext) {
                      Alert.alert("この惑星には挑戦できないよ！！", `「${nextPlanet}」に挑戦しよう！`);
                      }
                       }}
                       style={styles.item}
                     >
                     {isSun || cleared ? (
                     <Image source={item.img} style={styles.waku_image} />
                    ) : (
                      <View style={[styles.waku_image, styles.blackout]} />
                     )}
                     <Text style={styles.label}>{item.name}</Text>
                   </Pressable>
                  );
                }}
              />
              <Text style={styles.centerText}>次は {nextPlanet} に挑戦しよう！</Text>
            </>
          )}

          {showQuiz && (
            <View style={styles.quizModal}>
              {isQuizFinished ? (
                <>
                  <Text style={styles.quizResultTitle}>クイズ終了！</Text>
                  <Text style={styles.quizResultText}>
                    正解数: {correctCount} / {totalQuestions}
                  </Text>
                  {correctCount === totalQuestions ? (
                    <Text style={styles.quizResultText}>おめでとう！全問正解！</Text>
                  ) : (
                    <Text style={styles.quizResultText}>残念！もう一回チャレンジしよう！</Text>
                  )}
                 <Pressable onPress={handleCloseQuiz} style={styles.retryButton}>
                   <Text style={styles.retryButtonText}>クイズページへ</Text>
                 </Pressable>
                </>
              ) : (
                <>
                  <Text style={styles.question}>{currentQuestion?.question}</Text>
                  <View style={styles.optionRow}>
                    {currentQuestion?.options.map((option, index) => (
                      <Pressable
                        key={index}
                        style={styles.optionButton}
                        onPress={() => handleOptionPress(option)}
                      >
                        <Text style={styles.optionText}>{option}</Text>
                      </Pressable>
                    ))}
                  </View>
                </>
              )}
            </View>
          )}
        </ImageBackground>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
mypageButtonAbsolute: {
  position: 'absolute',
  top: '5%',
  right: '5%',
  backgroundColor: '#00FF2B',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 10,
  zIndex: 10,
},
greenText: {
  color: '#000',
  fontWeight: 'bold',
},

  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 70,
    backgroundColor: 'white',
    top: height / 2 - 25,
    left: width / 2 - 25,
  },
  title: {
    fontSize: 16,
    color: 'black',
    backgroundColor: '#00FF2B',
    padding: 10,
    textAlign: 'center',
    position: 'absolute',
    top: '5%',
    right: '5%',
    zIndex: 2,
  },
 button: {
  backgroundColor: '#C94D89',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 10,
  alignItems: 'center',
  position: 'absolute',
  bottom: '5%',
  right: '5%',
  zIndex: 2,
},
buttonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},

  list: {
    padding: 100,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: { alignItems: 'center', margin: 10 },
  waku_image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    borderRadius: 40,
  },
  blackout: {
    backgroundColor: 'black',
    opacity: 0.8,
  },
  label: {
    marginTop: 5,
    fontSize: 14,
    color: 'white',
  },
  centerText: {
    color: 'white',
    fontSize: 24,
    marginTop: 20,
    textAlign: 'center',
    position: 'absolute',
    bottom: '20%',
  },
  quizModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  question: {
    color: 'white',
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  optionButton: {
    fontWeight:'bold',
  backgroundColor: '#8A8CB5',
  paddingVertical: 120, // 上下のpadding
  paddingHorizontal: 70,
  borderRadius: 20,
  alignItems: 'center',
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  quizResultTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  quizResultText: {
    color: 'white',
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#00FF2B',
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});