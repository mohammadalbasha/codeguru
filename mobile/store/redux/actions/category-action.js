import {
  deleteCategory,
  fetchCategories,
  postCategory,
} from "../reducers/categories-reducer";
import axiosInstance from "../../../services/api/api.service";
import { setAuthorizationHeader } from "../../../services/api/api.service";
import { Config } from "../../../services/config/config";

export const listCategories = () => {
  return async (dispatch) => {
    try {
      await setAuthorizationHeader();

      const categories = await axiosInstance.get(
        Config.getServerDomain().url + "/api/categories"
      );

      dispatch(fetchCategories(categories.data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const addCategory = (input) => {
  return async (dispatch) => {
    try {
      await setAuthorizationHeader();

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

export const removeCategory = (input) => {
  return async (dispatch) => {
    try {
      await setAuthorizationHeader();

      const category = await axiosInstance.delete(
        Config.getServerDomain().url + `/api/categories/${input.id}`
      );
      dispatch(deleteCategory(input.id));
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.errors[0]?.message);
    }
  };
};
