import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const LoginPage = ({ navigation }) => {
  const customerId = useSelector((state) => state.customerId);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [Possibleid, setPossibleid] = useState(null);

  const stamp = useSelector((state) => state.stamp);
  const totalPrice = useSelector((state) => state.totalPrice);

  console.log("시작");
  console.log(stamp);
  console.log(totalPrice);

  const dispatch = useDispatch();

  //로그인 통신하기 ( 사용자 아이디 필수!)
  const checkid = async () => {
    console.log(customerId);
    console.log(phoneNumber);
    console.log(password);
    try {
      const response = await axios.post(
        `http://43.202.33.4:8081/user/${customerId}`,
        new URLSearchParams({
          id: phoneNumber,
          password: password,
        }),
        {
          headers: {
            mode: "debug",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      setPossibleid(true);
      dispatch({ type: "setStamp", payload: response.data });
      dispatch({ type: "useStamp", payload: response.data });
      dispatch({ type: "phoneNumber", payload: phoneNumber });

      navigation.navigate("LoginSuccess");
    } catch (error) {
      console.log("로그인 실패:", error);
      setPossibleid(false);
    }
  };

  const handlePhoneNumberChange = (text) => {
    const formattedText = text.replace(/[^0-9]/g, "");
    setPhoneNumber(formattedText);
    setIsPhoneValid(formattedText.length === 11);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setIsPasswordValid(/^\d{4}$/.test(text));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>로그인</Text>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>휴대폰 번호</Text>

          <TextInput
            style={[styles.input, !isPhoneValid && styles.inputError]}
            keyboardType="numeric"
            value={phoneNumber}
            onChangeText={handlePhoneNumberChange}
            placeholder="01012345678"
          />

          {Possibleid === false && (
            <Text style={styles.tryAgain}>일치하는 회원정보가 없습니다.</Text>
          )}

          {!isPhoneValid && (
            <Text style={styles.errorText}>
              휴대폰 번호를 정확히 입력하세요.
            </Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={[styles.input, !isPasswordValid && styles.inputError]}
            secureTextEntry
            keyboardType="numeric"
            value={password}
            onChangeText={handlePasswordChange}
            placeholder="****"
            maxLength={4}
          />

          {!isPasswordValid && (
            <Text style={styles.errorText}>4자리 숫자를 입력하세요.</Text>
          )}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.confirmButton, styles.button]}
          onPress={checkid}
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
  formContainer: {
    width: "80%",
    alignItems: "flex-start",
    backgroundColor: "#FAF4EB",
    padding: 20,
    borderRadius: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "red",
  },
  tryAgain: {
    color: "red",
    fontSize: 15,
    marginTop: 5,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  buttonContainer: {
    width: "80%",
    marginTop: 20,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  confirmButton: {
    backgroundColor: "#4A4A4A",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default LoginPage;
