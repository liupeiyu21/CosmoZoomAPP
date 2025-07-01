import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View>
      <Text>ホーム画面</Text>
      <Button title="クイズへ進む" onPress={() => router.push('/kuizu')} />
        <Text style={{ color: 'blue' }}>クイズへ進む</Text>
    </View>
  );
}