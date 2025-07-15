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
import users from "../../assets/user.json";
import { router } from "expo-router";

// Expo Googleログイン用
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

// Firebase認証用
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig"; // 自分のfirebase.ts

WebBrowser.maybeCompleteAuthSession();

export default function InstallScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "212604807081-p7fprclar8jl7af10qe89h2kig7n4fhj.apps.googleusercontent.com", // ← Google Cloud Consoleから取得
    redirectUri: "https://auth.expo.io/@liupeiyu/cosmozoom-app", // ←ここ重要！
    scopes: ["openid", "profile", "email"],
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { idToken } = response.authentication;
      const credential = GoogleAuthProvider.credential(idToken);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          setUser(userCredential.user);
          Alert.alert("Googleログイン成功", `${userCredential.user.displayName} さん`);
          router.push("/nickname"); // 任意の遷移先に変更
        })
        .catch((error) => {
          console.error("Firebaseサインイン失敗:", error);
          Alert.alert("Firebaseログイン失敗");
        });
    }
  }, [response]);

  const handleFakeLogin = () => {
    const foundUser = users.find(
      (u: { username: string; password: string }) =>
        u.username === username && u.password === password
    );

    if (foundUser) {
      router.push({
        pathname: "/nickname",
        params: { username: foundUser.username },
      });
    } else {
      Alert.alert("ログインエラー", "ユーザー名またはパスワードが間違っています");
    }
  };

  const handleGoogleLogin = async () => {
    promptAsync();
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
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%" },
  logoContainer: {
    marginTop: 180,
    alignSelf: "center",
    width: 290,
    height: 220,
  },
  formContainer: {
    position: "absolute",
    bottom: 200,
    width: "45%",
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
