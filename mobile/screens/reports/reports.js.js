import React from "react";
import { View, StyleSheet } from "react-native";
import { Reports } from "../../components/reports/reports";

const ReportsScreen = () => {
  return (
    <View style={styles.container}>
      <Reports />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "linear-gradient(to right, #841584, #841587)",
  },
});

export default ReportsScreen;
