import React, { Component } from "react";
import {
  StyleSheet,
  ToastAndroid,
  FlatList,
  View,
  RefreshControl
} from "react-native";
import { Text } from "react-native-paper";
import has from "lodash/has";
import isArray from "lodash/isArray";

// my module
import APIKeys from "../constants/APIKeys";
import APIMaps from "../constants/APIMaps";
import SearchLocationInput from "../components/MarkerScreen/SearchLocationInput";
import ItemSearchLocation from "../components/SearchLocationScreen/ItemSearchLocation";
import MarkerScreen from "./MarkerScreen";
import Separator from "../components/Separator";
import GlobalLang from "../languages/GlobalLang";
import MarkerLang from "../languages/MarkerLang";

class SearchLocation extends Component {
  state = {
    loading: false,
    locations: []
  };

  /* remove filtering location */
  componentWillUnmount() {
    if (this.timeoutFetching) {
      clearTimeout(this.timeoutFetching);
    }
  }

  componentDidUpdate(previousProps) {
    const searchPrevious = previousProps.navigation.getParam(
      SearchLocationInput.NAVIGATION_SEARCH_LOCATION,
      ""
    );
    const searchCurrent = this.props.navigation.getParam(
      SearchLocationInput.NAVIGATION_SEARCH_LOCATION,
      ""
    );
    if (searchPrevious !== searchCurrent && searchCurrent.length >= 2) {
      if (this.timeoutFetching) {
        clearTimeout(this.timeoutFetching);
      }
      this.timeoutFetching = setTimeout(() => {
        this.getLocation(searchCurrent);
      }, 300);
    }
  }

  setLoadingPromise = value =>
    new Promise(resolve =>
      this.setState({ ...this.state, loading: value }, resolve)
    );

  // get list location indexing on query
  getLocation = async search => {
    try {
      // set loading to true
      await this.setLoadingPromise(true);

      const mAPIMaps = new APIMaps(APIKeys.gmaps);
      const result = await mAPIMaps.getQueryAutoComplete(search);

      this.setState({
        loading: false,
        locations: result.predictions
      });
    } catch (e) {
      // set loading to false
      await this.setLoadingPromise(false);
      ToastAndroid.show(e.toString(), ToastAndroid.SHORT);
    }
  };

  /* choose current location */
  chooseLocation = (address, placeId) => async () => {
    try {
      // get location from placeid
      const mAPIMaps = new APIMaps(APIKeys.gmaps);
      const result = await mAPIMaps.getLonglatFromPlaceId(placeId);

      if (has(result, "result") && has(result.result, "geometry")) {
        const { navigation } = this.props;

        // back to marker screen
        navigation.goBack();

        // this function pass from marker screen to this screen
        const callback = navigation.getParam(
          MarkerScreen.CHANGE_CURRENT_LOCATION,
          () => {}
        );

        // passing latitude and longitude to marker screen
        callback({
          latitude: Number(result.result.geometry.location.lat),
          longitude: Number(result.result.geometry.location.lng),
          address: address
        });

        // give notice to user
        ToastAndroid.show(
          GlobalLang.successAddYourLocation,
          ToastAndroid.SHORT
        );
      } else {
        throw new Error(MarkerLang.failedGetLocation);
      }
    } catch (e) {
      ToastAndroid.show(
        isArray(e) ? JSON.stringify(e) : e.toString(),
        ToastAndroid.SHORT
      );
    }
  };

  /* render all item from exist data */
  renderItemFlatList = ({ item }) => (
    <ItemSearchLocation
      onPress={this.chooseLocation(item.description, item.place_id)}
      description={item.description}
    />
  );

  /* item always at the top */
  renderListHeaderComponent = () => (
    <ItemSearchLocation
      iconName={"md-map"}
      onPress={this.navigateToMapsScreen}
      description={MarkerLang.useMapsToFindLocation}
      style={styles.line}
    />
  );

  /* navigate to maps screen */
  navigateToMapsScreen = () => {
    const { navigation } = this.props;

    const callback = navigation.getParam(
      MarkerScreen.CHANGE_CURRENT_LOCATION,
      () => {}
    );

    this.props.navigation.navigate("Maps", {
      [MarkerScreen.CHANGE_CURRENT_LOCATION]: callback
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.locations}
          ListHeaderComponent={this.renderListHeaderComponent}
          refreshControl={<RefreshControl refreshing={this.state.loading} />}
          removeClippedSubviews
          renderItem={this.renderItemFlatList}
          keyExtractor={({ id }) => id}
          ItemSeparatorComponent={Separator}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  line: {
    borderBottomWidth: 1,
    borderColor: "#d3d3d3"
  }
});

export default SearchLocation;
