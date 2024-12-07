import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Modal from "react-native-modal";

const AddCustomer = ({ isVisible, toggleModal }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handlePhoneNumberChange = (text) => {
    const formattedText = text
      .replace(/[^0-9]/g, "")
      .replace(/(\d{3})(\d{1,4})/, "$1-$2")
      .replace(/(\d{3}-\d{4})(\d{1,4})/, "$1-$2");
    setPhoneNumber(formattedText);

    if (
      formattedText.length === 13 &&
      !/^010-\d{4}-\d{4}$/.test(formattedText)
    ) {
      setPhoneNumberError("올바른 전화번호 형식을 입력해주세요.");
    } else {
      setPhoneNumberError("");
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    if (password !== text) {
      setPasswordError("비밀번호가 일치하지 않습니다!");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirm = () => {
    // 모든 유효성 검사를 통과해야 모달을 닫을 수 있습니다.
    if (
      !phoneNumberError &&
      !passwordError &&
      phoneNumber &&
      password &&
      confirmPassword
    ) {
      toggleModal(); // 유효성 검사를 통과하면 모달 닫기
      // 여기에 회원가입 API를 호출하거나 다른 로직을 추가할 수 있습니다.
    } else {
      // 유효성 검사를 통과하지 못한 경우 오류 메시지를 표시합니다.
      if (!phoneNumber) {
        setPhoneNumberError("전화번호를 입력해주세요.");
      }
      if (!password || !confirmPassword) {
        setPasswordError("비밀번호를 입력해주세요.");
      }
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={toggleModal}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>회원가입</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>휴대폰 번호</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={handlePhoneNumberChange}
            keyboardType="numeric"
            maxLength={13}
            placeholder="010-XXXX-XXXX"
          />
          {phoneNumberError && phoneNumber.length === 13 ? (
            <Text style={styles.errorText}>{phoneNumberError}</Text>
          ) : null}
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
            maxLength={4}
            placeholder="4자리 숫자를 설정해주세요"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>비밀번호 확인</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            secureTextEntry
            maxLength={4}
            placeholder="비밀번호를 다시 입력해주세요"
          />
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={toggleModal}>
            <Text style={styles.buttonText}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
          >
            <Text style={styles.buttonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  formGroup: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f8f4f0",
  },
  errorText: {
    color: "#e60000",
    fontSize: 12,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#888",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  confirmButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AddCustomer;
