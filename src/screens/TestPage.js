import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

const App = () => {
  const [recording, setRecording] = useState(null); // 녹음 객체 상태
  const [audioUri, setAudioUri] = useState(""); // 저장된 파일 경로

  // 녹음 시작(세팅 하기 )
  const startRecording = async () => {
    try {
      console.log("🎙️ [녹음 시작]");
      const permission = await Audio.requestPermissionsAsync(); //오디오 요청 과정
      if (!permission.granted) {
        alert("녹음 권한이 필요합니다!");
        return;
      }

      await Audio.setAudioModeAsync({
        //오디오 모드 설정하기
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error("❌ [녹음 시작 오류]:", err);
    }
  };

  // 녹음 중지 및 저장
  const stopRecording = async () => {
    try {
      console.log("🛑 [녹음 중지]");
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI(); // 녹음된 파일 경로(기본은 M4A)
      console.log("📁 [녹음된 파일 경로]:", uri);

      // WAV 파일 경로로 저장
      const wavFilePath = `${FileSystem.documentDirectory}recorded_audio.wav`;
      await FileSystem.copyAsync({
        from: uri,
        to: wavFilePath,
      });

      console.log("💾 [WAV 파일 저장 완료]:", wavFilePath);

      // WAV 파일 바이너리 데이터 읽기
      const wavBinaryData = await FileSystem.readAsStringAsync(wavFilePath, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // 바이너리 데이터를 문자 그대로 출력
      console.log("📄 [WAV 파일 바이너리 데이터]:", wavBinaryData);

      setAudioUri(wavFilePath);
      setRecording(null);
    } catch (err) {
      console.error("❌ [녹음 중지 및 저장 오류]:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WAV 파일 출력 테스트</Text>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: recording ? "#f44336" : "#4CAF50" },
        ]}
        onPress={recording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>
          {recording ? "녹음 중지" : "녹음 시작"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
  },
});

export default App;
