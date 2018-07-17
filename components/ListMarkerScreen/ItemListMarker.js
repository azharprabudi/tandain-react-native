import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity
} from "react-native";
import { Text } from "react-native-paper";
import PropTypes from "prop-types";
import Ionicons from "@expo/vector-icons/Ionicons";

class ItemListMarker extends Component {
  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.onPress}>
        <View style={styles.container}>
          <Text style={styles.label}>{this.props.description}</Text>
          <TouchableOpacity onPress={this.props.onDeletePress}>
            <View style={styles.buttonDelete}>
              <Ionicons name={"md-trash"} size={24} color={"#fff"} />
            </View>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 8,
    alignItems: "center"
  },
  label: {
    flex: 1,
    flexWrap: "wrap",
    marginHorizontal: 10,
    color: "black",
    textAlign: "left"
  },
  buttonDelete: {
    width: 35,
    height: 35,
    borderRadius: 35,
    backgroundColor: "#FF0266",
    alignItems: "center",
    justifyContent: "center"
  }
});

ItemListMarker.propTypes = {
  onPress: PropTypes.func.isRequired,
  onDeletePress: PropTypes.func.isRequired,
  description: PropTypes.string.isRequired
};

export default ItemListMarker;
