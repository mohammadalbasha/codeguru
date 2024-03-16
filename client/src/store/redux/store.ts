// Redux store setup
import { configureStore } from "@reduxjs/toolkit";
import CategoriesReducer from "./reducers/categories-reducer";

const store = configureStore({
  reducer: {
    categories: CategoriesReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
