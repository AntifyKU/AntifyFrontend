import { Alert, ActionSheetIOS, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import i18n from "@/public/i18n";

export async function takePhoto() {
  const t = i18n.t;
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(t("identify.permissionDenied"), t("identify.cameraPermission"));
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
  const t = i18n.t;

  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      t("identify.permissionDenied"),
      t("identify.galleryPermission"),
    );
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
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
  const t = i18n.t;

  if (Platform.OS === "ios") {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [
          t("common.cancel"),
          t("identify.takePhoto"),
          t("identify.chooseGallery"),
        ],
        cancelButtonIndex: 0,
      },
      (index) => {
        if (index === 1) takePhoto();
        if (index === 2) uploadPhoto();
      },
    );
  } else {
    Alert.alert(t("identify.title"), t("identify.chooseOption"), [
      { text: t("common.cancel"), style: "cancel" },
      { text: t("identify.takePhoto"), onPress: () => void takePhoto() },
      { text: t("identify.chooseGallery"), onPress: () => void uploadPhoto() },
    ]);
  }
}
