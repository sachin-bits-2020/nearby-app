/** @format */

import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, Alert, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import jwt_decode from "jwt-decode";
import { verifyPermissions } from "../uitils";

import { nearByUser } from "../redux/actions/geoAction";

const HomeScreen = (props) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  // const [nearbyUsers, setNearbyUsers] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [pickedLocation, setPickedLocation] = useState(null);
  const [radius, setRadius] = useState(1);
  const dispatch = useDispatch();
  const { nearByUsers } = useSelector((state) => {
    console.log(state);
    return state.geodata;
  });
  console.log(" on state change", nearByUsers);
  const getLocationHandler = async () => {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    try {
      setIsFetching(true);
      console.log("location ====>", location);
      const location = await Location.getCurrentPositionAsync({
        accuracy: 6,
      });
      console.log("location ====>", location);
      const currentPickedLocation = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };

      if (!pickedLocation) {
        setPickedLocation(currentPickedLocation);
      }

      console.log("currentPickedLocation", currentPickedLocation);
    } catch (err) {
      console.log("It is enterig catch with err", err);
      Alert.alert(
        "Could not fetch location!",
        "Please try again later or pick a location on the map. Without which we cannot show you nearby users",
        [{ text: "Okay" }]
      );
    }
    setIsFetching(false);
  };

  const loadProfile = async (props) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      props.navigation.navigate("Login");
    }

    const decoded = jwt_decode(token);
    console.log("decoded values of token", decoded);
    await getLocationHandler();
    if (pickedLocation && pickedLocation.lat && pickedLocation.lng) {
      dispatch(
        nearByUser({
          ...pickedLocation,
          radius,
        })
      );
    }

    setFullName(decoded.fullName);
    setEmail(decoded.email);
  };

  const logout = (props) => {
    AsyncStorage.removeItem("token")
      .then(() => {
        props.navigation.replace("Login");
      })
      .catch((err) => console.log(err));
  };

  const navigateToDetailPage = (props, item) => {
    // return props.navigation.navigate("UserDetail", {
    //   fullName: item.fullName,
    // });
    Alert.alert(
      `Notified the ${item.fullName} regarding your request to communicate`,
      `please check other similiar services in your area`,
      [{ text: "Okay" }]
    );
  };

  useEffect(() => {
    loadProfile();
  }, [pickedLocation]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.text}>Welcome {fullName ? fullName : ""}</Text>
      </View>
      <View>
        <Text style={styles.text}>Your Email: {email ? email : ""}</Text>
      </View>
      <View>
        <Button title="Logout" onPress={() => logout(props)} />
      </View>
      <View>
        {nearByUsers && nearByUsers.length === 0 ? (
          <View>
            <Text>No Users to display</Text>
          </View>
        ) : null}
        <FlatList
          style={styles.list}
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          data={nearByUsers}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            console.log("item", item);
            return (
              <View style={styles.listItem}>
                <View>
                  <Text style={styles.fullname}>{item.fullName}</Text>
                </View>
                <View>
                  <Text style={styles.email}>{item.email}</Text>
                </View>
                <View style={styles.navigation}>
                  <View>
                    <Text style={styles.text}>
                      {item.distanceFromUser} KM away
                    </Text>
                  </View>
                  <View>
                    <Button
                      style={styles.button}
                      title="View Details"
                      onPress={() => navigateToDetailPage(props, item)}
                    />
                  </View>
                </View>
              </View>
            );
          }}
          extraData={isFetching}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
  },
  list: {
    display: "flex",
    flexDirection: "column",
  },
  listItem: {
    margin: "1rem",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    border: "1px solid #f0f0f0",
  },
  navigation: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 22,
  },
  fullname: {
    fontSize: 16,
    fontWeight: "600",
  },
  email: {
    fontSize: 12,
    fontStyle: "italic",
  },
  button: {
    backgroundColor: "rgb(115, 130, 137)",
  },
});

export default HomeScreen;
