import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useSelector } from "react-redux";

const LoginSuccess = ({ navigation }) => {
  const phoneNumber = useSelector((state) => state.phoneNumber); // 핸드폰 번호 가져오기

  // Redux 상태 구독
  const stamp = useSelector((state) => state.stamp);

  // 상태 값 변경 감지용 로컬 상태
  const [currentStamp, setCurrentStamp] = useState(stamp);

  useEffect(() => {
    // Redux 상태 변경을 감지하여 로컬 상태를 업데이트
    if (stamp !== currentStamp) {
      console.log("Redux 상태 변경 감지:", stamp);
      setCurrentStamp(stamp); // 로컬 상태 업데이트
    }
  }, [stamp]); // stamp가 변경될 때마다 실행

  // 렌더링에 사용할 계산된 값
  const userName = phoneNumber;
  const stampCount = currentStamp % 10;
  const totalStamps = 10;
  const couponCount = Math.floor(currentStamp / 10);
  const couponDiscount = 5000;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcomeText}>{userName}님, 환영합니다!</Text>
      <Text style={styles.subText}>오늘도 좋은 하루 되세요!</Text>

      <View style={styles.couponContainer}>
        <Text style={styles.couponTitle}>보유 쿠폰</Text>
        <View style={styles.couponRow}>
          <Text style={styles.couponText}>
            <Text style={styles.boldText}>{currentStamp}</Text> 개의{" "}
            <Text style={styles.boldText}>{couponDiscount}원 할인 쿠폰</Text>
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => navigation.navigate("CustomerLogin")}
      >
        <Text style={styles.confirmButtonText}>확인</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5E8D7",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 30,
  },
  couponContainer: {
    width: "80%",
    height: "13%",
    justifyContent: "center",
    backgroundColor: "#FAF4EB",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D5C3A1",
    marginBottom: 20,
  },
  couponTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#333",
    marginBottom: 20,
  },
  couponRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 10,
  },
  couponText: {
    fontSize: 20,
    color: "#333",
  },

  boldText: {
    fontWeight: "bold", // 텍스트 굵게
  },

  confirmButton: {
    backgroundColor: "#D5A354",
    paddingVertical: 15,
    width: "80%",
    borderRadius: 10,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginSuccess;
