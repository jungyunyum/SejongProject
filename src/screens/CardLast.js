import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";
import { useDispatch } from "react-redux";

const CardLast = ({ navigation }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: "customerId", payload: 0 });
    dispatch({ type: "cartId", payload: 0 });
    dispatch({ type: "setDiscount", payload: 0 });
    dispatch({ type: "setStamp", payload: 0 });
    dispatch({ type: "useStamp", payload: 0 });
    dispatch({ type: "totalPrice", payload: 0 });
    dispatch({ type: "phoneNumber", payload: "" });
  }, [dispatch]);

  const [orderNumber, setOrderNumber] = useState(null); //사용자 반환 id

  //로그인 초기화,주문 번호 반환 받기!
  const fetchOrderNumber = async () => {
    try {
      const response = await axios.patch(
        "http://43.202.33.4:8081/order/number",

        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("성공!");
        console.log(response.data);
        setOrderNumber(response.data); //반환 id 저장하기
        Alert.alert("Success", "Order number retrieved successfully.");
      } else {
        Alert.alert(
          "Error",
          `Failed to fetch order number. Status: ${response.status}`
        );
      }
    } catch (error) {
      Alert.alert("Error", `An error occurred: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchOrderNumber();
  }, []);

  const handleHomeButtonPress = () => {
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>주문이 완료되었습니다</Text>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Image
            source={require("../../assets/receipt.png")}
            style={styles.iconImage}
          />
        </View>

        <Text style={styles.orderNumberLabel}>주문 번호</Text>
        <Text style={styles.orderNumber}>{orderNumber}</Text>
        <Text style={styles.instruction}>출력되는 영수증을 챙겨주세요</Text>
      </View>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={handleHomeButtonPress}
      >
        <Text style={styles.homeButtonText}>처음으로</Text>
      </TouchableOpacity>
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
    fontSize: 23,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
  },
  content: {
    backgroundColor: "#fff",
    width: "80%",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 30,
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    borderRadius: 20,
  },
  orderNumberLabel: {
    fontSize: 20,
    color: "#333",
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#FF5733",
    marginBottom: 10,
  },
  instruction: {
    fontSize: 18,
    color: "#555",
  },
  homeButton: {
    backgroundColor: "#4A4A4A",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
  },
  homeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CardLast;
