import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function MyPage() {
  const [nickname, setNickname] = useState('COSMOZOON');
  const [email, setEmail] = useState('24aw0100@jec.ac.jp');
  const [editingNick, setEditingNick] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const router = useRouter();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>ホームへ戻る</Text>
      </TouchableOpacity>

      <View style={styles.profileBox}>
        <TouchableOpacity onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
        </TouchableOpacity>

        <View style={styles.infoBox}>
          {editingNick ? (
            <TextInput
              value={nickname}
              onChangeText={setNickname}
              onBlur={() => setEditingNick(false)}
              style={styles.input}
            />
          ) : (
            <>
              <Text style={styles.label}>ニックネーム：{nickname}</Text>
              <TouchableOpacity style={styles.greenButton} onPress={() => setEditingNick(true)}>
                <Text style={styles.greenText}>ニックネームを変更</Text>
              </TouchableOpacity>
            </>
          )}

          {editingEmail ? (
            <TextInput
              value={email}
              onChangeText={setEmail}
              onBlur={() => setEditingEmail(false)}
              style={styles.input}
              keyboardType="email-address"
            />
          ) : (
            <>
              <Text style={styles.label}>メールアドレス：{email}</Text>
              <TouchableOpacity style={styles.greenButton} onPress={() => setEditingEmail(true)}>
                <Text style={styles.greenText}>メールアドレスを変更</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <Text style={styles.sectionTitle}>惑星写真ホルダー</Text>
      <View style={styles.photoGrid}>
        {[...Array(10)].map((_, i) => (
          <View key={i} style={styles.photoBox} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f0ff',
  },
  backButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#3b4ef7',
    paddingVertical: 5,
    paddingHorizontal: 10,
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
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    borderWidth: 2,
    borderColor: '#aaa',
    marginRight: 16,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  infoBox: {
    flex: 1,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  greenButton: {
    backgroundColor: '#00e676',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  greenText: {
    color: '#000',
    fontWeight: 'bold',
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 6,
    marginBottom: 10,
    borderRadius: 6,
  },
});
