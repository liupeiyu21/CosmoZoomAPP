import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MyPage() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton}>
        <Text style={styles.backText}>ホームへ戻る</Text>
      </TouchableOpacity>

      <View style={styles.profileBox}>
        <View style={styles.avatarPlaceholder}></View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>ニックネーム：COSMOZOON</Text>
          <TouchableOpacity style={styles.greenButton}>
            <Text style={styles.greenText}>ニックネームを変更</Text>
          </TouchableOpacity>

          <Text style={styles.label}>メールアドレス：24aw0100@jec.ac.jp</Text>
          <TouchableOpacity style={styles.greenButton}>
            <Text style={styles.greenText}>メールアドレスを変更</Text>
          </TouchableOpacity>
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
});
