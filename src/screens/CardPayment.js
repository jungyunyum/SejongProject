import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";

const CardReaderScreen = ({ navigation }) => {
  const [TotalPrice, setTotalPrice] = useState(0);
  const [Cardnumber, setCardNumber] = useState();
  const [ChangeText, setChangeText] = useState(
    "결제가 완료될 때까지 카드를 빼지 마세요"
  );

  useEffect(() => {
    axios.get("http://43.202.33.4:8081/items/1").then((response) => {
      setTotalPrice(response.data.totalPrice);
    });
  }, []);

  useEffect(() => {
    //1번만 실행을 할거임!
    setTimeout(() => {
      setCardNumber("1234-****-****-****");
    }, 2500); // 2.5초 후 카드 번호 표시

    setTimeout(() => {
      setChangeText("승인 완료");
    }, 2500); // 2.5초 후 승인 메시지 변경

    setTimeout(() => {
      navigation.navigate("CardLast");
    }, 4000); // 4초 후 완료 페이지로 이동
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>카드 리더기에 카드를 넣어주세요</Text>

        <View style={styles.readerContainer}>
          {/* 카드 리더기 이미지 부분 */}
          <Image
            source={require("../../assets/CardExample.png")}
            style={styles.readerImage}
          />
          <Text style={styles.instruction}>{ChangeText}</Text>
        </View>

        <View style={styles.paymentInfoContainer}>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>할부 개월</Text>
            <Text style={styles.paymentDetail}>일시불</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>카드 번호</Text>
            <Text style={styles.paymentDetail}>{Cardnumber}</Text>
          </View>
        </View>

        <View style={styles.footerButtonsContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => navigation.navigate("CardLast")}
          >
            <Text style={styles.buttonText}>승인 요청</Text>
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
    paddingHorizontal: 20,
  },
  innerContainer: {
    width: "85%",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  readerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  readerImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
    borderRadius: 20,
  },
  instruction: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
  },
  paymentInfoContainer: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  paymentLabel: {
    fontSize: 14,
    color: "#555",
  },
  paymentValue: {
    fontSize: 16,
    color: "#FF5733",
    fontWeight: "bold",
  },
  paymentDetail: {
    fontSize: 16,
    color: "#333",
  },
  footerButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#9e9e9e",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#d32f2f",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CardReaderScreen;
