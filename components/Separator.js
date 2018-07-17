import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import PropTypes from "prop-types";

const Separator = props => (
  <View style={[styles.line, { backgroundColor: props.backgroundColor }]} />
);

const styles = StyleSheet.create({
  line: {
    height: 1
  }
});

Separator.defaultProps = {
  backgroundColor: "#d3d3d3"
};

Separator.propTypes = {
  backgroundColor: PropTypes.string
};

export default Separator;
