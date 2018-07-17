import React from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";

import MarkerScreen from "../screens/MarkerScreen";
import ListMarkerScreen from "../screens/ListMarkerScreen";
import SearchLocationScreen from "../screens/SearchLocationScreen";
import MapsScreen from "../screens/MapsScreen";

import GlobalLang from "../languages/GlobalLang";
import SearchLocationInput from "../components/MarkerScreen/SearchLocationInput";
import Title from "../components/MapsScreen/Title";
import Ionicons from "@expo/vector-icons/Ionicons";
import MarkerDetailScreen from "../screens/MarkerDetailScreen";

const MarkerStack = createStackNavigator({
  Marker: {
    screen: MarkerScreen,
    navigationOptions: {
      header: null
    }
  },
  SearchLocation: {
    screen: SearchLocationScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitle: <SearchLocationInput navigation={navigation} />
    })
  },
  Maps: {
    screen: MapsScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitle: <Title navigation={navigation} />
    })
  }
});

const ListMarkerStack = createStackNavigator({
  ListMarker: {
    screen: ListMarkerScreen,
    navigationOptions: {
      title: GlobalLang.listMarker
    }
  },
  MarkerDetail: {
    screen: MarkerDetailScreen,
    navigationOptions: {
      title: GlobalLang.markerDetail
    }
  }
});

export default createMaterialBottomTabNavigator(
  {
    MarkerTab: {
      screen: MarkerStack,
      navigationOptions: {
        title: GlobalLang.marker,
        tabBarColor: "#3F51B5",
        tabBarIcon: ({ focused, tintColor }) => (
          <Ionicons
            name={"md-map"}
            size={26}
            color={focused ? "#fff" : "#d3d3d3"}
          />
        )
      }
    },
    ListMarkerTab: {
      screen: ListMarkerStack,
      navigationOptions: {
        title: GlobalLang.listMarker,
        tabBarColor: "#018786",
        tabBarIcon: ({ focused, tintColor }) => (
          <Ionicons
            name={"md-list"}
            size={26}
            color={focused ? "#fff" : "#d3d3d3"}
          />
        )
      }
    }
  },
  {
    labeled: true,
    shifting: true,
    backBehavior: "initialRoute",
    activeTintColor: "#FFF",
    inactiveTintColor: "#d3d3d3",
    initialRouteName: "MarkerTab"
  }
);
