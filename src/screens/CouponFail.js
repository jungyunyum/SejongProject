import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const MembershipScreen = ({ navigation }) => {
  //통신 필요 없음 (완료)

  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <Text style={styles.icon}>❌</Text>
        <Text style={styles.mainText}>비밀번호가 일치하지 않습니다.</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.navigate("CustomerLogin")}
        >
          <Text style={styles.cancelText}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.navigate("PhoneNumberPad")}
        >
          <Text style={styles.retryText}>재입력</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5e7d3", // 연한 베이지 색상
  },
  messageContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  icon: {
    fontSize: 100,
    color: "#FF4C4C",
    marginBottom: 40,
  },
  mainText: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 10,
  },
  subText: {
    fontSize: 18,
    color: "#666666",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "80%", // 버튼이 화면의 80% 너비를 차지하도록 설정
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#C4C4C4",
    paddingVertical: 15,
    alignItems: "center",
    marginRight: 5,
    borderRadius: 5,
  },
  cancelText: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  retryButton: {
    flex: 1,
    backgroundColor: "#FF4C4C",
    paddingVertical: 15,
    alignItems: "center",
    marginLeft: 5,
    borderRadius: 5,
  },
  retryText: {
    fontSize: 20,
    color: "#FFFFFF",
  },
});

export default MembershipScreen;
