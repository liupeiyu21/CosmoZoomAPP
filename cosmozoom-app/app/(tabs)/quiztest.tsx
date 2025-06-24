import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function QuizTest() {
  const router = useRouter();

  const planets = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>テストクイズ画面</Text>

      {planets.map((planet) => (
        <TouchableOpacity
          key={planet}
          style={styles.button}
          onPress={() => router.push(`/PrizeScreen?planet=${planet}`)}
        >
          <Text style={styles.buttonText}>{planet} をクリア</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#2B31A4',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    width: 220,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
