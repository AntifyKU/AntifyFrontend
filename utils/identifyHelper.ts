import { Alert, ActionSheetIOS, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

export async function takePhoto() {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission Denied", "You need camera permission.");
    return;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled && result.assets?.length) {
    const img = result.assets[0];
    router.push({
      pathname: "/identification-results",
      params: { imageUri: img.uri, source: "camera" },
    });
  }
}

export async function uploadPhoto() {
  const { status } =
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission Denied", "You need gallery permission.");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled && result.assets?.length) {
    const img = result.assets[0];
    router.push({
      pathname: "/identification-results",
      params: { imageUri: img.uri, source: "gallery" },
    });
  }
}

export function openIdentifySheet() {
  if (Platform.OS === "ios") {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Take Photo", "Choose from Gallery"],
        cancelButtonIndex: 0,
      },
      (index) => {
        if (index === 1) takePhoto();
        if (index === 2) uploadPhoto();
      },
    );
  } else {
    Alert.alert("Identify Ant", "Choose an option", [
      { text: "Cancel", style: "cancel" },
      { text: "Take Photo", onPress: takePhoto },
      { text: "Choose from Gallery", onPress: uploadPhoto },
    ]);
  }
}
