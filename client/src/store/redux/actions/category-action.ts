import {
  deleteCategory,
  fetchCategories,
  postCategory,
} from "../reducers/categories-reducer";
import axiosInstance from "../../../services/api/api.service";
import { Config } from "../../../services/config/config";
import {
  AddCategoryInput,
  DeleteCategoryInput,
} from "../../../components/categroies/types";

export const listCategories: any = () => {
  return async (dispatch: any) => {
    try {
      const categories = await axiosInstance.get(
        Config.getServerDomain().url + "/api/categories"
      );
      dispatch(fetchCategories(categories.data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const addCategory: any = (input: AddCategoryInput) => {
  return async (dispatch: any) => {
    try {
      const category = await axiosInstance.post(
        Config.getServerDomain().url + "/api/categories",
        input
      );
      dispatch(postCategory(category.data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const removeCategory: any = (input: DeleteCategoryInput) => {
  return async (dispatch: any) => {
    try {
      const category = await axiosInstance.delete(
        Config.getServerDomain().url + `/api/categories/${input.id}`
      );
      dispatch(deleteCategory(input.id));
    } catch (err: any) {
      console.log(err);
      alert(err?.response?.data?.errors[0]?.message);
    }
  };
};
