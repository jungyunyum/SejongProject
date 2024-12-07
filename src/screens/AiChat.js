import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ImageBackground,
  Platform,
} from "react-native";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { fromByteArray } from "base64-js";

const backgroundImage = require("../../assets/HomeBackground.webp");

// Base64 데이터 유효성 검사 함수
const isValidBase64 = (base64) => {
  const base64Regex = /^[A-Za-z0-9+/=]+$/;
  return base64 && base64.length > 0 && base64Regex.test(base64);
};

// WAV 파일 저장 및 재생 함수 //여기
const saveAndPlayAudio = async (binaryData) => {
  try {
    console.log("🛠️ [디버깅 시작]: WAV 파일 저장 및 재생 테스트 시작");

    // 1. 파일 경로 설정
    const filePath = `${FileSystem.documentDirectory}output.wav`;
    console.log("📂 [파일 경로]:", filePath);

    // 2. 바이너리 데이터를 Base64로 변환
    const base64Data = fromByteArray(new Uint8Array(binaryData));

    if (!isValidBase64(base64Data)) {
      throw new Error("❌ [유효하지 않은 Base64 데이터]");
    }
    console.log("📝 [저장할 데이터 크기]:", base64Data.length);

    // 3. Base64 데이터를 파일로 저장
    console.log("💾 [파일 저장]: Base64 데이터를 파일로 저장 중...");
    await FileSystem.writeAsStringAsync(filePath, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // 4. 파일 정보 확인
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    console.log("📄 [파일 정보]:", fileInfo);

    // 5. 파일 크기 검증
    if (!fileInfo.exists || fileInfo.size < 44) {
      throw new Error("❌ [파일이 저장되지 않거나 WAV 헤더가 없음]");
    }

    // 6. WAV 파일 재생
    console.log("🎵 [파일 재생]: AVPlayer를 통해 파일 재생을 시도합니다...");
    const { sound } = await Audio.Sound.createAsync({ uri: filePath });
    await sound.playAsync();
    console.log("✅ [파일 재생 성공]");
  } catch (error) {
    console.error("❌ [오류 발생]:", error);
  }
};

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const scrollViewRef = useRef(null);

  const initialMessages = [
    {
      role: "ROLE_USER",
      content:
        "너의 여기 매장의 이름은 [세종 카페]이고 너의 이름은 [마음]이야 매장은 오전 10시 부터 오후 10시까지로이야기 해줘 그리고 이 매장에서 추천하는 음료는 아메리카노야 현재 날씨가 추우니 만약에 음료를 추천을 받는다면 날씨가 추우니 아메리카노 핫으로 추천해줘 알겠지? 그리고 답변은 자연스럽게 해줘 반복적인 답변을 절대로 하지마 첫 대답의 답변으로 [안녕하세요, 세종카페 입니다. 무엇을 도와드릴까요]라도 답변해 그리고 묻는 답변만 대답을 해줘 예를 들어 운영시간을 물어보면 운영시간에 관한 답변만 진행을 하고 음료 추천에 대한 답변을 받으면 음료 추천에 관한 답변만 진행을 해 알겠지? 다시 강조 할께 묻는 답변에 관한 주제만 답변을 해줘 반드시 꼭!! 운영시간 알려줘 라고 묻는다면 운영시간에 관한 답변만 하고 운영시간에 관한 답변으로 절대로 음료 추천이라는 단어를 말하지 알겠지",
    },
    {
      role: "ROLE_ASSISTANT",
      content: "안녕하세요,",
    },
  ];

  useEffect(() => {
    sendMessageToAI(initialMessages[0].content, true);
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessageToAI = async (userMessage, isInitial = false) => {
    if (!isInitial) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "ROLE_USER", content: userMessage },
      ]);
    }

    setIsLoading(true);

    try {
      console.log("📤 [사용자 메시지]:", userMessage);

      const response = await axios.post(
        "https://norchestra.maum.ai/harmonize/dosmart",
        {
          app_id: "77e64f9d-a586-5ec4-8b6e-b88a91d56a93",
          name: "sejong_70b_stream",
          item: ["maumgpt-maal2-70b-streamchat"],
          param: [
            {
              utterances: [
                ...initialMessages,
                ...messages,
                { role: "ROLE_USER", content: userMessage },
              ],
              config: {
                top_p: 0.6,
                top_k: 1,
                temperature: 0.9,
                presence_penalty: 0.0,
                frequency_penalty: 0.0,
                repetition_penalty: 1.0,
              },
            },
          ],
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const assistantMessage = response.data;
      console.log("🤖 [AI 응답 메시지]:", assistantMessage);

      const voiceResponse = await axios.post(
        "https://norchestra.maum.ai/harmonize/dosmart",
        {
          app_id: "78777888-88f4-5357-bab9-f1599bc63840",
          name: "sejong_tts_ko_w1",
          item: ["spw-rftap-jhe-stream"],
          param: [
            {
              lang: 1,
              sampleRate: 22050,
              text: assistantMessage,
              speaker: 0,
              audioEncoding: 0,
              durationRate: 1.0,
              emotion: 0,
              padding: {
                begin: 0.1,
                end: 0.1,
              },
              profile: "none",
              speakerName: "rftap_JHE",
            },
          ],
        },
        {
          headers: { "Content-Type": "application/json" },
          responseType: "arraybuffer", // 바이너리 데이터를 받기 위해 설정
        }
      );

      console.log(
        "🎙️ [TTS 응답 데이터 크기]:",
        voiceResponse.data?.byteLength || 0
      );

      if (!voiceResponse.data || voiceResponse.data.byteLength === 0) {
        throw new Error("❌ [TTS 응답 데이터가 비어 있습니다]");
      }

      await saveAndPlayAudio(voiceResponse.data);

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "ROLE_ASSISTANT", content: assistantMessage },
      ]);
    } catch (error) {
      console.error("❌ [API 호출 중 오류]:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "ROLE_ASSISTANT",
          content: "TTS 응답 생성에 실패했습니다.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      sendMessageToAI(inputText);
      setInputText("");
    }
  };

  const renderMessages = () =>
    messages.map((message, index) => (
      <View
        key={index}
        style={[
          {
            marginHorizontal: 10,
            padding: 15,
            borderRadius: 20,
            marginVertical: 5,
            alignSelf: message.role === "ROLE_USER" ? "flex-end" : "flex-start",
            backgroundColor:
              message.role === "ROLE_USER" ? "skyblue" : "#FFFFFF",
          },
        ]}
      >
        <Text style={{ fontSize: 17, paddingHorizontal: 8 }}>
          {message.content}
        </Text>
      </View>
    ));

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground source={backgroundImage} style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)", // 반투명 어두운 효과
            }}
          >
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={{ padding: 20, marginTop: 30 }}
            >
              {renderMessages()}
              {isLoading && <ActivityIndicator color="#007AFF" />}
            </ScrollView>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
                backgroundColor: "#F5F5F5",
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  height: 40,
                  backgroundColor: "#FFF",
                  borderColor: "#E0E0E0",
                  borderWidth: 1,
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  marginRight: 10,
                }}
                value={inputText}
                onChangeText={setInputText}
                placeholder="메시지를 입력하세요..."
              />
              <TouchableOpacity onPress={handleSendMessage}>
                <Ionicons name="send" size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ChatBot;
