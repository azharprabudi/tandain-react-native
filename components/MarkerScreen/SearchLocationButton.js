import React, { Component } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";

class SearchLocationButton extends Component {
  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.onPress}>
        <View style={styles.wrapperButtonSearch}>
          <Ionicons name={"md-pin"} size={24} color={"#d3d3d3"} />
          <Text style={styles.labelSearch}>{this.props.search}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  wrapperButtonSearch: {
    width: "100%",
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignItems: "center"
  },
  labelSearch: {
    marginLeft: 12,
    fontSize: 18,
    color: "#d3d3d3",
    marginTop: -3
  }
});

SearchLocationButton.propTypes = {
  search: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired
};

export default SearchLocationButton;
