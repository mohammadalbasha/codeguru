import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { Button, Image, StyleSheet, Text, View, Pressable } from "react-native";
import AuthContext from "../store/auth-context";

export default function MainScreen({ navigation }) {
  const authCtx = React.useContext(AuthContext);

  if (authCtx.isLoading) return <Text style={styles.text}>isLoading...</Text>;
  if (!authCtx.isLoading && !authCtx.isLoggedIn)
    return navigation.navigate("Signin");

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Text style={styles.text}>ya sdlam!</Text>
      </View>
      <View style={styles.navigationButton}>
        <Button
          accessibilityLabel="helloworld"
          color="#841584"
          title="Go to Jane's profile"
          onPress={() => navigation.navigate("Profile", { name: "Jane" })}
        />
      </View>
      <View style={styles.navigationButton}>
        <Button
          accessibilityLabel="helloworld"
          color="#841584"
          title="Logout"
          onPress={authCtx.logout}
        />
      </View>
      <View style={styles.navigationButton}>
        <Button
          accessibilityLabel="helloworld"
          color="#841584"
          title="signin"
          onPress={() => navigation.navigate("Signin")}
        />
      </View>

      <Pressable
        onPress={() => navigation.navigate("Profile", { name: "Jane" })}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "yellow" : "red",
          },
          styles.navigationButton,
        ]}
      >
        {({ pressed }) => (
          <Text style={styles.text}>{pressed ? "Pressed!" : "Press Me"}</Text>
        )}
      </Pressable>
      <Image
        style={styles.logo}
        source={{
          uri: "https://pbs.twimg.com/media/Fs-pyPGXwAEsNt4?format=jpg&name=large",
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "start",
    padding: 80,
    // borderBottomColor: "red",
    // borderBottomWidth: 2,

    borderWidth: 12,
    borderColor: "red",
  },
  text: {
    color: "red",
    backgroundColor: "#fff",
    padding: 4,
    fontSize: 10,
  },
  buttonContainer: {
    borderRadius: 2,
    padding: 4,
    backgroundColor: "yellow",
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
    margin: 10,
    width: "100%",
    height: "auto",
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 1,
    //backgroundColor: "#ddd",
  },
});
