import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Modal,
} from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";

const ChangeMenu = ({ route, navigation }) => {
  const Idcart = useSelector((state) => state.cartId); //Idcart 가져오기
  const { id } = route.params; // Route에서 id 정보 가져오기
  const [name, setName] = useState(""); // 아이템 이름
  const [price, setPrice] = useState(0); // 아이템 가격
  const [quantity, setQuantity] = useState(1); // 음료 양
  const [temperature, setTemperature] = useState(null); // 음료 온도
  const [size, setSize] = useState(null); // 음료 사이즈
  const [modalVisible, setModalVisible] = useState(false); // 모달창 기능
  const [picture, setPicture] = useState(null); // 사진 URL
  const [allItems, setAllItems] = useState([]); // 모든 데이터를 저장

  // 전체 데이터를 가져오기(그냥 아이템 가져오기!)
  useEffect(() => {
    axios
      .get("http://43.202.33.4:8081/items/1")
      .then((response) => {
        const data = response.data.itemListDtoList.flatMap(
          (itemList) => itemList.itemDtos
        );
        setAllItems(data);
      })
      .catch((error) => console.error(error));
  }, []);

  // 현재 아이템 정보를 가져오기(그냥 아이템 정보 가져오기!)
  useEffect(() => {
    axios
      .get(`http://43.202.33.4:8081/item/${id}`)
      .then((response) => {
        const item = response.data;
        setName(item.name);
        setPrice(item.price);
      })
      .catch((error) => console.error(error));
  }, [id]);

  // 이름으로 이미지를 찾는 함수
  const findImageByName = (itemName) => {
    const item = allItems.find((item) => item.name === itemName);
    return item ? item.imagePath : null;
  };

  // 이름 변경 시 이미지 업데이트
  useEffect(() => {
    if (name) {
      const imagePath = findImageByName(name);
      setPicture(imagePath || "");
    }
  }, [name, allItems]);

  const handleAddToCart = () => {
    if (
      !temperature &&
      !size &&
      !(
        id === 26 ||
        id === 27 ||
        id === 28 ||
        id === 29 ||
        id === 30 ||
        id === 31 ||
        id === 32 ||
        id === 33
      )
    ) {
      alert("온도와 사이즈를 선택해주세요.");
      return;
    }

    setModalVisible(true);

    if (
      id === 26 ||
      id === 27 ||
      id === 28 ||
      id === 29 ||
      id === 30 ||
      id === 31 ||
      id === 32 ||
      id === 33
    ) {
      axios
        .post(
          `http://43.202.33.4:8081/order/update/${id}`,
          new URLSearchParams({
            cartId: Idcart,
            itemId: id,
            count: quantity,
            orderMethod: "AI",
          }).toString(),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((response) => console.log(response.data))
        .catch((error) => console.error(error));
    } else {
      axios
        .post(
          `http://43.202.33.4:8081/order/update/${id}`,
          new URLSearchParams({
            cartId: Idcart,
            itemId: id,
            count: quantity,
            temperature: temperature,
            size: size,
            orderMethod: "AI",
          }).toString(),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((response) => console.log(response.data))
        .catch((error) => console.error(error));
    }

    setTimeout(() => setModalVisible(false), 500);
    setTimeout(() => navigation.navigate("Menu"), 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>상세 옵션을 선택해주세요</Text>
      </View>

      <View style={styles.itemContainer}>
        <Image source={{ uri: picture }} style={styles.itemImage} />
        <Text style={styles.itemName}>{name}</Text>
        <Text style={styles.itemPrice}>{price}원</Text>
      </View>

      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setQuantity(Math.max(1, quantity - 1))}
        >
          <Text style={styles.quantityText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityValue}>{quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setQuantity(quantity + 1)}
        >
          <Text style={styles.quantityText}>+</Text>
        </TouchableOpacity>
      </View>

      {!(
        id === 26 ||
        id === 27 ||
        id === 28 ||
        id === 29 ||
        id === 30 ||
        id === 31 ||
        id === 32 ||
        id === 33
      ) && (
        <View style={styles.optionContainer}>
          <View style={styles.optionRow}>
            <Text style={styles.optionTitle}>HOT / ICE</Text>
            <View style={styles.optionButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  temperature === "HOT" && { backgroundColor: "#FF6B6B" },
                ]}
                onPress={() => setTemperature("HOT")}
              >
                <Text style={styles.optionButtonText}>hot</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  temperature === "ICE" && { backgroundColor: "#41BEFD" },
                ]}
                onPress={() => setTemperature("ICE")}
              >
                <Text style={styles.optionButtonText}>ice</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.optionRow}>
            <Text style={styles.optionTitle}>사이즈</Text>
            <View style={styles.optionButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  size === "REGULAR" && styles.optionButtonSelected,
                ]}
                onPress={() => setSize("REGULAR")}
              >
                <Text style={styles.optionButtonText}>레귤러</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  size === "LARGE" && styles.optionButtonSelected,
                ]}
                onPress={() => setSize("LARGE")}
              >
                <Text style={styles.optionButtonText}>라지</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <View style={styles.footerButtonsContainer}>
        <TouchableOpacity
          style={[styles.footerButton, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.footerButtonText}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, styles.addButton]}
          onPress={handleAddToCart}
        >
          <Text style={styles.footerButtonText}>담기</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>장바구니에 담았습니다.</Text>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
  },
  itemContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  itemImage: {
    borderRadius: 20,
    width: 140,
    height: 140,
    marginBottom: 10,
  },
  itemName: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  itemPrice: {
    fontSize: 18,
    color: "#888",
    marginBottom: 15,
    textAlign: "center",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  quantityButton: {
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  quantityText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  quantityValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  optionContainer: {
    width: "70%",
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  optionButtonsContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-end",
  },
  optionButton: {
    padding: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
    minWidth: 120,
  },
  optionButtonSelected: {
    backgroundColor: "#ff6b6b",
  },
  optionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  footerButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 20,
  },
  footerButton: {
    flex: 1,
    paddingVertical: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#cfd8dc",
  },
  addButton: {
    backgroundColor: "#ff7043",
  },
  footerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 50,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});

export default ChangeMenu;
