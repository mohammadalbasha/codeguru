import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Modal from "react-native-modal";
import { addExpense } from "../api";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import RNPickerSelect from "react-native-picker-select";
import { useMutation } from "@tanstack/react-query";
import { theme } from "../../../style/theme";
import DateTimePicker from "@react-native-community/datetimepicker";
// import DocumentPicker from "react-native-document-picker";
// import RNFS from "react-native-fs";

export const AddExpense = ({ isVisible, closeModal }) => {
  const categories = useSelector((state) => state.categories.categories);

  const mutation = useMutation({
    mutationFn: addExpense,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: "",
      category: "",
      description: "",
      date: new Date(),
    },
  });

  const handleSuccess = async (data) => {
    console.log(data);
    mutation.mutate(data);
  };
  const handleErrors = (errorsDetails) => {
    console.log(errorsDetails);
  };

  const [show, setShow] = useState(false);

  // THERE ARE SOME ISSURE WITH FILE UPLOADING

  // const [selectedFile, setSelectedFile] = useState(null);
  // const pickDocument = async () => {
  //   try {
  //     const result = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.allFiles],
  //     });
  //     // Check if the selected file is within the 5 MB limit
  //     const fileSize = await RNFS.stat(result.uri);
  //     const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
  //     if (fileSize.size > maxSize) {
  //       Alert.alert(
  //         "File Size Limit Exceeded",
  //         "Please select a file up to 5 MB."
  //       );
  //     } else {
  //       setSelectedFile(result);
  //     }
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //       // User cancelled the document picker
  //     } else {
  //       throw err;
  //     }
  //   }
  // };

  // const uploadFile = () => {
  //   // Implement your file upload logic here
  //   if (selectedFile) {
  //     // You can use the selectedFile.uri to get the file path for upload
  //     console.log(selectedFile);
  //   } else {
  //   }
  // };

  return (
    <Modal isVisible={isVisible}>
      <View style={styles.container}>
        <Text style={styles.title}>Add Category</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount:</Text>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="amount"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="amount"
          />
          {errors.amount && <Text>This is required.</Text>}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description:</Text>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="description"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="description"
          />
          {errors.description && <Text>This is required.</Text>}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date:</Text>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <SafeAreaView
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* <Button
                  color={theme.colors.secondaryColor}
                  onPress={showHandler}
                  title={value.toDateString()}
                /> */}
                {true && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={value}
                    themeVariant="dark"
                    mode={"date"}
                    onChange={(event, selectedDate) => {
                      onChange(selectedDate);
                      setShow(false);
                    }}
                  />
                )}
              </SafeAreaView>
            )}
            name="date"
          />
          {errors.date && <Text>This is required.</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category:</Text>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <SafeAreaView style={styles.input}>
                <RNPickerSelect
                  style={pickerSelectStyles}
                  themeVariant="dark"
                  onValueChange={onChange}
                  items={categories?.map((category) => {
                    return {
                      label: category.name,
                      value: category.id,
                    };
                  })}
                />
                {/* <Ionicons
                  name="add-circle"
                  size={20}
                  color={theme.colors.secondaryColor}
                /> */}
              </SafeAreaView>
            )}
            name="category"
          />

          {errors.category && <Text>This is required.</Text>}
        </View>

        {/* <View>
          <Button title="Pick Document" onPress={pickDocument} />
          {selectedFile && <Text>Selected File: {selectedFile.name}</Text>}
          <Button title="Upload File" onPress={uploadFile} />
        </View> */}

        <View style={styles.buttonContainer}>
          <Button
            title="Submit"
            color={theme.colors.secondaryColor}
            onPress={handleSubmit(handleSuccess)}
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
