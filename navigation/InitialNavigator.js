import React from "react";
import { createStackNavigator } from "react-navigation";

// my module
import InitialScreen from "../screens/InitialScreen";
import MainTabNavigator from "./MainTabNavigator";

const InitialNavigator = createStackNavigator({
  Initial: {
    screen: InitialScreen,
    navigationOptions: {
      header: null
    }
  },
  Main: {
    screen: MainTabNavigator,
    navigationOptions: {
      header: null
    }
  }
});

export default InitialNavigator;
