import React from "react";
import { useForm, Controller } from "react-hook-form";
import { StyleSheet } from "react-native";
import { Text, View, TextInput, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useSelector } from "react-redux";
import { theme } from "../../../style/theme";

export const FilterExpenses = ({ filter, setFilter }) => {
  const categories = useSelector((state) => state.categories.categories);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: filter,
  });

  const handleSuccess = (data) => {
    setFilter(data);
  };

  const handleErrors = (errorsDetails) => {
    console.log(errorsDetails);
  };

  // const pickerRef = React.useRef();

  // function openCategoriesPicker() {
  //   pickerRef.current.focus();
  // }

  // function closeCategoriesPicker() {
  //   pickerRef.current.blur();
  // }
  return (
    <View style={styles.container}>
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

        <Controller
          control={control}
          rules={{
            maxLength: 100,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="dateFrom"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="dateFrom"
        />
        <Controller
          control={control}
          rules={{
            maxLength: 100,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="dateTo"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="dateTo"
        />

        {/* <Button title="SelectCategory" onPress={openCategoriesPicker}></Button>

        <Button title="close" onPress={closeCategoriesPicker}></Button>

        <Controller
          control={control}
          rules={{
            maxLength: 100,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Picker
              style={styles.picker}
              ref={pickerRef}
              onChange={onChange}
              onBlur={onBlur}
              selectedValue={value}
              onValueChange={onChange}
            >
              {categories.map((category) => (
                <Picker.Item
                  style={styles.input}
                  key={category.id}
                  label={category.name}
                  value={category.id}
                />
              ))}
            </Picker>
          )}
          name="category"
        /> */}
      </View>
      <Button
        title="Submit"
        color={theme.colors.secondaryColor}
        onPress={handleSubmit(handleSuccess)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  picker: {
    flex: 1,
    borderColor: theme.colors.secondaryColor,
    borderWidth: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.secondaryColor,
    padding: 8,
    borderRadius: 10,
    marginVertical: 4,
    width: "30%",
  },
});
