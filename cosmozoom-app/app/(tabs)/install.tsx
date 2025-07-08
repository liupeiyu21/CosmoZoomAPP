import { GoogleSignin } from "@react-native-google-signin/google-signin";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// @ts-ignore: JSON読み込みのため
import users from "../../assets/user.json";

import { router } from "expo-router";

export default function InstallScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [islogin, setIsLogin] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
    });
  }, []);

  const handleFakeLogin = () => {
    console.log("ログインボタンが押されました");
    const foundUser = users.find(
      (u: { username: string; password: string }) =>
        u.username === username && u.password === password
    );

    if (foundUser) {
      console.log("ログイン成功");
      router.push({
        pathname: "/nickname",
        params: { username: foundUser.username },
      });
      // 🔁 必要に応じて画面遷移など
    } else {
      console.log("エラー", "ユーザー名またはパスワードが間違っています");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      Alert.alert("Googleログイン成功");
    } catch (error) {
      Alert.alert("Googleログイン失敗", "もう一度お試しください");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/login_background.png")}
      style={styles.background}
    >
      <ImageBackground
        source={require("../../assets/images/icon.png")}
        style={styles.logoContainer}
        resizeMode="contain"
      />

        <View style={styles.formContainer}>
          <TextInput
            placeholder="ユーザー名"
            value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="パスワード"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleFakeLogin}>
          <Text style={styles.loginText}>ユーザー名でログイン</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.loginButton, styles.googleButton]}
          onPress={handleGoogleLogin}
        >
          <Text style={[styles.loginText, { color: "white" }]}>
            Google でログイン
          </Text>
        </TouchableOpacity>{" "}
        {islogin && (
          <View>
        
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%" },
  logoContainer: {
    marginTop: 70,
    alignSelf: "center",
    width: 420, // ← お好みでサイズ調整
    height: 220, // ← お好みでサイズ調整
  },
  logoText: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  formContainer: {
    position: "absolute",
    bottom: 100,
    width: "20%",
    alignSelf: "center",
  },
  input: {
    height: 45,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    fontSize: 15,
  },
  loginButton: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: "center",
    marginBottom: 10,
    elevation: 2,
  },
  googleButton: {
    backgroundColor: "#4285F4",
  },
  loginText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
