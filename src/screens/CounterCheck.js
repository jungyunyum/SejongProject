import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
} from "react-native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

const CounterCheck = ({ navigation }) => {
  //모든 정보 초기화
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

  const [orderNumber, setOrderNumber] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const customerId = useSelector((state) => state.customerId);

  const fetchOrderNumber = async () => {
    try {
      setIsLoading(true);
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
        setOrderNumber(response.data);
      } else {
        Alert.alert(
          "Error",
          `Failed to fetch order number. Status: ${response.status}`
        );
      }
    } catch (error) {
      if (error.response) {
        Alert.alert("Error", `Server Error: ${error.response.data.message}`);
      } else if (error.request) {
        Alert.alert(
          "Error",
          "No response received. Please check your connection."
        );
      } else {
        Alert.alert("Error", `Unexpected error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderNumber();
  }, []);

  const handleHomeButtonPress = () => {
    navigation.navigate("Home");
    dispatch({ type: "increaseId" });
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <Text>로딩 중...</Text>
      ) : (
        <>
          <Text style={styles.title}>주문이 완료되었습니다</Text>
          <View style={styles.content}>
            <Image
              source={require("../../assets/CounterPayment.png")}
              style={styles.iconImage}
            />
            <Text style={styles.orderNumberLabel}>주문 번호</Text>
            <Text style={styles.orderNumber}>
              {orderNumber ? orderNumber : "불러오는 중..."}
            </Text>
            <Text style={styles.instruction}>
              카운터에서 결제를 진행해주세요.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={handleHomeButtonPress}
          >
            <Text style={styles.homeButtonText}>처음으로</Text>
          </TouchableOpacity>
        </>
      )}
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
    width: 130,
    height: 130,
    resizeMode: "contain",
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

export default CounterCheck;
