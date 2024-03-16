import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { useDispatch } from "react-redux";
import { addCategory } from "../../../store/redux/actions/category-action";
import { theme } from "../../../style/theme";

export const AddCategory = ({ isVisible, closeModal }) => {
  const [categoryInput, setCategoryInput] = useState({
    name: "",
    description: "",
  });
  const dispatch = useDispatch();

  const changeHandler = (key, value) => {
    setCategoryInput((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submitHandler = () => {
    dispatch(addCategory(categoryInput));
    closeModal();
  };

  return (
    <Modal isVisible={isVisible}>
      <View style={styles.container}>
        <Text style={styles.title}>Add Category</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            value={categoryInput.name}
            onChangeText={(value) => changeHandler("name", value)}
            placeholder="Name"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description:</Text>
          <TextInput
            style={styles.input}
            value={categoryInput.description}
            onChangeText={(value) => changeHandler("description", value)}
            placeholder="Description"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Add"
            color={theme.colors.primaryColor}
            onPress={submitHandler}
          />
          <Button title="Decline" color="gray" onPress={() => closeModal()} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
