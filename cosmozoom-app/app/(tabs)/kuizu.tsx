import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const DOT_COUNT = 12;
const DURATION = 1000;


const wakusei_kuizu=[
    {id:"mercury",
        questions:[
            {
                question: '水星は太陽から何番目の惑星でしょう？',
                options: ['7番目', '5番目', '3番目','1番目'],
                answer: '1番目',
            },
            {
                question: '水星の重さはどのくらいでしょう？',
                options: ['3.3×10²³kg', '50000kg', '10³kg','10kg'],
                answer: '3.3×10²³kg',
            },
            {
                question:'水星の大きさはどのくらいでしょう？',
                options:['4,880km','678km','200km','1km'],
                answer:'4,880km',
            },
            {
                question:'水星の平均気温は何度でしょう？',
                options:['20℃','167℃','-5000℃','100℃'],
                answer:'167℃',
            }]},
            {id:"venus",
                 questions:[
            {
                question: '金星は太陽から何番目の惑星でしょう？',
                options: ['5番目', '2番目', '3番目','7番目'],
                answer: '2番目',
            },
            {
                question: '金星の重さはどのくらいでしょう？',
                options: ['2t', '4.87 × 10²⁴kg', '3kg','6000kg'],
                answer: '4.87 × 10²⁴kg',
            },
            {
                question:'金星の大きさはどのくらいでしょう？',
                options:['12,104km','6km','4000km','1km'],
                answer:'12,104km',
            },
            {
                question:'金星の平均気温は何度でしょう？',
                options:['50℃','16℃','464℃','1000℃'],
                answer:'464℃',
            }]},
            {id:"earth",
                questions:[
            {
                question: '地球は太陽から何番目の惑星でしょう？',
                options: ['6番目', '5番目', '3番目','0番目'],
                answer: '3番目',
            },
            {
                question: '地球の重さはどのくらいでしょう？',
                options: ['800kg', '10²⁴kg', '5.97×10²⁴kg','60kg'],
                answer: '5.97×10²⁴kg',
            },
            {
                question:'地球の大きさはどのくらいでしょう？',
                options:['12km','6km','400km','12,742km'],
                answer:'12,742km',
            },
            {
                question:'地球の平均気温は何度でしょう？',
                options:['15℃','50℃','100℃','10000℃'],
                answer:'15℃',
            }]},
            {id:"mars",
                questions:[
            {
                question: '火星は太陽から何番目の惑星でしょう？',
                options: ['1番目', '4番目', '6番目','4番目'],
                answer: '4番目',
            },
            {
                question: '火星の重さはどのくらいでしょう？',
                options: ['220kg', '200kg', '5t','6.42×10²³kg'],
                answer: '6.42×10²³kg',
            },
            {
                question:'火星の大きさはどのくらいでしょう？',
                options:['10000km','3km','6,779km','4000km'],
                answer:'6,779km',
            },
            {
                question:'火星の平均気温は何度でしょう？',
                options:['5℃','-63℃','100℃','70℃'],
                answer:'-63℃',
            }]},
            {id:"jupiter",
                questions:[
            {
                question: '木星は太陽から何番目の惑星でしょう？',
                options: ['5番目', '2番目', '8番目','6番目'],
                answer: '5番目'
            },
            {
                question: '木星の重さはどのくらいでしょう？',
                options: ['20000kg', '800kg', '1.90×10²⁷kg','5t'],
                answer: '1.90×10²⁷kg',
            },
            {
                question:'木星の大きさはどのくらいでしょう？',
                options:['70km','400000km','139,820km','1000km'],
                answer:'139,820km',
            },
            {
                question:'木星の平均気温は何度でしょう？',
                options:['15℃','-3℃','-100℃',' -145℃'],
                answer:' -145℃',
            }]},
            {id:"saturn",
                questions:[
            {
                question: '土星は太陽から何番目の惑星でしょう？',
                options: ['5番目', '7番目', '8番目','6番目'],
                answer: '6番目'
            },
            {
                question: '土星の重さはどのくらいでしょう？',
                options: ['20kg', '5.68×10²⁶kg', '40²⁷kg','65t'],
                answer: '5.68×10²⁶kg',
            },
            {
                question:'土星の大きさはどのくらいでしょう？',
                options:['1646km','460km','130km','116,460km'],
                answer:'116,460km',
            },
            {
                question:'土星の平均気温は何度でしょう？',
                options:['1℃','-178℃','-256℃',' -10℃'],
                answer:'-178℃',
            }]},
            {id:"uranus",
                questions:[
            {
                question: '天王星は太陽から何番目の惑星でしょう？',
                options: ['1番目', '7番目', '9番目','8番目'],
                answer: '7番目'
            },
            {
                question: '天王星の重さはどのくらいでしょう？',
                options: ['8.68×10²⁵kg', '6700kg', '770²kg','6kg'],
                answer: '8.68×10²⁵kg',
            },
            {
                question:'天王星の大きさはどのくらいでしょう？',
                options:['7800km','4000km','630km','50,724km'],
                answer:'50,724km',
            },
            {
                question:'天王星の平均気温は何度でしょう？',
                options:['0℃','-200℃','-224℃',' 80℃'],
                answer:'-224℃',
            }]},
            {id:"neptune",
                questions:[
            {
                question: '海王星は太陽から何番目の惑星でしょう？',
                options: ['5番目', '7番目', '6番目','8番目'],
                answer: '8番目'
            },
            {
                question: '海王星の重さはどのくらいでしょう？',
                options: ['10.68×10²⁵kg', '6700kg', '70kg','1.02×10²⁶kg'],
                answer: '1.02×10²⁶kg',
            },
            {
                question:'海王星の大きさはどのくらいでしょう？',
                options:['7800km','49,244km','60km','524km'],
                answer:'49,244km',
            },
            {
                question:'海王星の平均気温は何度でしょう？',
                options:['-214℃','-200℃','-24℃',' 0℃'],
                answer:'-214℃',
            }]},
];
const taiyoukei = [
  { id: 'sun', name: '太陽', img: require('../../assets/images/taiyou.png'), clickable: false },
  { id: 'mercury', name: '水星', img: require('../../assets/images/suisei.png'), clickable: true },
  { id: 'venus', name: '金星', img: require('../../assets/images/kinsei.png'), clickable: true },
  { id: 'earth', name: '地球', img: require('../../assets/images/tikyuu.png'), clickable: true },
  { id: 'mars', name: '火星', img: require('../../assets/images/kasei.png'), clickable: true },
  { id: 'jupiter', name: '木星', img: require('../../assets/images/mokusei.png'), clickable: true },
  { id: 'saturn', name: '土星', img: require('../../assets/images/dosei.png'), clickable: true },
  { id: 'uranus', name: '天王星', img: require('../../assets/images/tennousei.png'), clickable: true },
  { id: 'neptune', name: '海王星', img: require('../../assets/images/kaiousei.png'), clickable: true },
];


export default function KuizuScreen() {
  const router = useRouter();
  const progress = useSharedValue(0);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [clearedPlanets, setClearedPlanets] = useState<string[]>([]);

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
    setIsQuizFinished(false);
  };


  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: DURATION, easing: Easing.out(Easing.exp) }),
      -1,
      true
    );
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

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

  const currentQuiz = wakusei_kuizu.find(q => q.id === selectedPlanetId);
  const currentQuestion = currentQuiz?.questions[currentQuestionIndex];

  const handleOptionPress = (option: string) => {
    if (!currentQuestion || !currentQuiz) return;
    const isCorrect = option === currentQuestion.answer;
    if (isCorrect) setCorrectCount(prev => prev + 1);

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < currentQuiz.questions.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      setIsQuizFinished(true);
      if (isCorrect && correctCount + 1 === currentQuiz.questions.length) {
        setClearedPlanets(prev => [...prev, currentQuiz.id]);
      }
    }
  };

  const handleCloseQuiz = () => {
    setShowQuiz(false);
    setSelectedPlanetId(null);
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
    setIsQuizFinished(false);
  };
  const totalQuestions = currentQuiz?.questions?.length ?? 0;
  return (
    <View style={styles.container}>
      {loading &&
        dotStyles.map((style, i) => (
          <Animated.View key={i} style={[styles.dot, style]} />
        ))}

      {!loading && (
        <ImageBackground
          source={require('../../assets/images/haikei.png')}
          style={styles.background}
          resizeMode="cover"
        >
          <Text style={styles.title}>マイページ</Text>

          <Pressable onPress={() => router.push('/')} style={styles.button}>
            <Text style={styles.buttonText}>ホームへ戻る</Text>
          </Pressable>

          {/* 惑星選択 */}
          {!showQuiz && (
            <FlatList
              data={taiyoukei}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => {
                const cleared = clearedPlanets.includes(item.id);
                return (
                  <Pressable
                    onPress={() => {
                      if (item.clickable) {
                        setSelectedPlanetId(item.id);
                        setShowQuiz(true);
                      }
                    }}
                    style={styles.item}
                  >
                    {item.id === 'sun' || cleared ? (
                      <Image source={item.img} style={styles.waku_image} />
                    ) : (
                      <View style={[styles.waku_image, styles.blackout]} />
                    )}
                    <Text style={styles.label}>{item.name}</Text>
                  </Pressable>
                );
              }}
            />
          )}

          {/* クイズ表示 */}
          {showQuiz && (
            <View style={styles.quizModal}>
              {isQuizFinished ? (
                <>
                 {/* <Text style={styles.quizText}>
                 {correctCount === totalQuestions
                  ? 'おめでとう！\n全問正解!'
                  : correctCount >= Math.ceil(totalQuestions * 0.75)
                  ? `惜しい！\n${correctCount}/${totalQuestions} 正解！！\nもう一回チャレンジしよう!`
                  : `残念！！\n${correctCount}/${totalQuestions} 正解！！\nもう一回チャレンジしよう!`}
                </Text> */}

                  {correctCount !== currentQuiz?.questions.length && (
                    <Pressable onPress={handleRetry} style={styles.retryButton}>
                      <Text style={styles.retryButtonText}>もう一回</Text>
                    </Pressable>
                    
                  )}
                </>
              ) : (
                currentQuestion && (
                  <>
                    <Text style={styles.quizText}>{currentQuestion.question}</Text>
                    <View style={styles.optionRow}> {/* 横並び用ラッパーを追加 */}
                     {currentQuestion.options.map((opt, index) => (
                    <Pressable
                    key={index}
                    onPress={() => handleOptionPress(opt)}
                    style={styles.optionButton} >
                   <Text style={styles.optionText}>{opt}</Text>
                   </Pressable>
                  ))}
                  </View>
                  </>
                ))}</View>)}</ImageBackground>)}</View> );
}

  const styles = StyleSheet.create({
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
    padding: 10,
    width: 150,
    alignItems: 'center',
    position: 'absolute',
    bottom: '5%',
    right: '5%',
    zIndex: 2,
  },
  buttonText: {
     color: 'white',
     fontSize: 16,
     fontWeight: 'bold' 
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
    backgroundColor: 'black'
   },
  label: { 
    marginTop: 5, 
    fontSize: 14, 
    color: 'white' 
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
  },
  quizText: {
    color: 'white',
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
optionRow: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: 40,
},
optionButton: {
  backgroundColor: '#444',
paddingVertical: 120, // 上下のpadding
paddingHorizontal: 70,
  borderRadius: 20,
  alignItems: 'center',
},
  optionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#00FF2B',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  nextButtonText: {
    color: 'black',
    fontSize: 16,
  },
  retryButton: {
  backgroundColor: '#00FF2B',
  marginTop: 10,
  padding: 10,
    width: 150,
    alignItems: 'center',
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    zIndex: 2,
},
retryButtonText: {
  backgroundColor: '#00FF2B',
  fontSize: 16,
  fontWeight: 'bold'
},
});