/** @format */
import * as Permissions from "expo-location";

export const verifyPermissions = async () => {
  const result = await Permissions.requestForegroundPermissionsAsync();
  console.log("result of permission", result);
  if (result.status !== "granted") {
    Alert.alert(
      "Insufficient permissions!",
      "You need to grant location permissions to use this app.",
      [{ text: "Okay" }]
    );
    return false;
  }
  return true;
};
