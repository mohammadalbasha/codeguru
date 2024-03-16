import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
} from "react-native";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { theme } from "../../style/theme";
import { fetchExpensesMonthlyReport } from "./api";
import { useForm, Controller } from "react-hook-form";

export const Reports = () => {
  const [filter, setFilter] = useState({
    month: new Date().getMonth().toString(),
    year: new Date().getFullYear().toString(),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: filter,
  });

  const handleSuccess = async (data) => {
    setFilter(data);
  };
  const handleErrors = (errorsDetails) => {
    console.log(errorsDetails);
  };

  const {
    isPending,
    error,
    data: reports,
  } = useQuery({
    queryKey: ["expensesReport", filter],
    queryFn: () => fetchExpensesMonthlyReport(filter),
    placeholderData: keepPreviousData,
  });

  const renderItem = ({ item: report }) => {
    return (
      <View key={report.id} style={styles.tableRow}>
        <Text style={styles.tableCell}>{report?.category?.name}</Text>
        <Text style={styles.tableCell}>{report.count}</Text>
        <Text style={styles.tableCell}>{report.avgAmount}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Report</Text>

      <View style={styles.filterContainer}>
        <Text style={styles.title}>Filtering</Text>

        {errors.root?.serverError?.message && (
          <Text style={styles.errorMessage}>
            {errors.root?.serverError?.message}
          </Text>
        )}
        <View style={styles.filterFieldsContainer}>
          <Controller
            control={control}
            rules={{
              maxLength: 100,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="month"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="month"
          />
          <Controller
            control={control}
            rules={{
              maxLength: 100,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="year"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="year"
          />
        </View>
        <Button
          title="Submit"
          color={theme.colors.secondaryColor}
          onPress={handleSubmit(handleSuccess)}
        />
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Category</Text>
          <Text style={styles.tableHeaderText}>Count</Text>
          <Text style={styles.tableHeaderText}>Avg Amount</Text>
        </View>
        <View style={styles.tableBody}>
          {/* <FlatList
            data={expenses}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          /> */}
          <FlatList
            contentContainerStyle={{ flexGrow: 1 }}
            data={reports}
            renderItem={renderItem}
          />
        </View>
      </View>
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

  filterContainer: {
    width: "100%",

    marginTop: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,

    color: theme.colors.gray,
    marginVertical: 16,
  },
  errorMessage: {
    color: "white",
    backgroundColor: "red",
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  filterFieldsContainer: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.secondaryColor,
    padding: 8,
    borderRadius: 10,
    marginVertical: 4,
    width: "30%",
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
