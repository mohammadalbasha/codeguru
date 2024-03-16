import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useSelector, useDispatch } from "react-redux";
import { removeCategory } from "../../store/redux/actions/category-action";
import { AddCategory } from "./addCategory/addCategory";
import { theme } from "../../style/theme";

export const Categories = () => {
  const categories = useSelector((state) => state.categories.categories);
  const [openAddModal, setAddOpenModal] = useState(false);

  const dispatch = useDispatch();

  const deleteHandler = (id) => {
    dispatch(removeCategory({ id }));
  };

  const renderItem = ({ item }) => {
    return (
      <View key={item.id} style={styles.tableRow}>
        <Text style={styles.tableCell}>{item.name}</Text>
        <Text style={styles.tableCell}>{item.description}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteHandler(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <View style={styles.addButtonContainer}>
        <TouchableOpacity onPress={() => setAddOpenModal(true)}>
          <Ionicons
            name="add-circle"
            size={20}
            color={theme.colors.secondaryColor}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.tableContainer}>
        <View style={styles.tableHead}>
          <Text style={styles.tableHeadCell}>Name</Text>
          <Text style={styles.tableHeadCell}>Description</Text>
          <Text style={styles.tableHeadCell}></Text>
        </View>
        <View style={styles.tableBody}>
          {/* {categories?.map((category) => {
            return (
              <View key={category.id} style={styles.tableRow}>
                <Text style={styles.tableCell}>{category.name}</Text>
                <Text style={styles.tableCell}>{category.description}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteHandler(category.id)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            );
          })} */}
          <FlatList
            data={categories}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
      <AddCategory isVisible={openAddModal} closeModal={setAddOpenModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.primaryColor,
    marginBottom: 10,
  },
  addButtonContainer: {
    marginVertical: 20,
  },
  tableContainer: {
    width: "100%",
    height: "60%",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
  },
  tableHead: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    backgroundColor: "lightgray",
    padding: 10,
  },
  tableHeadCell: {
    flex: 1,
    fontWeight: "bold",
  },
  tableBody: {
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    padding: 10,
    display: "flex",
  },
  tableCell: {
    flex: 1,
    color: "white",
    fontSize: 10,
    color: theme.colors.darkGray,
  },
  deleteButton: {
    justifyContent: "center",
  },
  deleteButtonText: {
    color: theme.colors.gray,
    fontWeight: "bold",
  },
});
