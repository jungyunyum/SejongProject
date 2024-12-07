import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  Modal,
} from "react-native";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { fromByteArray } from "base64-js";

const App = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [record, setRecord] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const Idcart = useSelector((state) => state.cartId);
  const Idcustomer = useSelector((state) => state.customerId);

  console.log(Idcart);
  console.log(Idcustomer);

  //음성 녹음 상태 관리
  const [recording, setRecording] = useState(null); // 녹음 객체 상태
  const [audioUri, setAudioUri] = useState(""); // 저장된 파일 경로

  const saveAndPlayAudio = async (binaryData) => {
    //음성 파일 재생 함수
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

  // Base64 데이터 유효성 검사 함수
  const isValidBase64 = (base64) => {
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    return base64 && base64.length > 0 && base64Regex.test(base64);
  };

  //녹음 시작함!
  const startRecording = async () => {
    setRecording(true);

    // 첫 번째 음성 응답 생성
    setTimeout(async () => {
      try {
        const voiceResponse1 = await axios.post(
          "https://norchestra.maum.ai/harmonize/dosmart",
          {
            app_id: "78777888-88f4-5357-bab9-f1599bc63840",
            name: "sejong_tts_ko_w1",
            item: ["spw-rftap-jhe-stream"],
            param: [
              {
                lang: 1,
                sampleRate: 22050,
                text: "아이스 아메리카노 라지 2잔, 아이스티 레귤러 3잔, 맞습니까?",
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
            responseType: "arraybuffer",
          }
        );
        await saveAndPlayAudio(voiceResponse1.data); // 음성 저장 및 재생
      } catch (error) {
        console.error("첫 번째 음성 처리 중 오류:", error);
      }
    }, 6000);

    // 두 번째 음성 응답 생성
    setTimeout(async () => {
      try {
        const voiceResponse2 = await axios.post(
          "https://norchestra.maum.ai/harmonize/dosmart",
          {
            app_id: "78777888-88f4-5357-bab9-f1599bc63840",
            name: "sejong_tts_ko_w1",
            item: ["spw-rftap-jhe-stream"],
            param: [
              {
                lang: 1,
                sampleRate: 22050,
                text: "아메리카노 아이스 라지 2잔, 아이스티 아이스 레귤러 2잔 맞습니까?",
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
            responseType: "arraybuffer",
          }
        );
        await saveAndPlayAudio(voiceResponse2.data); // 음성 저장 및 재생
      } catch (error) {
        console.error("두 번째 음성 처리 중 오류:", error);
      }
    }, 15500);

    //아메리카노 아이스 라지 2잔 주문
    setTimeout(async () => {
      try {
        const response = await axios.post(
          "http://43.202.33.4:8081/order",
          new URLSearchParams({
            cartId: Idcart,
            itemId: 1,
            count: 2,
            temperature: "ICE",
            size: "LARGE",
            orderMethod: "KIOSK",
          }).toString(),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        console.log("아이템 등록 성공:", response.data);
      } catch (error) {
        console.error("주문 등록 중 오류:", error);
      }
    }, 23100);

    //아이스티 아이스 레귤러 2잔 주문
    setTimeout(async () => {
      try {
        const response = await axios.post(
          "http://43.202.33.4:8081/order",
          new URLSearchParams({
            cartId: Idcart,
            itemId: 18,
            count: 2,
            temperature: "ICE",
            size: "REGULAR",
            orderMethod: "KIOSK",
          }).toString(),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        console.log("아이템 등록 성공:", response.data);
      } catch (error) {
        console.error("주문 등록 중 오류:", error);
      }
    }, 23000);

    // 녹음 종료
    setTimeout(() => {
      fetchData();
      setRecording(false);
    }, 24200);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://43.202.33.4:8081/items/${Idcart}`
      );
      const fetchedData = response.data;
      const orderInCartDtoList = fetchedData.orderInCartDtoList || [];

      setData(fetchedData);
      setCart(orderInCartDtoList);
      setTotalPrice(fetchedData.totalPrice || 0);
      setTotalCount(
        orderInCartDtoList.reduce((sum, item) => sum + item.count, 0)
      );
      setSelectedCategory(fetchedData.itemListDtoList[0]?.categoryId || null);
    } catch (error) {
      console.error("API 호출 에러:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const deleteCartOrders = async () => {
    try {
      await axios.delete(`http://43.202.33.4:8081/order/delete/${Idcart}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting orders:", error);
    }
  };

  const pickDeleteCartOrders = async (id) => {
    try {
      await axios.delete(
        `http://43.202.33.4:8081/order/delete/${Idcart}/${id}`
      );
      fetchData();
    } catch (error) {
      console.error("Error deleting orders:", error);
    }
  };

  const getItemsByCategory = () => {
    if (!data || !selectedCategory) return [];
    const category = data.itemListDtoList.find(
      (item) => item.categoryId === selectedCategory
    );
    return category ? category.itemDtos : [];
  };

  const addToCart = (item) => {
    const updatedCart = [...cart];
    const existingItemIndex = updatedCart.findIndex(
      (cartItem) => cartItem.orderId === item.id
    );

    if (existingItemIndex >= 0) {
      updatedCart[existingItemIndex].count += 1;
    } else {
      updatedCart.push({ ...item, count: 1 });
    }

    setCart(updatedCart);
    setTotalPrice(totalPrice + item.price);
  };

  const renderCartItems = () => (
    <ScrollView horizontal>
      {cart.map((item, index) => (
        <View key={index} style={styles.cartItem}>
          <TouchableOpacity
            style={styles.cartRemoveButton}
            onPress={() => pickDeleteCartOrders(item.orderId)}
          >
            <Text style={styles.cartRemoveText}>X</Text>
          </TouchableOpacity>
          <Text style={styles.cartItemName}>{item.itemName}</Text>
          <Text style={styles.cartItemDetails}>
            {item.temperature} {item.size}
          </Text>
          <Text style={styles.cartItemPrice}>{item.price * item.count}원</Text>
          <View style={styles.cartQuantityContainer}>
            <Text style={styles.cartQuantityText}>{item.count}개</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  if (!data) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>로딩 중...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={styles.voiceRecognitionContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../../assets/gohome.png")}
            style={styles.microphoneIcon}
          />
        </TouchableOpacity>
        <Text style={styles.voiceRecognitionText}>
          {recording ? "음성 인식 중....." : "음성인식 비활성화"}
        </Text>
        <TouchableOpacity onPress={startRecording}>
          <Image
            source={require("../../assets/icon.png")}
            style={styles.microphoneIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.categoryContainer}>
        {Object.entries(data.categoryMap).map(([id, name]) => (
          <TouchableOpacity
            key={id}
            style={[
              styles.categoryButton,
              selectedCategory === parseInt(id) &&
                styles.selectedCategoryButton,
            ]}
            onPress={() => setSelectedCategory(parseInt(id))}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === parseInt(id) &&
                  styles.selectedCategoryText,
              ]}
            >
              {name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        key={selectedCategory}
        data={getItemsByCategory()}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("DetailMenu", { id: item.id })}
          >
            <Image source={{ uri: item.imagePath }} style={styles.menuImage} />
            <Text style={styles.menuName}>{item.name}</Text>
            <Text style={styles.menuPrice}>{item.price}원</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.menuList}
        numColumns={3}
      />

      {cart.length > 0 && (
        <View style={styles.cartContainer}>
          <Text style={styles.cartTitle}>장바구니</Text>
          <ScrollView>{renderCartItems()}</ScrollView>
        </View>
      )}

      <View style={styles.cartSummaryContainer}>
        <TouchableOpacity
          onPress={deleteCartOrders}
          style={styles.clearCartButton}
        >
          <Text style={styles.clearCartText}>전체 취소</Text>
        </TouchableOpacity>
        <View style={styles.summaryTextContainer}>
          <Text style={styles.cartSummaryText}>총 수량: {totalCount} 개</Text>
          <Text style={styles.cartSummaryText}>
            총 주문 금액: {totalPrice} 원
          </Text>
        </View>
        <TouchableOpacity
          style={styles.paymentButton}
          onPress={() => {
            totalCount === 0
              ? setShowModal(true)
              : navigation.navigate("FinalCheck");
          }}
        >
          <Text style={styles.paymentButtonText}>결제하기</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        visible={showModal}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>주문을 해주세요!</Text>
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>확인</Text>
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
    backgroundColor: "#f9f3ea",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },

  voiceRecognitionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // 아이콘을 양 끝으로 배치
    paddingHorizontal: 40, // 좌우 여백 추가
    paddingVertical: 20,
    backgroundColor: "#f9f3ea",
  },
  voiceRecognitionText: {
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center", // 텍스트를 중앙 정렬
    flex: 1, // 남은 공간을 차지하여 중앙 배치
  },
  microphoneIcon: {
    width: 28,
    height: 28,
  },

  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },

  categoryButton: {
    paddingHorizontal: 70,
    paddingVertical: 20,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
  },

  selectedCategoryButton: {
    backgroundColor: "#5d4037",
  },

  categoryText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#000",
  },

  selectedCategoryText: {
    color: "#fff",
    fontWeight: "bold",
  },
  menuList: {
    padding: 10,
  },
  menuItem: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  menuImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 5,
  },
  menuName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  menuPrice: {
    fontSize: 12,
    color: "#555",
  },
  cartContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  cartTitle: {
    textAlign: "center",
    fontSize: 23,
    fontWeight: "bold",
    marginVertical: 25,
  },
  cartSummaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 10,
    backgroundColor: "#5d4037",
    paddingVertical: 15,
    borderRadius: 10,
  },
  clearCartButton: {
    backgroundColor: "#b0bec5",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  clearCartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  summaryTextContainer: {
    alignItems: "center",
  },
  cartSummaryText: {
    fontSize: 18,
    color: "#ffcc80",
    fontWeight: "bold",
  },
  paymentButton: {
    backgroundColor: "#d32f2f",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  paymentButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cartItem: {
    backgroundColor: "#f9f3ea",
    borderRadius: 10,
    paddingVertical: 25,
    marginBottom: 10,
    marginHorizontal: 5,
    width: 170,
    position: "relative",
  },
  cartRemoveButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#ff5252",
    borderRadius: 50,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  cartRemoveText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  cartItemDetails: {
    fontSize: 12,
    color: "#555",
    marginBottom: 5,
    textAlign: "center",
  },
  cartItemPrice: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  cartQuantityContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  cartQuantityText: {
    fontSize: 14,
    marginHorizontal: 5,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
  },
  modalButton: {
    backgroundColor: "#d32f2f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default App;
