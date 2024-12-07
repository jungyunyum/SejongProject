import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform, // 추가된 부분
} from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import axios from "axios";

const App = () => {
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState("");

  // 녹음 시작(세팅)
  const startRecording = async () => {
    try {
      // 권한 요청
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("권한 필요", "녹음 권한을 허용해주세요.");
        return;
      }

      // 녹음 모드 설정
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // 녹음 시작
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
    } catch (error) {
      console.error("녹음 시작 오류:", error);
    }
  };

  // 녹음 중지
  const stopRecording = async () => {
    try {
      if (!recording) return;

      // 녹음 중지 및 파일 URI 가져오기
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log("녹음 파일 URI:", uri);
      setAudioUri(uri);
      setRecording(null);
    } catch (error) {
      console.error("녹음 중지 오류:", error);
    }
  };

  // m4a 파일 형식으로 백엔드 전송
  const sendAudioToBackend = async () => {
    if (!audioUri) {
      Alert.alert("녹음된 파일 없음", "먼저 녹음을 진행해주세요.");
      return;
    }

    try {
      // FormData 생성
      const formData = new FormData();
      const fileUri =
        Platform.OS === "android" ? audioUri : audioUri.replace("file://", ""); // iOS의 경우 "file://" 제거 필요

      formData.append("file", {
        uri: fileUri,
        name: "recorded_audio.m4a", // 전송될 파일 이름
        type: "audio/m4a", // 파일 타입
      });

      for (let [key, value] of formData._parts) {
        console.log(`FormData Key: ${key}, Value:`, value);
      }
      
      // 파일을 백엔드로 전송
      const response = await axios.post(
        "http://43.202.33.4:8081/ai/first", // 백엔드 URL
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ai_first_type: "conversation", // AI 타입 헤더 추가
          },
        }
      );

      console.log("응답 상태:", response.status);
      console.log("응답 데이터:", response.data);

      Alert.alert("응답 수신", JSON.stringify(response.data));
    } catch (error) {
      console.error("파일 전송 오류:", error.response || error);
      Alert.alert("오류", "파일 전송 중 문제가 발생했습니다.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>m4a 오디오 파일 전송</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={recording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>
          {recording ? "녹음 중지" : "녹음 시작"}
        </Text>
      </TouchableOpacity>

      {audioUri ? (
        <TouchableOpacity style={styles.button} onPress={sendAudioToBackend}>
          <Text style={styles.buttonText}>백엔드로 전송</Text>
        </TouchableOpacity>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default App;
