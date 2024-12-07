//회원가입 완성!!
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Image,
} from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";

const AddAccount = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false); // 모달 상태 추가
  const [result, setresult] = useState(null); // null:기본상태 , false:실패, true:성공
  const customerId = useSelector((state) => state.customerId); //사용자 id 가져오기!

  const addId = async () => {
    try {
      const response = await axios.post(
        `http://43.202.33.4:8081/user/join/${customerId}`,
        new URLSearchParams({
          id: phoneNumber,
          password: password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded", // 명세에 따른 Content-Type
          },
        }
      );

      console.log("회원가입 성공");
      setresult(true);
      console.log(response);
      openModal();

      setTimeout(() => {
        setIsModalVisible(false); // 모달 닫기
        navigation.navigate("CustomerLogin"); // 화면 전환
      }, 1000);
    } catch (error) {
      console.log("회원가입 실패");
      setresult(false);
      console.log(error.response?.data || error.message);
    }
  };

  const handlePhoneNumberChange = (text) => {
    let formattedText = text.replace(/[^0-9]/g, ""); // 숫자만 남기기
    setPhoneNumber(formattedText); // 하이픈 없이 설정
    setIsPhoneValid(formattedText.length === 11); // 11자리인지 확인
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setIsPasswordValid(text.length === 4);
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    setIsConfirmPasswordValid(text === password);
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    navigation.navigate("CustomerLogin"); // 모달 확인 후 이동
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>회원가입</Text>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>휴대폰 번호</Text>
          <TextInput
            style={[styles.input, !isPhoneValid && styles.inputError]}
            keyboardType="numeric"
            value={phoneNumber}
            onChangeText={handlePhoneNumberChange}
            placeholder="010-1234-5678"
          />
          {result == false && (
            <Text style={styles.errorText}>이미 존재하는 비밀번호 입니다!</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={[styles.input, !isPasswordValid && styles.inputHint]}
            secureTextEntry
            keyboardType="numeric"
            value={password}
            onChangeText={handlePasswordChange}
            placeholder="****"
            maxLength={4}
          />
          {!isPasswordValid && (
            <Text style={styles.hintText}>4자리 숫자를 설정해주세요</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>비밀번호 확인</Text>
          <TextInput
            style={[styles.input, !isConfirmPasswordValid && styles.inputError]}
            secureTextEntry
            keyboardType="numeric"
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            placeholder="****"
            maxLength={4}
          />
          {!isConfirmPasswordValid && (
            <Text style={styles.errorText}>비밀번호가 일치하지 않습니다!</Text>
          )}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.cancelButton, styles.button]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.confirmButton, styles.button]}
          onPress={addId}
        >
          <Text style={styles.confirmButtonText}>확인</Text>
        </TouchableOpacity>
      </View>

      {/* 모달 컴포넌트 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.card}>
            <Image
              source={require("../../assets/AddCustomer.png")}
              style={styles.image}
            />
            <Text style={styles.message}>회원가입이 완료되었습니다</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("CustomerLogin")}
            >
              <Text style={styles.buttonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontSize: 24,
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
    marginBottom: 15,
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
  inputHint: {
    borderColor: "#888",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  hintText: {
    color: "#888",
    fontSize: 12,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#4A4A4A",
  },
  confirmButton: {
    backgroundColor: "#FF5733",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  card: {
    width: 300,
    height: 400,
    backgroundColor: "#f8f4ef",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    color: "black",
    marginBottom: 20,
  },
  button: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#b58e6f",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});

export default AddAccount;
