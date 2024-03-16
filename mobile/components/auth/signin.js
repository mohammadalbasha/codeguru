import React, { useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import AuthContext from "../../store/auth-context";
import instance, {
  setAuthorizationHeader,
} from "../../services/api/api.service";

const SignIn = () => {
  const auth = useContext(AuthContext);
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSignIn = async (data) => {
    try {
      await setAuthorizationHeader();
      const response = await instance.post("/users/signin", data, {
        withCredentials: true,
      });

      await auth.login(response.data);
      navigation.navigate("MainScreen");
    } catch (err) {
      // Handle error
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      {errors.root?.serverError?.message && (
        <Text style={styles.errorText}>
          {errors.root?.serverError?.message}
        </Text>
      )}

      <Controller
        control={control}
        rules={{ required: "Email is required" }}
        render={({ field }) => (
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={field.onChange}
            value={field.value}
          />
        )}
        name="email"
        defaultValue=""
      />
      {errors.email && (
        <Text style={styles.errorText}>{errors.email.message}</Text>
      )}

      <Controller
        control={control}
        rules={{ required: "Password is required" }}
        render={({ field }) => (
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={field.onChange}
            value={field.value}
            secureTextEntry
          />
        )}
        name="password"
        defaultValue=""
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password.message}</Text>
      )}

      <Button
        title="Sign In"
        color="#841584"
        onPress={handleSubmit(handleSignIn)}
      />

      <View style={styles.linksContainer}>
        <Text style={styles.linkText}>
          Don't have an account?{" "}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("SignUp")}
          >
            Sign Up
          </Text>
        </Text>
        <Text style={styles.linkText}>
          Forgot your password?{" "}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            Reset
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
    color: "#841584",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "rgba(128, 128, 128, 0.679)",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 16,
  },
  linksContainer: {
    marginTop: 26,
    alignItems: "center",
  },
  linkText: {
    fontSize: 16,
    marginBottom: 8,
  },
  link: {
    color: "gray",
    textDecorationLine: "underline",
  },
});

export default SignIn;
