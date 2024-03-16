import axiosInstance, {
  getAccessToken,
  getHost,
  setAuthorizationHeader,
} from "../../services/api/api.service";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";
import { Platform } from "react-native";

export const fetchExpenses = async (pagination, filter) => {
  let queryParams = `?pagination[limit]=${pagination.limit}&pagination[offset]=${pagination.offset}&`;
  Object.entries(filter).forEach(([key, value]) => {
    if (value && value != "") queryParams += `filter[${key}]=${value}&`;
  });
  try {
    await setAuthorizationHeader();
    const expenses = await axiosInstance.get("/expenses" + queryParams);
    return expenses.data;
  } catch (err) {
    throw err;
  }
};

export const addExpense = async (data) => {
  try {
    await setAuthorizationHeader();
    const expenses = await axiosInstance.post("/expenses", {
      ...data,
      amount: +data.amount,
    });
    return expenses.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deleteExpense = async (data) => {
  try {
    await setAuthorizationHeader();
    await axiosInstance.delete(`/expenses/${data.id}`);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const downloadReport = async (filter, filename) => {
  let queryParams = `?`;
  Object.entries(filter).forEach(([key, value]) => {
    if (value && value != "") queryParams += `filter[${key}]=${value}&`;
  });

  const url = getHost() + "/expenses/downloadReport" + queryParams;
  try {
    const access_token = await getAccessToken();
    const response = await FileSystem.downloadAsync(
      url,
      FileSystem.documentDirectory + filename,
      {
        headers: {
          authorization: `Bearer ${access_token}`,
        },
      }
    );
    return response;
  } catch (error) {
    // Handle error
  }
};

export const downloadInvoice = async (id, filename) => {
  const url = getHost() + `/files/${id}`;
  try {
    const access_token = await getAccessToken();
    const response = await FileSystem.downloadAsync(
      url,
      FileSystem.documentDirectory + filename,
      {
        headers: {
          authorization: `Bearer ${access_token}`,
        },
      }
    );
    return response;
  } catch (error) {
    // Handle error
  }
};

export const save = async (uri, filename, mimetype) => {
  console.log(Platform.OS);
  if (Platform.OS === "android") {
    const permissions =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (permissions.granted) {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        filename,
        mimetype
      )
        .then(async (uri) => {
          await FileSystem.writeAsStringAsync(uri, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });
        })
        .catch((e) => console.log(e));
    } else {
      shareAsync(uri);
    }
  } else {
    console.log("leoooo");
    shareAsync(uri);
  }
};
