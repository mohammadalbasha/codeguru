import { createSlice } from "@reduxjs/toolkit";
import { Category } from "../../../components/categroies/types";

const initialState: {
  categories: Category[];
} = {
  categories: [],
};

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    fetchCategories: (state, action) => {
      const categories = action.payload;
      state.categories = [...categories];
    },
    deleteCategory: (state, action) => {
      const id = action.payload;
      state.categories = state.categories.filter((element) => element.id != id);
    },

    postCategory: (state, action) => {
      const category = action.payload;
      state.categories.push(category);
    },
  },
});

export const { fetchCategories, postCategory, deleteCategory } =
  categoriesSlice.actions;

const categoriesReducer = categoriesSlice.reducer;
export default categoriesReducer;
