/**
 * Firebase Configuration
 * Web SDK configuration for authentication
 */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const firebaseConfig = {
  apiKey: "AIzaSyChd507jxmm5PEhCT8YX1-XAl-0iIEQxTo",
  authDomain: "antify-ef665.firebaseapp.com",
  projectId: "antify-ef665",
  storageBucket: "antify-ef665.firebasestorage.app",
  messagingSenderId: "727559927608",
  appId: "1:727559927608:web:04ab2f88c47cf59fb673cd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Export app for other services if needed
export default app;
