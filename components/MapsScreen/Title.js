import React, { Component } from "react";
import { Text } from "react-native-paper";

// my module
import MapsScreen from "../../screens/MapsScreen";

/* this component just used to show the address from draggable marker */
class Title extends Component {
  render() {
    return (
      <Text>
        {this.props.navigation.getParam(MapsScreen.TITLE_HEADER_NAVBAR, "")}
      </Text>
    );
  }
}

export default Title;
