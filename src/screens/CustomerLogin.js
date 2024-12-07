//회원 로그인 페이지

import React, { useState } from "react";
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const CustomerLogin = ({ navigation }) => {
  const [orderPrice, setOrderPrice] = useState(0); //총 가격
  const Idcart = useSelector((state) => state.cartId);
  const stamp = useSelector((state) => state.stamp); //스템프 갯수
  const usestamp = useSelector((state) => state.useStamp); //사용후 스템프 갯수

  const [stampcount, setstampcount] = useState(stamp);
  const [useStampcount, setuseStampcount] = useState(usestamp);

  const [discountprice, setDiscountPrice] = useState(0); // 할인 금액 상태 추가
  console.log(discountprice);

  useFocusEffect(
    useCallback(() => {
      if (stamp !== stampcount || usestamp !== useStampcount) {
        console.log("Redux 상태 변경 감지:", stamp, usestamp);
        setstampcount(stamp); // 로컬 상태 업데이트
        setuseStampcount(usestamp);

        // 할인 금액 업데이트
        const newDiscountPrice = (stamp - usestamp) * 5000;
        setDiscountPrice(newDiscountPrice);
      }
    }, [stamp, usestamp])
  );

  useEffect(() => {
    axios.get(`http://43.202.33.4:8081/items/${Idcart}`).then((response) => {
      setOrderPrice(response.data.totalPrice); //총 가격!
    });
  }, []);

  //할인 가격
  let discount = useSelector((state) => state.discount);
  let totalPrice = orderPrice - discount;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* 상단 회원 로그인 섹션 */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>회원 로그인</Text>
          <Text style={styles.headerSubtitle}>
            회원이 아니시면 [회원가입]을 진행해주세요
          </Text>

          {/* 구분선 */}
          <View style={styles.divider} />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate("LoginPage")}
            >
              <Image
                source={require("../../assets/CustomerLogin.png")}
                style={styles.iconImageFirst}
              />
              <Text style={styles.iconText}>로그인</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate("AddAccount")}
            >
              <Image
                source={require("../../assets/Addmen.png")}
                style={styles.iconImage}
              />
              <Text style={styles.iconText}>회원가입</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate("PhoneNumberPad")}
            >
              <Image
                source={require("../../assets/PhoneNumber.png")}
                style={styles.iconImage}
              />
              <Text style={styles.iconText}>번호 적립</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 소셜 로그인 섹션 */}
        <View style={styles.socialLoginContainer}>
          <Text style={styles.socialLoginTitle}>소셜 로그인</Text>
          <View style={styles.socialButtonRow}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => navigation.navigate("NaverLogin")}
            >
              <Image
                source={require("../../assets/NaverImage.png")}
                style={styles.socialIcon}
              />
              <Text style={styles.socialText}>네이버</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 주문 금액 정보 섹션 */}
        <View style={styles.orderInfoContainer}>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>주문 금액</Text>
            <Text style={styles.orderInfoValue}>{orderPrice}원</Text>
          </View>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>할인 금액</Text>
            <Text style={styles.discountValue}>-{discount}원</Text>
          </View>
          <View style={styles.dividerincide} />
          <View style={styles.orderInfoRow}>
            <Text style={styles.totalAmountLabel}>결제 예정 금액</Text>
            <Text style={styles.totalAmountValue}>{totalPrice}원</Text>
          </View>
        </View>

        {/* 하단 버튼 섹션 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>이전</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.payButton}
            onPress={() => navigation.navigate("SelectPayment")}
          >
            <Text style={styles.buttonText}>결제하기</Text>
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
  },
  innerContainer: {
    width: "90%",
  },
  headerContainer: {
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "flex-start",
  },
  iconButton: {
    width: 130,
    height: 130,
    paddingVertical: 14,
    marginRight: 20,
    backgroundColor: "#FFF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#E4D2C3",
    borderWidth: 3,
    elevation: 3,
  },
  iconImage: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  iconImageFirst: {
    width: 49,
    height: 43,
    marginBottom: 8,
  },

  iconText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  divider: {
    height: 3,
    backgroundColor: "#E4D2C3",
    marginVertical: 10,
  },
  dividerincide: {
    height: 2,
    backgroundColor: "#E4D2C3",
    marginVertical: 3,
  },
  socialLoginContainer: {
    marginVertical: 20,
  },
  socialLoginTitle: {
    fontWeight: "bold",
    fontSize: 22,
    color: "#333",
    marginBottom: 12,
    textAlign: "left",
  },
  socialButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  socialButton: {
    width: 130,
    height: 130,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 20,
    borderColor: "#E4D2C3",
    borderWidth: 3,
    elevation: 3,
  },
  socialIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  socialText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  orderInfoContainer: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 16,
    marginVertical: 18,
    width: "100%",
    borderColor: "#E4D2C3",
    borderWidth: 3,
    elevation: 3,
  },
  orderInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  orderInfoLabel: {
    fontSize: 16,
    color: "#555",
  },
  orderInfoValue: {
    fontSize: 16,
    color: "#333",
  },
  discountValue: {
    fontSize: 16,
    color: "#00A0FF",
  },
  totalAmountLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D00000",
  },
  totalAmountValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D00000",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  backButton: {
    backgroundColor: "#888",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  payButton: {
    backgroundColor: "#FF4D4D",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});

export default CustomerLogin;
