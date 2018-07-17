import React from "react";
import { createSwitchNavigator, createStackNavigator } from "react-navigation";

// my module
import InitialNavigator from "./InitialNavigator";

console.disableYellowBox = true;
export default createSwitchNavigator(
  {
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Initial: InitialNavigator
  },
  {
    initialRouteName: "Initial"
  }
);
