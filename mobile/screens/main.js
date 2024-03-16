import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { AntDesign, Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AuthContext from "../store/auth-context";

const MainScreen = () => {
  const navigation = useNavigation();

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  const authCtx = React.useContext(AuthContext);

  if (authCtx.isLoading) return <Text style={styles.text}>isLoading...</Text>;
  if (!authCtx.isLoading && !authCtx.isLoggedIn)
    return navigation.navigate("Signin");

  return (
    <View style={styles.container}>
      <View style={styles.navigationButton}>
        <FontAwesome name="folder" size={24} color="#841584" />

        <Button
          color="#841584"
          title="Categories"
          onPress={() => navigateTo("Categories")}
        />
      </View>
      <View style={styles.navigationButton}>
        <AntDesign name="piechart" size={24} color="#841584" />

        <Button
          color="#841584"
          title="Reports"
          onPress={() => navigateTo("Reports")}
        />
      </View>
      <View style={styles.navigationButton}>
        <Feather name="dollar-sign" size={24} color="#841584" />

        <Button
          color="#841584"
          title="Expenses"
          onPress={() => navigateTo("Expenses")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  navigationButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: 20,
  },
});

export default MainScreen;
