import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

const PaymentScreen = ({ navigation }) => {
  const orderPrice = useSelector((state) => state.totalPrice); //사용자 Id 가져오기!
  const stamp = useSelector((state) => state.stamp); //스템프 갯수
  const usestamp = useSelector((state) => state.useStamp); //사용후 스템프 갯수

  const [stampcount, setstampcount] = useState(stamp);
  const [useStampcount, setuseStampcount] = useState(usestamp);

  console.log("이얏");
  console.log(stampcount);
  console.log(useStampcount);

  useFocusEffect(
    useCallback(() => {
      if (stamp !== stampcount || usestamp !== useStampcount) {
        console.log("Redux 상태 변경 감지:", stamp, usestamp);
        setstampcount(stamp); // 로컬 상태 업데이트
        setuseStampcount(usestamp);
      }
    }, [stamp, usestamp])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>결제 수단을 선택해주세요</Text>
      <View style={styles.couponContainer}>
        <TouchableOpacity
          style={styles.couponButton}
          onPress={() => navigation.navigate("UseCoupon")}
        >
          <Image
            source={require("../../assets/UseCoupon.png")} // 쿠폰 이미지 파일 추가
            style={styles.buttonImage}
          />
          <Text style={styles.couponText}>쿠폰 사용</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.paymentOptionsContainer}>
        <TouchableOpacity
          style={styles.paymentOption}
          onPress={() => navigation.navigate("CardPayment")}
        >
          <Image
            source={require("../../assets/CardPayment.png")} // 카드 이미지 파일 추가
            style={styles.buttonImage}
          />
          <Text style={styles.paymentOptionText}>체크/신용카드</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.paymentOption}
          onPress={() => navigation.navigate("CounterCheck")}
        >
          <Image
            source={require("../../assets/CounterPayment.png")} // 카운터 결제 이미지 파일 추가
            style={styles.buttonImage}
          />
          <Text style={styles.paymentOptionText}>카운터 결제</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.amountContainer}>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>주문 금액</Text>
          <Text style={styles.amountValue}>{orderPrice}원</Text>
        </View>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>할인 금액</Text>
          <Text style={styles.amountValue}>-{(stamp - usestamp) * 5000}원</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.amountRow}>
          <Text style={styles.amountLabelTotal}>결제 예정 금액</Text>
          <Text style={styles.amountTotalTotal}>
            {orderPrice - (stamp - usestamp) * 5000 > 0
              ? orderPrice - (stamp - usestamp) * 5000
              : 0}
            원
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.navigate("Menu")}
      >
        <Text style={styles.cancelButtonText}>결제 취소</Text>
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

  divider: {
    height: 2,
    backgroundColor: "#E4D2C3",
    marginVertical: 6,
  },

  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A4A4A",
    marginBottom: 30,
  },

  couponContainer: {
    width: "80%",
    marginBottom: 20,
  },

  couponButton: {
    backgroundColor: "#fff",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    borderColor: "#E4D2C3",
    borderWidth: 3,
    width: "100%",
    flexDirection: "row", // 이미지와 텍스트가 가로로 나란히 배치되도록 설정
    justifyContent: "center",
  },

  couponText: {
    fontSize: 18,
    color: "#4A4A4A",
    marginLeft: 10, // 이미지와 텍스트 사이의 간격 설정
  },
  paymentOptionsContainer: {
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  paymentOption: {
    backgroundColor: "#fff",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    borderColor: "#E4D2C3",
    borderWidth: 3,
    width: "48%",
    flexDirection: "row", // 이미지와 텍스트가 가로로 나란히 배치되도록 설정
    justifyContent: "center",
  },
  paymentOptionText: {
    fontSize: 18,
    color: "#4A4A4A",
    marginLeft: 10, // 이미지와 텍스트 사이의 간격 설정
  },
  amountContainer: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    borderColor: "#E4D2C3",
    borderWidth: 3,
    marginBottom: 20,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  amountLabel: {
    fontSize: 16,
    color: "#4A4A4A",
  },
  amountLabelTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF4500",
  },

  amountValue: {
    fontSize: 16,
    color: "#4A4A4A",
  },
  amountTotalTotal: {
    fontSize: 18,
    color: "#FF4500",
    fontWeight: "bold",
  },
  amountTotal: {
    fontSize: 16,
    color: "#FF4500",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#4A4A4A",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 10,
    width: "80%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  buttonImage: {
    width: 24,
    height: 24,
  },
});

export default PaymentScreen;
