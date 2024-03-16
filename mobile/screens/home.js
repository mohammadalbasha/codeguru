import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { Button, Image, StyleSheet, Text, View, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AuthContext from "../store/auth-context";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["rgba(0,0,0,0.8)", "transparent"]}
        style={styles.background}
      />
      <View style={styles.title}>
        <Text style={styles.text}>MoneyGury!</Text>
      </View>
      <View style={styles.navigationButton}>
        <Button
          accessibilityLabel="helloworld"
          color="#841584"
          title="signin"
          onPress={() => navigation.navigate("Signin")}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 80,
  },
  background: {},
  text: {
    color: "#841584",
    padding: 4,
    fontSize: 30,
  },
  title: {
    borderRadius: 2,
    padding: 8,
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  logo: {
    zIndex: -3,
    marginTop: 0,
    width: 300,
    height: 600,
    position: "absolute",
    opacity: 0.3,
    top: 10,
  },
  navigationButton: {
    margin: 30,
    width: "100%",
    height: "auto",
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#841584",
    //backgroundColor: "#ddd",
  },
});
