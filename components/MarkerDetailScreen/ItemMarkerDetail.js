import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import PropTypes from "prop-types";

class ItemMarkerDetail extends Component {
  render() {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.title}>{this.props.title}</Text>
        <Text style={styles.description}>{this.props.description}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    width: "48%",
    marginVertical: 5
  },
  title: {
    fontSize: 12,
    marginBottom: 5,
    color: "#808080"
  },
  description: {
    fontSize: 14,
    textAlign: "left",
    flexWrap: "wrap",
    width: "48%"
  }
});

ItemMarkerDetail.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

export default ItemMarkerDetail;
