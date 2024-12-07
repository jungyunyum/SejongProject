import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React from "react";

// 네비게이션 훅 불러오기
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// 화면 불러오기
import { Provider } from "react-redux";
import { createStore } from "redux";

import DetailMenu from "./src/screens/DetailMenu";
import Home from "./src/screens/Home";
import AiChat from "./src/screens/AiChat";
import Menu from "./src/screens/Menu";
import FinalCheck from "./src/screens/FinalCheck";
import CustomerLogin from "./src/screens/CustomerLogin";
import AddAccount from "./src/screens/AddAccount";
import KakaoLogin from "./src/screens/KakaoLogin";
import NaverLogin from "./src/screens/NaverLogin";
import SelectPayment from "./src/screens/SelectPayment";
//여기 부분 살펴봐야 한다.
import LoginSuccess from "./src/screens/LoginSuccess";
import CounterCheck from "./src/screens/CounterCheck";
import CardPayment from "./src/screens/CardPayment";
import UseCoupon from "./src/screens/UseCoupon";
import CardLast from "./src/screens/CardLast";
import PhoneNumberPad from "./src/screens/PhoneNumberPad";
import CouponSuccess from "./src/screens/CouponSuccess";
import CouponFail from "./src/screens/CouponFail";
import LoginPage from "./src/screens/LoginPage";

import TestPage from "./src/screens/TestPage"; //테스트 페이지
import TestPage2 from "./src/screens/TestPage2";

//전체 데이터 여기서 관리!
const initialState = {
  customerId: 0, // 손님 Id
  cartId: 0, //  카트 아이디
  discount: 0, // 할인 금액
  stamp: 0, // 쿠폰 갯수
  useStamp: 0, //사용후 쿠폰 갯수
  totalPrice: 0, //총 가격 설정!
  phoneNumber: "",
};

// 리듀서
function reducer(state = initialState, action) {
  switch (action.type) {
    case "customerId":
      return { ...state, customerId: action.payload }; //사용자 id 설정
    case "cartId":
      return { ...state, cartId: action.payload }; //사용자 id 설정
    case "setDiscount":
      return { ...state, discount: action.payload }; // discount 값 설정
    case "setStamp":
      return { ...state, stamp: action.payload }; // stamp 값 설정
    case "useStamp":
      return { ...state, useStamp: action.payload }; // 사용후 stamp의 값을 저장을 한다.
    case "totalPrice":
      return { ...state, totalPrice: action.payload }; // totalPrice 값 설정
    case "phoneNumber":
      return { ...state, phoneNumber: action.payload }; // 핸드폰 번호 저장
    default:
      return state;
  }
}

let store = createStore(reducer); //리듀서 선언

const App = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Menu" component={Menu} />
          <Stack.Screen name="AiChat" component={AiChat} />
          <Stack.Screen name="DetailMenu" component={DetailMenu} />
          <Stack.Screen name="FinalCheck" component={FinalCheck} />
          <Stack.Screen name="CustomerLogin" component={CustomerLogin} />
          <Stack.Screen name="AddAccount" component={AddAccount} />
          <Stack.Screen name="NaverLogin" component={NaverLogin} />
          <Stack.Screen name="KakaoLogin" component={KakaoLogin} />
          <Stack.Screen name="SelectPayment" component={SelectPayment} />
          <Stack.Screen name="CounterCheck" component={CounterCheck} />

          {/* 여기 부분은 살펴봐야 한다.  */}
          <Stack.Screen name="CardLast" component={CardLast} />
          <Stack.Screen name="CardPayment" component={CardPayment} />
          <Stack.Screen name="UseCoupon" component={UseCoupon} />
          <Stack.Screen name="PhoneNumberPad" component={PhoneNumberPad} />
          <Stack.Screen name="LoginSuccess" component={LoginSuccess} />
          <Stack.Screen name="CouponFail" component={CouponFail} />
          <Stack.Screen name="CouponSuccess" component={CouponSuccess} />
          <Stack.Screen name="LoginPage" component={LoginPage} />

          {/* 테스트 페이지 */}
          <Stack.Screen name="TestPage" component={TestPage} />
          <Stack.Screen name="TestPage2" component={TestPage2} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
