import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FilterExpenses } from "./filterExpenses/filterExpenses";
import {
  deleteExpense,
  downloadInvoice,
  downloadReport,
  fetchExpenses,
  save,
} from "./api";
import { Table, Row, Cell } from "react-native-table-component";
import Pagination from "react-native-pagination";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { theme } from "../../style/theme";
import { AddExpense } from "./addExpense/addExpense";

export const Expenses = () => {
  const [filter, setFilter] = useState({
    description: "",
    dateFrom: "",
    dateTo: "",
    category: "",
  });

  const [openAddModal, setAddOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const queryClient = useQueryClient();

  const onPageChange = (page) => setCurrentPage(page);

  const fetchExpensesQuery = {
    queryKey: ["expenses", currentPage, filter, deleteExpense],
    queryFn: () =>
      fetchExpenses({ limit: 5, offset: 5 * (currentPage - 1) }, filter),
    placeholderData: keepPreviousData,
  };
  const { isPending, error, data: expenses } = useQuery(fetchExpensesQuery);

  const deleteHandler = async (id) => {
    try {
      await deleteExpense({ id });
      queryClient.invalidateQueries(fetchExpensesQuery);
    } catch (error) {
      console.log("An error occurred while deleting the expense:", error);
    }
  };
  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const downloadInvoiceHandler = async (id) => {
    const filename = "invoice.pdf";
    // const localhost = Platform.OS === "android" ? "10.0.2.2" : "127.0.0.1";
    const result = await downloadInvoice(id, filename);
    await save(result.uri, filename, result.headers["Content-Type"]);
  };

  const downloadReportHandler = async () => {
    const filename = "expensesReport.pdf";
    // const localhost = Platform.OS === "android" ? "10.0.2.2" : "127.0.0.1";
    const result = await downloadReport(filter, filename);
    await save(result.uri, filename, result.headers["Content-Type"]);
  };

  const renderItem = ({ item: expense }) => {
    return (
      <View key={expense.id} style={styles.tableRow}>
        <Text style={styles.tableCell}>{expense.amount}</Text>
        <Text style={styles.tableCell}>{expense?.category?.name}</Text>
        <Text style={styles.tableCell}>{expense.date}</Text>
        <Text style={styles.tableCell}>{expense.description}</Text>
        <Text style={styles.tableCell}>
          {expense?.mediaFileId && expense?.mediaFileId != "" && (
            <TouchableOpacity
              onPress={() => downloadInvoiceHandler(expense.mediaFileId)}
            >
              <Text style={styles.linkText}>Invoice</Text>
            </TouchableOpacity>
          )}
        </Text>

        <Text style={styles.tableCell}>
          {" "}
          <TouchableOpacity onPress={() => deleteHandler(expense.id)}>
            <Text style={styles.linkText}>Delete</Text>
          </TouchableOpacity>
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Expenses</Text>
      <FilterExpenses setFilter={setFilter} filter={filter} />
      <View style={styles.buttonsContainer}>
        <Button
          title="Download as PDF"
          onPress={downloadReportHandler}
          color={theme.colors.secondaryColor}
        />
        <TouchableOpacity onPress={() => setAddOpenModal(true)}>
          <Ionicons
            name="add-circle"
            size={20}
            color={theme.colors.secondaryColor}
          />
        </TouchableOpacity>
      </View>

      {/* <ScrollView style={styles.scrollView}>
        <Table>
          <Row
            data={[
              "Amount",
              "Category",
              "Date",
              "Description",
              "Invoice",
              "Delete",
            ]}
            style={styles.tableHeader}
            textStyle={styles.tableHeaderText}
          />

          {expenses?.map((expense) => (
            <Row key={expense.id} style={styles.tableRow}>
              <Cell data={expense.amount} />
              <Cell data={expense?.category?.name} />
              <Cell data={expense.date} />
              <Cell data={expense.description} />
              <Cell
                data={
                  <TouchableOpacity
                    onPress={() => downloadInvoiceHandler(expense.mediaFileId)}
                  >
                    <Text style={styles.linkText}>Invoice</Text>
                  </TouchableOpacity>
                }
              />
              <Cell
                data={
                  <TouchableOpacity onPress={() => deleteHandler(expense.id)}>
                    <Text style={styles.linkText}>Delete</Text>
                  </TouchableOpacity>
                }
              />
            </Row>
          ))}
        </Table>
    
      </ScrollView> */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Amount</Text>
          <Text style={styles.tableHeaderText}>Category</Text>
          <Text style={styles.tableHeaderText}>Date</Text>
          <Text style={styles.tableHeaderText}>Description</Text>
          <Text style={styles.tableHeaderText}>Invoice</Text>
          <Text style={styles.tableHeaderText}>Delete</Text>
        </View>
        <View style={styles.tableBody}>
          {/* <FlatList
            data={expenses}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          /> */}
          <FlatList
            contentContainerStyle={{ flexGrow: 1 }}
            data={expenses?.expenses}
            renderItem={renderItem}
          />
        </View>
      </View>
      <View style={styles.paginationContainer}>
        <Button
          title="Previous"
          color={"#851485"}
          onPress={handlePrevious}
          disabled={currentPage === 1}
        />
        <Button
          color={"#851485"}
          title="Next"
          onPress={handleNext}
          disabled={currentPage * 5 > expenses?.count}
        />
      </View>

      <AddExpense closeModal={setAddOpenModal} isVisible={openAddModal} />

      {/* AddExpense component code goes here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    color: "#6a009e47",
  },
  heading: {
    fontSize: 20,
    color: theme.colors.primaryColor,
  },
  buttonsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
    marginTop: 20,
    color: theme.colors.secondaryColor,
  },

  scrollView: {
    marginBottom: 16,
  },
  tableContainer: {
    width: "100%",
    height: "50%",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    backgroundColor: "lightgray",
    padding: 10,
  },
  tableHeaderText: {
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
    fontSize: 10,
    color: theme.colors.darkGray,
  },
  linkText: {
    color: theme.colors.secondaryColor,
    textDecorationLine: "underline",
  },
  paginationContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    height: "80",
    width: "30",
    //backgroundColor: "#841584",
  },
});
