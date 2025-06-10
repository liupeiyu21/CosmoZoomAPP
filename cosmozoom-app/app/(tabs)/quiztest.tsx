import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function QuizTest() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>テストクイズ画面</Text>

      {['mercury', 'venus', 'earth', 'mars'].map((planet) => (
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
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2B31A4',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});