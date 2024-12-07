import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

const QRCodeLoginScreen = ({ navigation }) => {
  //그리고 성공을 하면 바로 loginSuccess 화면으로 이동을 하면 된다.
  const [timeLeft, setTimeLeft] = useState(180);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 1) {
          //계속 시간을 줄여나간다.
          return prevTime - 1;
        } else {
          clearInterval(timer);
          navigation.goBack(); //시간이 다 되면 뒤로 이동을 한다.
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigation]);

  // 남은 시간을 mm:ss 형식으로 변환
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR 코드 로그인</Text>
      <View style={styles.qrContainer}>
        <View style={styles.qrCode}>
          <Image
            source={require("../../assets/Qrcode.jpg")}
            style={styles.qrImage}
          />
        </View>
        <Text style={styles.timeText}>
          남은 시간 <Text style={styles.timeLeft}>{formatTime(timeLeft)}</Text>
        </Text>
      </View>
      <Text style={styles.instructionText}>
        QR 코드를 모바일 기기의{"\n"}카메라 📷 로 촬영해주세요
      </Text>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelButtonText}>취소</Text>
      </TouchableOpacity>
    </View>
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  qrContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  qrCode: {
    width: 200,
    height: 200,
    borderColor: "#FFEB00",
    borderWidth: 6,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  qrImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  timeText: {
    fontSize: 25,
    color: "#333",
  },
  timeLeft: {
    fontSize: 20,
    color: "#FF4D4D",
    fontWeight: "bold",
  },
  instructionText: {
    fontSize: 20,
    color: "#333",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: "#FF4D4D",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
  },
  cancelButtonText: {
    color: "#FFF",
    fontSize: 22,
  },
});

export default QRCodeLoginScreen;
