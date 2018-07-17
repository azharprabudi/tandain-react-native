import React, { Component } from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";

class ItemSearchLocation extends Component {
  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.onPress}>
        <View style={[styles.wrapper, this.props.style]}>
          <Ionicons name={this.props.iconName} size={24} style={styles.icon} />
          <Text style={styles.label}>{this.props.description}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap"
  },
  icon: {
    color: "#d3d3d3"
  },
  label: {
    flex: 1,
    flexWrap: "wrap",
    marginHorizontal: 10,
    color: "black",
    textAlign: "left"
  }
});

ItemSearchLocation.propTypes = {
  iconName: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  description: PropTypes.string.isRequired,
  style: PropTypes.any
};

ItemSearchLocation.defaultProps = {
  iconName: "md-pin",
  style: {}
};

export default ItemSearchLocation;
