//import { AppRegistry } from "react-native";

import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SigninScreen from "./screens/auth/signin";
import { AuthContextProvider } from "./store/auth-context";
import { Provider } from "react-redux";
import store from "./store/redux/store";
import MainScreen from "./screens/main";
import HomeScreen from "./screens/home";
import CategoriesScreen from "./screens/categories/categroies";
import ExpensesScreen from "./screens/expenses/expenses";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReportsScreen from "./screens/reports/reports.js";

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AuthContextProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <>
                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{ title: "Welcome" }}
                />
                <Stack.Screen name="Categories" component={CategoriesScreen} />
                <Stack.Screen name="Expenses" component={ExpensesScreen} />
                <Stack.Screen name="Reports" component={ReportsScreen} />

                <Stack.Screen name="Signin" component={SigninScreen} />
                <Stack.Screen
                  name="MainScreen"
                  options={{ title: "Money Guru" }}
                  component={MainScreen}
                />
              </>
            </Stack.Navigator>
          </NavigationContainer>
        </AuthContextProvider>
      </Provider>
    </QueryClientProvider>
  );
};

export default App;

//AppRegistry.registerComponent("codeguru", () => App);
