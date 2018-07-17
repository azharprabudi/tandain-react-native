import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native-paper";
import PropTypes from "prop-types";

import MarkerLang from "../../languages/MarkerLang";

class AddImage extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onImageAdd}>
        <View style={styles.wrapper}>
          <Ionicons name={"md-add"} size={38} color={"#fff"} />
          <Text style={styles.label}>{MarkerLang.addImage}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    height: 100,
    width: 100,
    borderRadius: 5,
    marginHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
    borderStyle: "dotted"
  },
  label: {
    fontSize: 12,
    alignSelf: "center",
    textAlign: "center",
    color: "white"
  }
});

AddImage.propTypes = {
  onImageAdd: PropTypes.func.isRequired
};

export default AddImage;
