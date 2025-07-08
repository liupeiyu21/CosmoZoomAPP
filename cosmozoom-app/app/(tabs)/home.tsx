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
import Svg, { Ellipse } from "react-native-svg";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PinchGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from "react-native-reanimated";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");
const SOLAR_WIDTH = width * 0.9;
const SOLAR_HEIGHT = height * 0.55;
const ORBIT_MARGIN_X = SOLAR_WIDTH * 0.01;
const ORBIT_MARGIN_Y = SOLAR_HEIGHT * 0.001;

const planetImages = {
  "mercury.png": require("../../assets/images/mercury.png"),
  "venus.png": require("../../assets/images/venus.png"),
  "earth.png": require("../../assets/images/earth.png"),
  "mars.png": require("../../assets/images/mars.png"),
  "jupiter.png": require("../../assets/images/jupiter.png"),
  "saturn.png": require("../../assets/images/saturn.png"),
  "uranus.png": require("../../assets/images/uranus.png"),
  "neptune.png": require("../../assets/images/neptune.png"),
};

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

const planetInfo = {
  "mars.png": {
    size: "6,779km",
    mass: "6.39×10^23kg",
    temp: "-63℃",
  },
};

const baseSpeed = 0.8;
const baseSize = 0.045;
const MIN_PLANET_SIZE = 0.025;

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
  const [isPaused, setIsPaused] = useState(false);
  const requestRef = useRef();

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

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
      translateX.value = withDecay({ velocity: event.velocityX, clamp: [-width, width] });
      translateY.value = withDecay({ velocity: event.velocityY, clamp: [-height, height] });
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

      if (!isPaused) {
        setAngles((prev) =>
          prev.map((a, i) => a + planets[i].speed * delta)
        );
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPaused]);

  const centerX = SOLAR_WIDTH / 2;
  const centerY = SOLAR_HEIGHT / 2;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/login_background.png")}
          style={{ position: 'absolute', top: 0, left: 0, width, height }}
          
        />

        <TouchableOpacity
          style={styles.myPageButton}
          onPress={() => router.push("/mypage")}
        >
          <Text style={styles.myPageText}>マイページ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: "#888" }]}
          onPress={() => setIsPaused(prev => !prev)}
        >
          <Text style={styles.startText}>{isPaused ? '再開 ▶︎' : '停止 ⏸'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.gameButton, { backgroundColor: "#C94D89" }]}
          onPress={() => router.push("/game")}
          >
          <Text style={styles.startText}>ゲームスタート</Text>
          </TouchableOpacity>
            

        <PanGestureHandler onGestureEvent={panHandler}>
          <Animated.View style={animatedStyle}>
            <PinchGestureHandler onGestureEvent={pinchHandler}>
              <Animated.View style={[styles.solarSystem, { width: SOLAR_WIDTH, height: SOLAR_HEIGHT }]}>
                <Svg width={SOLAR_WIDTH} height={SOLAR_HEIGHT} style={StyleSheet.absoluteFill}>
                  {[...Array(8)].map((_, i) => (
                    <Ellipse
                      key={i}
                      cx={centerX}
                      cy={centerY}
                      rx={SOLAR_WIDTH / 2 - ORBIT_MARGIN_X - i * (SOLAR_WIDTH * 0.055)}
                      ry={SOLAR_HEIGHT / 2 - ORBIT_MARGIN_Y - i * (SOLAR_HEIGHT * 0.055)}
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
                  const rx = SOLAR_WIDTH / 2 - ORBIT_MARGIN_X - p.orbit * (SOLAR_WIDTH * 0.055);
                  const ry = SOLAR_HEIGHT / 2 - ORBIT_MARGIN_Y - p.orbit * (SOLAR_HEIGHT * 0.055);
                  const cx = centerX + rx * Math.cos(angle) - (SOLAR_WIDTH * p.size) / 2;
                  const cy = centerY + ry * Math.sin(angle) - (SOLAR_WIDTH * p.size) / 2;

                  return (
                    <TouchableWithoutFeedback
                      key={p.img}
                      onPress={() => setSelectedPlanet(p)}
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
          <View style={styles.infoBoxStyled}>
            <View style={styles.infoTextBlock}>
              <Text style={styles.planetName}>{planetNameMap[selectedPlanet.img]}</Text>
              <Text style={styles.infoText}>太陽から{selectedPlanet.orbit + 1}番目</Text>
              <Text style={styles.infoText}>大きさ: {planetInfo[selectedPlanet.img]?.size}</Text>
              <Text style={styles.infoText}>質量: {planetInfo[selectedPlanet.img]?.mass}</Text>
              <Text style={styles.infoText}>平均気温: {planetInfo[selectedPlanet.img]?.temp}</Text>
            </View>
          </View>
        )}
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
  top: 80, // マイページの下に配置
  right: 20,
  backgroundColor: "#e96b8b",
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 8,
  alignItems: "center",
  justifyContent: "center",
  minHeight: 40,
  zIndex: 10,
  },
  gameButton: {
  position: "absolute",
  bottom: 30,     // 下からの距離
  right: 20,      // 右からの距離
  backgroundColor: "#C94D89",
  paddingHorizontal: 18,
  paddingVertical: 10,
  borderRadius: 8,
  alignItems: "center",
  justifyContent: "center",
  minHeight: 40,
  zIndex: 10,
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
  },
  infoTextBlock: {
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "100%",
  },
  infoText: {
    fontSize: 13,
    color: "#fff",
    marginVertical: 1,
  },
});
