import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
//view画面のレイアウト　textは文字の表示 stylesheetはスタイルの設定(CSSのようなもの)
// TouchableOpacityタップできるボタンや領域を作る。Dimensionsデバイスのサイズ情報を取得するためのAPIです。
//TouchableWithoutFeedbackタップできる領域を作るが、タップ時の視覚的な変化（エフェクト）は何も起きないコンポーネントです。カスタムなタップ処理をしたいときに使います。
import Svg, { Ellipse } from "react-native-svg";
//SVG描画の「親」コンポーネントです。これで「ここからここまでがSVGの領域ですよ」と指定します。

import {
  GestureHandlerRootView,
  PanGestureHandler,
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from "react-native-reanimated";

// デバイスの画面サイズを取得
const { width, height } = Dimensions.get("window");

// 太陽系表示サイズの定義
const SOLAR_WIDTH = width * 0.9; //太陽系を表示するエリアの横幅を決めています。画面の幅の90%を使用します。
const SOLAR_HEIGHT = height * 0.55; //太陽系を表示するエリアの縦幅を決めています。画面の高さ（height）の55%を使う、という意味です。
const ORBIT_MARGIN_X = SOLAR_WIDTH * 0.01; //軌道（楕円）の横方向の余白です。
const ORBIT_MARGIN_Y = SOLAR_HEIGHT * 0.001; //軌道（楕円）の縦方向の余白です。

// 惑星画像の読み込み
const planetImages = {
  "mercury.png": require("../../assets/images/mercury.png"), //画像を <Image source={...} /> で表示する際に、require() を使って画像ファイルを指定します。
  "venus.png": require("../../assets/images/venus.png"),
  "earth.png": require("../../assets/images/earth.png"),
  "mars.png": require("../../assets/images/mars.png"),
  "jupiter.png": require("../../assets/images/jupiter.png"),
  "saturn.png": require("../../assets/images/saturn.png"),
  "uranus.png": require("../../assets/images/uranus.png"),
  "neptune.png": require("../../assets/images/neptune.png"),
};

// 惑星の日本語名マップ
const planetNameMap = {
  "mercury.png": "水星",
  "venus.png": "金星",
  "earth.png": "地球",
  "mars.png": "火星",
  "jupiter.png": "木星",
  "saturn.png": "土星",
  "uranus.png": "天王星",
  "neptune.png": "海王星",
};

// 惑星の詳細情報　planetInfo はオブジェクト（連想配列）です。
const planetInfo = {
  "mars.png": {
    size: "6,779km", // 火星の直径
    mass: "6.39×10^23kg", // 火星の質量
    temp: "-63℃", // 火星の平均気温
  },
};

// スピードやサイズのベース値
const baseSpeed = 0.8; //惑星の回転アニメーションなどで使う基準となるスピードです。各惑星の速度をこの値を元に調整できます。
const baseSize = 0.045; //惑星の表示サイズの基準値です。
const MIN_PLANET_SIZE = 0.025; // 最小の惑星サイズです。これ以下には縮小しません。

// 惑星の公転周期とサイズ比
// sizeRatio水星の地球に対する直径の比率です。地球の直径を1としたとき、水星は約0.383倍の大きさという意味です。
// orbit公転軌道の番号です。0が最も内側の軌道（水星）で、7が最も外側の軌道（海王星）です。
// periodは公転周期を表します。単位は地球日です。
const planetData = [
  { img: "mercury.png", sizeRatio: 0.383, orbit: 7, period: 88 },
  { img: "venus.png", sizeRatio: 0.949, orbit: 6, period: 225 },
  { img: "earth.png", sizeRatio: 1.0, orbit: 5, period: 365 },
  { img: "mars.png", sizeRatio: 0.532, orbit: 4, period: 687 },
  { img: "jupiter.png", sizeRatio: 11.21, orbit: 3, period: 4333 },
  { img: "saturn.png", sizeRatio: 9.45, orbit: 2, period: 10759 },
  { img: "uranus.png", sizeRatio: 4.01, orbit: 1, period: 30687 },
  { img: "neptune.png", sizeRatio: 3.88, orbit: 0, period: 60190 },
];

// 惑星のサイズ・スピードを計算
const maxPlanetSize = 11.21;
const planets = planetData.map((p) => {
  const scaledSize = baseSize * (p.sizeRatio / maxPlanetSize);
  return {
    img: p.img,
    orbit: p.orbit,
    size: Math.max(scaledSize, MIN_PLANET_SIZE),
    speed: baseSpeed * (365 / p.period),
  };
});

export default function HomeScreen() {
  const [angles, setAngles] = useState(
    planets.map((_, i) => (Math.PI * 2 * i) / 8 - Math.PI / 2)
  );
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [planetPaused, setPlanetPaused] = useState(
    Array(planets.length).fill(false)
  );
  const requestRef = useRef();

  const scale = useSharedValue(1);//アニメーションやジェスチャー操作の値を管理するための「共有値（shared value）」を作っています。初期値は1
  const translateX = useSharedValue(0);//横方向（X軸）の移動量を管理する値です。
  const translateY = useSharedValue(0);//縦方向（Y軸）の移動量を管理する値です。

  const pinchHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      scale.value = event.scale;
    },
  });


  const panHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: (event) => {
      translateX.value = withDecay({
        velocity: event.velocityX,
        clamp: [-width, width],
      });
      translateY.value = withDecay({
        velocity: event.velocityY,
        clamp: [-height, height],
      });
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  useEffect(() => {
    let lastTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      setAngles((prev) =>
        prev.map((a, i) => (planetPaused[i] ? a : a + planets[i].speed * delta))
      );
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [planetPaused]);

  const centerX = SOLAR_WIDTH / 2;
  const centerY = SOLAR_HEIGHT / 2;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
    <Image
      source={require('../../assets/images/space_bg.png')}
      style={{ position: 'absolute', top: 0, left: 0, width: width, height: height }}
      resizeMode="cover"
    />


        <TouchableOpacity style={styles.myPageButton}>
          <Text style={styles.myPageText}>マイページ</Text>
        </TouchableOpacity>

        <PanGestureHandler onGestureEvent={panHandler}>
          <Animated.View style={animatedStyle}>
            <PinchGestureHandler onGestureEvent={pinchHandler}>
              <Animated.View
                style={[
                  styles.solarSystem,
                  { width: SOLAR_WIDTH, height: SOLAR_HEIGHT },
                ]}
              >
                <Svg
                  width={SOLAR_WIDTH}
                  height={SOLAR_HEIGHT}
                  style={StyleSheet.absoluteFill}
                >
                  {[...Array(8)].map((_, i) => (
                    <Ellipse
                      key={i}
                      cx={centerX}
                      cy={centerY}
                      rx={
                        SOLAR_WIDTH / 2 -
                        ORBIT_MARGIN_X -
                        i * (SOLAR_WIDTH * 0.055)
                      }
                      ry={
                        SOLAR_HEIGHT / 2 -
                        ORBIT_MARGIN_Y -
                        i * (SOLAR_HEIGHT * 0.055)
                      }
                      stroke="#fff"
                      strokeWidth="1"
                      fill="none"
                      opacity={0.4}
                    />
                  ))}
                </Svg>

                <Image
                  source={require("../../assets/images/sun.png")}
                  style={{
                    position: "absolute",
                    width: SOLAR_WIDTH * 0.08,
                    height: SOLAR_WIDTH * 0.08,
                    left: centerX - (SOLAR_WIDTH * 0.08) / 2,
                    top: centerY - (SOLAR_WIDTH * 0.08) / 2,
                  }}
                />

                {planets.map((p, idx) => {
                  const angle = angles[idx];
                  const rx =
                    SOLAR_WIDTH / 2 -
                    ORBIT_MARGIN_X -
                    p.orbit * (SOLAR_WIDTH * 0.055);
                  const ry =
                    SOLAR_HEIGHT / 2 -
                    ORBIT_MARGIN_Y -
                    p.orbit * (SOLAR_HEIGHT * 0.055);
                  const cx =
                    centerX + rx * Math.cos(angle) - (SOLAR_WIDTH * p.size) / 2;
                  const cy =
                    centerY + ry * Math.sin(angle) - (SOLAR_WIDTH * p.size) / 2;
                  return (
                    <TouchableWithoutFeedback
                      key={p.img}
                      onPress={() => {
                        setSelectedPlanet(p);
                        setPlanetPaused(() => {
                          const updated = Array(planets.length).fill(false);
                          updated[idx] = true;
                          return updated;
                        });
                      }}
                    >
                      <Image
                        source={planetImages[p.img]}
                        style={{
                          position: "absolute",
                          width: SOLAR_WIDTH * p.size,
                          height: SOLAR_WIDTH * p.size,
                          left: cx,
                          top: cy,
                        }}
                      />
                    </TouchableWithoutFeedback>
                  );
                })}
              </Animated.View>
            </PinchGestureHandler>
          </Animated.View>
        </PanGestureHandler>

        {selectedPlanet && (
          <>
            <View style={styles.infoBoxStyled}>
              <View style={styles.infoTextBlock}>
                <Text style={styles.planetName}>
                  {planetNameMap[selectedPlanet.img]}
                </Text>
                <Text style={styles.infoText}>
                  太陽から{selectedPlanet.orbit + 1}番目
                </Text>
                <Text style={styles.infoText}>
                  大きさ: {planetInfo[selectedPlanet.img]?.size}
                </Text>
                <Text style={styles.infoText}>
                  質量: {planetInfo[selectedPlanet.img]?.mass}
                </Text>
                <Text style={styles.infoText}>
                  平均気温: {planetInfo[selectedPlanet.img]?.temp}
                </Text>
              </View>
              {/* <Image
                source={planetImages[selectedPlanet.img]}
                style={styles.infoPlanetImage}
                resizeMode="contain"
              /> */}
            </View>
          </>
        )}

        <TouchableOpacity style={styles.startButton}>
          <View style={styles.pauseIcon}>
            <Text style={{ color: "#fff", fontSize: 24 }}>⏸</Text>
          </View>
          <Text style={styles.startText}>ゲームスタート</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    position: "absolute",
    top: 10,
    left: 10,
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    zIndex: 10,
  },
  myPageButton: {
    position: "absolute",
    top: 30,
    right: 20,
    backgroundColor: "#90ff90",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    zIndex: 10,
  },
  myPageText: {
    color: "#222",
    fontWeight: "bold",
    fontSize: 16,
  },
  solarSystem: {
    justifyContent: "center",
    alignItems: "center",
  },
  startButton: {
    position: "absolute",
    bottom: 40,
    right: 30,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e96b8b",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    zIndex: 10,
  },
  pauseIcon: {
    marginRight: 8,
  },
  startText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  planetName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 6,
  },
  infoBoxStyled: {
    position: "absolute",
    bottom: 30,
    left: "50%",
    transform: [{ translateX: -150 }],
    width: 300,
    backgroundColor: "#C94D89",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#fff",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  infoTextBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  infoText: {
    fontSize: 13,
    color: "#fff",
    marginVertical: 1,
  },
  infoPlanetImage: {
    position: "absolute",
    right: -width * 0.25,
    top: height * 0.35,
    width: width * 1,
    height: width * 1,
    zIndex: 1,
  },
});