/** @format */

import React, { useState } from "react";
import {
  View,
  Button,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";

import { verifyPermissions } from "../uitils";

import Colors from "../constants/Colors";
//import MapPreview from "./MapPreview";

const LocationPicker = (props) => {
  const [isFetching, setIsFetching] = useState(false);
  const [pickedLocation, setPickedLocation] = useState();

  const getLocationHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }

    try {
      setIsFetching(true);
      const location = await Location.getCurrentPositionAsync({
        timeout: 5000,
      });
      const currentPickedLocation = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };
      setPickedLocation();
      console.log(currentPickedLocation);
      props.setPickedLocation(currentPickedLocation);
    } catch (err) {
      Alert.alert(
        "Could not fetch location!",
        "Please try again later or pick a location on the map.",
        [{ text: "Okay" }]
      );
    }
    setIsFetching(false);
  };

  // const pickOnMapHandler = () => {
  //   props.navigation.navigate("Map");
  // };

  return (
    <View style={styles.locationPicker}>
      {/* <MapPreview
        style={styles.mapPreview}
        location={pickedLocation}
        onPress={pickOnMapHandler}
      >
        {isFetching ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <Text>No location chosen yet!</Text>
        )}
      </MapPreview> */}
      <View style={styles.actions}>
        {/* <Text
          title="Get User Location"
          onPress={getLocationHandler}
          styles={styles.button}
        /> */}
        <TouchableOpacity style={styles.button} onPress={getLocationHandler}>
          <Text style={styles.buttonText}>Get User Location</Text>
        </TouchableOpacity>
        {/* <Button
          title="Pick on Map"
          color={Colors.primary}
          onPress={pickOnMapHandler}
        /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  locationPicker: {
    marginBottom: 15,
  },
  mapPreview: {
    marginBottom: 10,
    width: "100%",
    height: 150,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  actions: {
    flexDirection: "column",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    width: 300,
    backgroundColor: "#738289",
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
    textAlign: "center",
  },
});

export default LocationPicker;
