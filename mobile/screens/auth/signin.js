import React from "react";
import { View, StyleSheet } from "react-native";
import { Categories } from "../../components/categories/categories";
import SignIn from "../../components/auth/signin";

const SigninScreen = () => {
  return (
    <View style={styles.container}>
      <SignIn />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "linear-gradient(to right, #841584, #841587)",
  },
});

export default SigninScreen;
