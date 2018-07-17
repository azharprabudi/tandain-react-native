import React, { Component } from "react";
import { FlatList, StyleSheet, View, ToastAndroid } from "react-native";
import { Text } from "react-native-paper";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import isArray from "lodash/isArray";

// my module
import Separator from "../components/Separator";
import { deleteMarkerPosition } from "../ducks/ListMarkerDuck";
import ItemListMarker from "../components/ListMarkerScreen/ItemListMarker";
import ListMarkerLang from "../languages/ListMarkerLang";
import MarkerDetailScreen from "./MarkerDetailScreen";

class ListMarkerScreen extends Component {
  /* navigate to detail */
  navigateToDetailMarker = id => () => {
    this.props.navigation.navigate("MarkerDetail", {
      [MarkerDetailScreen.MARKER_DETAIL_ID]: id
    });
  };

  /* delete press */
  onDeletePress = (id, pushNotificationId) => () => {
    this.props.deleteMarkerPosition(
      id,
      pushNotificationId,
      this.onDeleteSuccess,
      this.onDeleteFailed
    );
  };

  // render item flatlist
  renderItem = ({ item }) => {
    return (
      <ItemListMarker
        description={item.maps.address.substr(0, 50)}
        onPress={this.navigateToDetailMarker(item.markerId)}
        onDeletePress={this.onDeletePress(
          item.markerId,
          item.pushNotificationId
        )}
      />
    );
  };

  // callback delete success
  onDeleteSuccess = () => {
    ToastAndroid.show(ListMarkerLang.successDelete, ToastAndroid.SHORT);
  };

  // callback delete failed
  onDeleteFailed = e => {
    ToastAndroid.show(
      isArray(e) ? JSON.stringify(e) : e.toString(),
      ToastAndroid.SHORT
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          removeClippedSubviews
          renderItem={this.renderItem}
          keyExtractor={({ markerId }) => markerId}
          data={this.props.listMarker.list}
          ItemSeparatorComponent={Separator}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  }
});

const mapStateToProps = ({ listMarker }) => ({
  listMarker
});

ListMarkerScreen.propTypes = {
  listMarker: PropTypes.object.isRequired,
  deleteMarkerPosition: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  {
    deleteMarkerPosition
  }
)(ListMarkerScreen);
