//쿠폰 성공시 화면이 화면 나온다.
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CouponSuccess = ({ navigation }) => {
  //통신 필요 없음 (완료)
  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <Text style={styles.icon}>✅</Text>
        <Text style={styles.mainText}>쿠폰 적용이 완료되었습니다</Text>
      </View>
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => navigation.navigate("SelectPayment")} // 확인 버튼을 누르면 이전 화면으로 이동
      >
        <Text style={styles.confirmText}>확인</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F3E9", // 연한 베이지 색상
  },
  messageContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  icon: {
    fontSize: 80,
    color: "#4CAF50", // 초록색 체크 아이콘
    marginBottom: 10,
  },
  mainText: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
  },
  confirmButton: {
    width: "80%",
    backgroundColor: "#D1A573", // 버튼 배경색 (갈색 톤)
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
  },
  confirmText: {
    fontSize: 20,
    color: "#FFFFFF",
  },
});

export default CouponSuccess;
