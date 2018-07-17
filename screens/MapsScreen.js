import React, { Component } from "react";
import { View, StyleSheet, ToastAndroid } from "react-native";
import { Button, Text } from "react-native-paper";
import { MapView, Location, Permissions } from "expo";
import { StackActions, NavigationActions } from "react-navigation";
import isArray from "lodash/isArray";
import has from "lodash/has";

// my module
import APIMaps from "../constants/APIMaps";
import GlobalLang from "../languages/GlobalLang";
import MarkerLang from "../languages/MarkerLang";
import MapsLang from "../languages/MapsLang";
import MarkerScreen from "./MarkerScreen";

class MapsScreen extends Component {
  static TITLE_HEADER_NAVBAR = "TITLE_HEADER_NAVBAR";

  state = {
    latitude: -6.1753924,
    longitude: 106.8249641,
    address: ""
  };

  constructor() {
    super();
    this.delta = {
      latitudeDelta: 0.0052,
      longitudeDelta: 0.0052
    };
  }

  // run this when component already render
  componentDidMount() {
    this.getDetailCurrentLocation();
  }

  // get detail current location from user
  getDetailCurrentLocation = async () => {
    try {
      const currentLocation = await this.getCurrentLocation();
      if (has(currentLocation, "coords")) {
        const { latitude, longitude } = currentLocation.coords;

        // fetching address depend on longitude latitude
        const address = await this.getAddressFromLatLong(latitude, longitude);

        // set address to title bar
        this.props.navigation.setParams({
          [MapsScreen.TITLE_HEADER_NAVBAR]: address
        });

        // set state information
        this.setState({
          address,
          latitude: Number(latitude),
          longitude: Number(longitude)
        });
      } else {
        throw new Error(MarkerLang.failedGetCurrentLocation);
      }
    } catch (e) {
      ToastAndroid.show(isArray(e) ? JSON.stringify(e) : e.toString());
    }
  };

  /* get current location user */
  getCurrentLocation = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === "granted") {
        return Location.getCurrentPositionAsync();
      } else {
        throw new Error(GlobalLang.permissionMapsDenied);
      }
    } catch (e) {
      ToastAndroid.show(isArray(e) ? JSON.stringify(e) : e.toString());
    }
  };

  /* when draggble stop */
  handleOnDragEnd = async data => {
    try {
      const { latitude, longitude } = data.nativeEvent.coordinate;

      // get address from latitude and longitude
      const address = await this.getAddressFromLatLong(latitude, longitude);

      // passing address to header
      this.props.navigation.setParams({
        [MapsScreen.TITLE_HEADER_NAVBAR]: address
      });

      // set state information
      this.setState({
        ...this.state,
        latitude,
        longitude,
        address
      });
    } catch (e) {
      ToastAndroid.show(isArray(e) ? JSON.stringify(e) : e.toString());
    }
  };

  /* fetching address from lat long */
  getAddressFromLatLong = async (latitude, longitude) => {
    try {
      const mAPIMaps = new APIMaps();
      const result = await mAPIMaps.getAddressFromLatLong(latitude, longitude);

      let address = "";
      if (has(result, "results")) {
        let i = 0;
        while (address === "") {
          if (
            has(result.results[i], "formatted_address") &&
            result.results[i].formatted_address !== "" &&
            typeof result.results[i] !== "undefined"
          ) {
            address = result.results[i].formatted_address;
          }
          i++;
        }
      }

      return address;
    } catch (e) {
      throw new Error(e);
    }
  };

  /* navigate to marker screen and passing longitude latitude again */
  useThisLocation = () => {
    const { navigation } = this.props;
    const callback = navigation.getParam(
      MarkerScreen.CHANGE_CURRENT_LOCATION,
      () => {}
    );

    // reset navigator
    const resetScreen = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "Marker" })]
    });

    this.props.navigation.dispatch(resetScreen);
    callback(this.state);

    // notice to user if success
    ToastAndroid.show(GlobalLang.successAddYourLocation, ToastAndroid.SHORT);
  };

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.maps}
          initialRegion={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: this.delta.latitudeDelta,
            longitudeDelta: this.delta.longitudeDelta
          }}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: this.delta.latitudeDelta,
            longitudeDelta: this.delta.longitudeDelta
          }}
          zoomEnabled
          rotateEnabled
          showsUserLocation
          showsMyLocationButton
        >
          <MapView.Marker
            draggable
            coordinate={{
              latitude: this.state.latitude,
              longitude: this.state.longitude
            }}
            onDragEnd={this.handleOnDragEnd}
          />
        </MapView>
        <View style={styles.buttonFloating}>
          <Button
            raised
            onPress={this.useThisLocation}
            style={styles.button}
            color={"#3F51B5"}
          >
            <Text style={styles.labelButton}>
              {MapsLang.useThisLocation.toUpperCase()}
            </Text>
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  maps: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    zIndex: 1
  },
  buttonFloating: {
    position: "absolute",
    bottom: 25,
    left: 25,
    right: 25,
    zIndex: 8
  },
  button: {
    borderRadius: 15
  },
  labelButton: {
    color: "white",
    fontWeight: "700"
  }
});

export default MapsScreen;
