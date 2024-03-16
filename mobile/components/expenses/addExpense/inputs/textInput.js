import React from "react";
import { View, TextInput as RNTextInput } from "react-native";

export const TextInput = ({
  errors,
  validation,
  register,
  field,
  width,
  type,
}) => {
  return (
    <View style={styles.inputContainer}>
      <RNTextInput
        style={[styles.input, styles[width], errors[field] && styles.error]}
        placeholder={field}
        onChangeText={(text) => {
          register(field, {
            required: validation.required,
          });
        }}
        keyboardType={type === "number" ? "numeric" : "default"}
      />
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field].message}</Text>
      )}
    </View>
  );
};

export const TextSelectInput = ({
  errors,
  options,
  validation,
  register,
  field,
  type,
  width,
}) => {
  return (
    <View style={styles.inputContainer}>
      <RNPickerSelect
        style={[styles.input, styles[width], errors[field] && styles.error]}
        placeholder={{ label: field, value: null }}
        onValueChange={(value) => {
          register(field, {
            required: validation.required,
          });
        }}
        items={options.map((category) => ({
          label: category.name,
          value: category.id,
        }))}
      />
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field].message}</Text>
      )}
    </View>
  );
};

const styles = {
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  "w1/3": {
    width: "33%",
  },
  error: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginTop: 4,
  },
};