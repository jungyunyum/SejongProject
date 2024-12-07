import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const FinalCheck = ({ navigation }) => {
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, settotalQuantitiy] = useState(0);
  const [cart, setCart] = useState([]);
  const [box, setbox] = useState(null);
  const Idcart = useSelector((state) => state.cartId);

  useEffect(() => {
    axios.get(`http://43.202.33.4:8081/items/${Idcart}`).then((response) => {
      setbox(response.data);
      const totalCount = response.data.orderInCartDtoList.reduce(
        (sum, item) => sum + item.count,
        0
      );
      setTotalPrice(response.data.totalPrice);
      dispatch({ type: "totalPrice", payload: response.data.totalPrice });
      settotalQuantitiy(totalCount);
      setCart(response.data.orderInCartDtoList);
    });
  }, []);

  data = box;

  function getImagePathByName(productName) {
    for (const category of data.itemListDtoList) {
      for (const item of category.itemDtos) {
        if (item.name === productName) {
          return item.imagePath;
        }
      }
    }
    return null;
  }

  const renderCartItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image
        source={{ uri: getImagePathByName(item.itemName) }}
        style={styles.itemImage}
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.itemName}</Text>
        <Text style={styles.itemName}>
          {item.temperature && item.size
            ? `${item.temperature.toLowerCase()} / ${item.size.toLowerCase()}`
            : ""}
        </Text>
      </View>
      <View style={styles.itemBox}>
        <Text style={styles.itemPrice}>{item.price * item.count} 원</Text>
        <Text style={styles.itemOptions}>수량: {item.count}</Text>
      </View>
    </View>
  );

  // 포장하기 버튼 클릭 시 호출되는 함수
  const handlePackaging = async () => {
    try {
      await axios.post(`http://43.202.33.4:8081/order/packaging`, {
        cartId: Idcart,
        packaging: true,
      });
      navigation.navigate("CustomerLogin");
    } catch (error) {
      console.error("포장 정보 전송 오류:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <FlatList
          data={cart}
          keyExtractor={(item) => item.orderId.toString()}
          ListHeaderComponent={
            <Text style={styles.title}>주문 내역을 확인해주세요</Text>
          }
          ListFooterComponent={
            <View style={{ marginTop: 20 }}>
              <View style={styles.summaryContainer}>
                <Text style={styles.summaryText}>
                  총 수량: {`  ${totalQuantity}`} 개
                </Text>
                <Text style={styles.summaryText}>
                  총 주문 금액: {`  ${totalPrice}`} 원
                </Text>
              </View>
              <View style={styles.footerButtonsContainer}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.backButtonText}>돌아가기</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handlePackaging} // 포장하기 버튼에 비동기 함수 연결
                >
                  <Text style={styles.saveButtonText}>포장하기</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.eatButton}
                  onPress={() => navigation.navigate("CustomerLogin")}
                >
                  <Text style={styles.eatButtonText}>먹고가기</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          renderItem={renderCartItem}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
};

// 스타일 정의 부분은 기존과 동일하게 유지
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f3ea",
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    width: "90%",
    alignItems: "center",
  },
  title: {
    fontSize: 27,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#8d6e63",
  },
  itemContainer: {
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
    width: "100%",
  },
  itemImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
  },
  itemBox: {
    flex: 1,
    alignItems: "flex-end",
    paddingHorizontal: 4,
  },
  itemTitle: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 3,
  },
  itemName: {
    paddingHorizontal: 3,
    fontSize: 14,
    fontWeight: "bold",
    color: "rgb(160, 160, 160)",
  },
  itemOptions: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#e57373",
    marginTop: 5,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e57373",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#5d4037",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: "100%",
  },
  summaryText: {
    marginHorizontal: 5,
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffcc80",
  },
  footerButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  backButton: {
    backgroundColor: "#9e9e9e",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#64b5f6",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  eatButton: {
    backgroundColor: "#d32f2f",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  eatButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default FinalCheck;
