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


// Expo Googleログイン用
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";



// Firebase認証用
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig"; // 自分のfirebase.ts
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

import type { User } from "firebase/auth";

export default function InstallScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "212604807081-p7fprclar8jl7af10qe89h2kig7n4fhj.apps.googleusercontent.com",
    redirectUri: "https://auth.expo.io/@liupeiyu/cosmozoom-app",
    scopes: ["openid", "profile", "email"],
    selectAccount: true,
  });

useEffect(() => {
  console.log("✅ useEffect内のresponse:", response); 

  if (response?.type === "success") {
    console.log("🔽 Google認証レスポンス:", JSON.stringify(response, null, 2)); // ← ★ ここを追加

    const idToken = response.authentication?.idToken;
    if (idToken) {
      const credential = GoogleAuthProvider.credential(idToken);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          setUser(userCredential.user);
          Alert.alert("Googleログイン成功", `${userCredential.user.displayName} さん`);
          router.push("/nickname");
        })
        .catch((error) => {
          console.error("🔥 Firebaseサインイン失敗:", error);
          Alert.alert("Firebaseログイン失敗");
        });
    } else {
      Alert.alert("Google認証失敗", "IDトークンが取得できませんでした");
    }
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
    console.log("🟢 Googleログイン開始"); 
    const result = await promptAsync(); // ← ✅ これが重要
    console.log("🔁 promptAsync の結果:", result);
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
