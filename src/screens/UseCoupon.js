import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

const UseCoupon = ({ navigation }) => {
  const customerId = useSelector((state) => state.customerId); // 회원 아이디
  const totalPrice = useSelector((state) => state.totalPrice);

  const stamp = useSelector((state) => state.stamp);
  const usestamp = useSelector((state) => state.useStamp);

  const [remainingStamps, setRemainingStamps] = useState(null); // 남아 있는 스탬프 수
  const dispatch = useDispatch();

  // 스탬프 사용하기
  const useStamps = async () => {
    if (!totalPrice) {
      Alert.alert("Error", "Please enter a total price.");
      return;
    }

    try {
      console.log("API 요청 시작...");
      console.log(stamp);
      console.log(usestamp);

      const response = await axios.patch(
        `http://43.202.33.4:8081/user/stamp/use/${customerId}`,
        new URLSearchParams({ total_price: totalPrice }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.status === 200) {
        console.log("API 요청 성공:", response.data);
        dispatch({ type: "useStamp", payload: response.data });
        navigation.navigate("CouponSuccess"); // 성공을 했으면 성공 완료 페이지로 이동!
        setRemainingStamps(response.data?.remainingStamps || 0); // 스탬프 저장하기
      } else {
        Alert.alert(
          "Error",
          `Failed to use stamps. Status: ${response.status}`
        );
      }
    } catch (error) {
      console.log("API 요청 오류:", error);
      if (error.response?.status === 502) {
        if (
          error.response.request._response == "보유 스탬프 개수가 부족합니다!"
        ) {
          alert(error.response.request._response);
          navigation.navigate("LoginPage");
        }
        console.log(error.response.request._response); // 로그아웃 상태인 경우!
        navigation.navigate("SelectPayment"); // 로그인 화면으로 가서 로그인하기!
      } else {
        Alert.alert("Error", `An error occurred: ${error.message}`);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>쿠폰 사용하시겠습니까?</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.cancelButton, styles.button]}
        >
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={useStamps}
          style={[styles.confirmButton, styles.button]}
        >
          <Text style={styles.confirmButtonText}>확인</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5E8D7",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
  },
  buttonContainer: {
    width: "80%",
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "48%", // 버튼의 폭을 조절하여 두 버튼이 한 줄에 배치되도록 설정
  },
  confirmButton: {
    backgroundColor: "#B22222", // 확인 버튼 색상 #B22222
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#4A4A4A", // 취소 버튼 색상 (예: 빨간색)
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default UseCoupon;
