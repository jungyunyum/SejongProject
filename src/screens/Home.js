import React, { useRef, useCallback } from "react";
import { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ImageBackground,
  Animated,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { useDispatch } from "react-redux";

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const fetchData = useCallback(async () => {
    const url = "http://43.202.33.4:8081/user/cart";
    const headers = { mode: "debug" };

    try {
      const response = await axios.post(url, {}, { headers });
      const urlParts = response.request.responseURL.split("/");
      const cartId = urlParts[urlParts.length - 2];
      const customerId = urlParts[urlParts.length - 1];

      // Redux 상태 업데이트
      dispatch({ type: "cartId", payload: cartId });
      dispatch({ type: "customerId", payload: customerId });

      console.log("카트 ID:", cartId);
      console.log("사용자 ID:", customerId);
    } catch (error) {
      console.error("데이터 호출 중 오류 발생:", error);
    }
  }, [dispatch]);

  // 애니메이션 설정
  useEffect(() => {
    const fadeInOut = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.4,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    fadeInOut();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" />

      {/* 배경 이미지 */}
      <ImageBackground
        source={require("../../assets/HomeBackground.webp")}
        style={styles.backgroundImage}
        resizeMode="stretch"
      >
        <TouchableOpacity
          onPress={() => {
            fetchData(); // fetchData를 바로 실행
            setTimeout(() => {
              navigation.navigate("Menu"); // 1초 후에 navigation 실행
            }, 800);
          }}
          style={styles.clickableArea}
        >
          <View style={styles.header}>
            <View style={styles.cornerContainer}>
              <View style={styles.cornerTopLeft} />
              <View style={styles.cornerTopRight} />
            </View>

            <View style={styles.mainTitleContainer}>
              <Text style={styles.mainTitle}>여기에서</Text>
              <Text style={styles.mainTitle}>주문해주세요</Text>
            </View>
            <Text style={styles.subtitle}>MAUM BARISTA</Text>

            <Animated.Text style={[styles.subtext, { opacity: fadeAnim }]}>
              주문하시려면 화면을 터치해주세요
            </Animated.Text>

            <View style={styles.cornerContainer}>
              <View style={styles.cornerBottomLeft} />
              <View style={styles.cornerBottomRight} />
            </View>
          </View>
        </TouchableOpacity>

        {/* AI 상담하기 버튼 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("AiChat")}
            style={styles.customButton}
          >
            <Ionicons
              name="chatbubble-outline"
              size={24}
              color="white"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>AI 상담하기</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  clickableArea: {
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
  },
  mainTitleContainer: {
    marginTop: 50,
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 48,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "brown",
    marginTop: 10,
  },
  subtext: {
    fontSize: 18,
    color: "black",
    marginTop: 5,
    marginBottom: 40,
  },
  buttonContainer: {
    marginTop: 25,
  },
  customButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 320,
    backgroundColor: "brown",
    paddingVertical: 10,
    borderRadius: 20,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  cornerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "38%",
  },
  cornerTopLeft: {
    borderLeftWidth: 2,
    borderTopWidth: 2,
    width: 20,
    height: 20,
    borderColor: "brown",
  },
  cornerTopRight: {
    borderRightWidth: 2,
    borderTopWidth: 2,
    width: 20,
    height: 20,
    borderColor: "brown",
  },
  cornerBottomLeft: {
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    width: 20,
    height: 20,
    borderColor: "brown",
  },
  cornerBottomRight: {
    borderRightWidth: 2,
    borderBottomWidth: 2,
    width: 20,
    height: 20,
    borderColor: "brown",
  },
});

export default Home;
