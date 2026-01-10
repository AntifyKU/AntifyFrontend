import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const TOKEN_KEY = "id_token";
const isWeb = Platform.OS === "web";

export const saveToken = async (token: string) => {
  try {
    if (isWeb) {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } else {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
  } catch (error) {
    throw error;
  }
};

export const getToken = async () => {
  try {
    if (isWeb) {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return token;
    } else {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      return token;
    }
  } catch (error) {
    throw error;
  }
};

export const removeToken = async () => {
  try {
    if (isWeb) {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  } catch (error) {
    throw error;
  }
};
