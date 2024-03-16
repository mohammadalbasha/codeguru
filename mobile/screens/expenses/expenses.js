import React from "react";
import { View, StyleSheet } from "react-native";
import { Expenses } from "../../components/expenses/expenses";
const ExpensesScreen = () => {
  return (
    <View style={styles.container}>
      <Expenses />
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

export default ExpensesScreen;
