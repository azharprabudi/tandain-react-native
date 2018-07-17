import React, { Component } from "react";
import { TouchableOpacity, View, Image, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import GlobalLang from "../../languages/GlobalLang";

class ImagePreview extends Component {
  render() {
    return (
      <View style={styles.wrapper}>
        <TouchableOpacity onPress={this.props.onPress}>
          <Image
            style={[
              styles.image,
              {
                height: this.props.canDelete ? 75 : 100,
                borderBottomLeftRadius: this.props.canDelete ? 0 : 5,
                borderBottomRightRadius: this.props.canDelete ? 0 : 5
              }
            ]}
            source={{ uri: this.props.image }}
            resizeMode={"cover"}
          />
        </TouchableOpacity>
        {this.props.canDelete && (
          <TouchableOpacity onPress={this.props.onDeletePress}>
            <View style={styles.deleteButton}>
              <Text style={styles.deleteText}>
                {GlobalLang.delete.toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginHorizontal: 8,
    zIndex: 5
  },
  image: {
    width: "100%",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  deleteButton: {
    width: 100,
    height: 25,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: "#FF0266",
    alignItems: "center",
    justifyContent: "center"
  },
  deleteText: {
    color: "white",
    marginLeft: 5,
    fontWeight: "400"
  }
});

ImagePreview.propTypes = {
  image: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  onDeletePress: PropTypes.func,
  canDelete: PropTypes.bool
};

ImagePreview.defaultProps = {
  canDelete: true,
  onDeletePress: () => {}
};

export default ImagePreview;
