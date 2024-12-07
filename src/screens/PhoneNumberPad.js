import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const PhoneNumberPad = ({ navigation }) => {
  const [phoneNumberPad, setPhoneNumberPad] = useState("010-"); // 화면 표시용 번호
  const [phoneNumber, setPhoneNumber] = useState("010"); // 저장용 번호
  const [result, setResult] = useState(false); // 적립이 되었는지 확인!
  const totalPrice = useSelector((state) => state.totalPrice); // 총가격 가져오기
  const dispatch = useDispatch(); //디스페치 사용할거임

  console.log(totalPrice);

  const handleAddStamps = async () => {
    try {
      const response = await axios.patch(
        "http://43.202.33.4:8081/user/stamp/add",
        new URLSearchParams({
          id: phoneNumber,
          total_price: totalPrice,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log(response.data);
      // 요청 성공 시
      setResult(true); // 스탬프 적립 성공!
      dispatch({ type: "useStamp", payload: response.data });
      dispatch({ type: "setStamp", payload: response.data }); //stamp 갯수 수정하기!
      console.log(response.data);
    } catch (error) {
      // 요청 실패 시
      if (error.response && error.response.status === 400) {
        Alert.alert("에러", "아이디가 존재하지 않습니다.");
      } else {
        Alert.alert("에러", "스탬프 적립에 실패했습니다.");
      }
      console.error("API 요청 오류:", error);
    }
  };

  const stamp = useSelector((state) => state.stamp); //쿠폰갯수 가져오기
  console.log(stamp);

  const handlePress = (value) => {
    if (value === "clear") {
      setPhoneNumberPad("010-");
      setPhoneNumber("010");
    } else if (value === "backspace") {
      if (phoneNumber.length > 3) {
        const updatedRaw = phoneNumber.slice(0, -1);
        setPhoneNumber(updatedRaw);

        // 업데이트된 포맷 적용
        setPhoneNumberPad(formatPhoneNumber(updatedRaw));
      }
    } else if (phoneNumber.length < 11) {
      const updatedRaw = phoneNumber + value;
      setPhoneNumber(updatedRaw);

      // 업데이트된 포맷 적용
      setPhoneNumberPad(formatPhoneNumber(updatedRaw));
    }
  };

  const formatPhoneNumber = (number) => {
    if (number.length > 7) {
      return `${number.slice(0, 3)}-${number.slice(3, 7)}-${number.slice(7)}`;
    } else if (number.length > 3) {
      return `${number.slice(0, 3)}-${number.slice(3)}`;
    } else {
      return number;
    }
  };

  const renderButton = (label, value) => (
    <TouchableOpacity style={styles.button} onPress={() => handlePress(value)}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>전화번호를 입력해주세요</Text>
        <Text style={styles.phoneNumber}>{phoneNumberPad}</Text>

        <View style={styles.keypad}>
          <View style={styles.row}>
            {renderButton("1", "1")}
            {renderButton("2", "2")}
            {renderButton("3", "3")}
          </View>
          <View style={styles.row}>
            {renderButton("4", "4")}
            {renderButton("5", "5")}
            {renderButton("6", "6")}
          </View>
          <View style={styles.row}>
            {renderButton("7", "7")}
            {renderButton("8", "8")}
            {renderButton("9", "9")}
          </View>
          <View style={styles.row}>
            {renderButton("모두 지우기", "clear")}
            {renderButton("0", "0")}
            {renderButton("⌫", "backspace")}
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.navigate("CustomerLogin")}
          >
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => {
              handleAddStamps();
              navigation.navigate("LoginSuccess", { phoneNumber });
            }}
          >
            <Text style={styles.confirmButtonText}>확인</Text>
          </TouchableOpacity>
        </View>
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
  innerContainer: {
    width: "60%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAF4EB",
    padding: 15,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 35,
  },
  phoneNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    letterSpacing: 2,
    marginBottom: 12,
  },
  keypad: {
    width: "90%",
    justifyContent: "center",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
  },
  button: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: "#ddd",
  },
  buttonText: {
    fontSize: 21,
    color: "#333",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#888",
    paddingVertical: 8,
    marginHorizontal: 4,
    alignItems: "center",
    borderRadius: 6,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#FF4D4D",
    paddingVertical: 8,
    marginHorizontal: 4,
    alignItems: "center",
    borderRadius: 6,
  },
  cancelButtonText: {
    color: "#FFF",
    fontSize: 20,
  },
  confirmButtonText: {
    color: "#FFF",
    fontSize: 20,
  },
});

export default PhoneNumberPad;
