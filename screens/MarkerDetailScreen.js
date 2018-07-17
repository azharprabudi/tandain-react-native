import React, { Component } from "react";
import {
  View,
  Modal,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  RefreshControl,
  TouchableOpacity,
  Image,
  Linking
} from "react-native";
import { MapView } from "expo";
import { Text } from "react-native-paper";
import { connect } from "react-redux";
import ImageViewer from "react-native-image-zoom-viewer";
import has from "lodash/has";
import isArray from "lodash/isArray";

// my module
import APIKeys from "../constants/APIKeys";
import APIImgur from "../constants/APIImgur";
import MarkerDetailLang from "../languages/MarkerDetailLang";
import ItemMarkerDetail from "../components/MarkerDetailScreen/ItemMarkerDetail";
import ImagePreview from "../components/MarkerScreen/ImagePreview";
import GlobalLang from "../languages/GlobalLang";

class MarkerDetailScreen extends Component {
  static MARKER_DETAIL_ID = "MARKER_DETAIL_ID";

  state = {
    loading: false,
    visiblePreviewImage: false,
    images: []
  };

  componentDidMount() {
    if (
      has(this.props.marker, "album") &&
      has(this.props.marker.album, "id") &&
      this.props.marker.album.id !== ""
    ) {
      this.fetchImages();
    }
  }

  // fetch image from album
  fetchImages = async () => {
    try {
      await this.setLoadingPromise(true);

      // do fetching image
      const mAPIImgur = new APIImgur(APIKeys.imgurClientId);
      const images = await mAPIImgur.getImageInAlbum(
        this.props.marker.album.id
      );

      if (has(images, "data")) {
        this.setState({
          ...this.state,
          images: images.data,
          loading: false
        });
      } else {
        throw new Error(MarkerDetailLang.failedFetchingImages);
      }
    } catch (e) {
      await this.setLoadingPromise(false);
      ToastAndroid.show(
        isArray(e) ? JSON.stringify(e) : e.toString(),
        ToastAndroid.SHORT
      );
    }
  };

  /* set state promise */
  setLoadingPromise = value => {
    return new Promise(resolve => {
      this.setState(
        {
          ...this.state,
          loading: value
        },
        resolve
      );
    });
  };

  /* toggle modal preview image */
  toggleModalImagePreview = () => {
    this.setState({
      ...this.state,
      visiblePreviewImage: !this.state.visiblePreviewImage
    });
  };

  /* return data structor like the image viewer want */
  getImageUrls = () => {
    return this.state.images.map(item => {
      return {
        url: item.link
      };
    });
  };

  /* open maps */
  openMaps = isDirection => () => {
    /* 
      isDirection == true  berarti di navigate
      isDirection == false cuma melihat market point
    */
    const { longitude, latitude } = this.props.marker.maps;
    let urlLink = "";
    if (isDirection) {
      urlLink = `http://maps.google.com/?daddr=${latitude},${longitude}`;
    } else {
      urlLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    }
    Linking.openURL(urlLink).then(supported => {
      if (!supported) {
        ToastAndroid.show(lang.cantOpenMaps, ToastAndroid.SHORT);
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={this.state.loading} />}
        >
          <Modal
            transparent
            onRequestClose={() => {}}
            visible={this.state.visiblePreviewImage}
          >
            <ImageViewer
              imageUrls={this.getImageUrls()}
              enableSwipeDown
              onSwipeDown={this.toggleModalImagePreview}
            />
          </Modal>
          {has(this.props.marker, "album") && (
            <ScrollView style={styles.scrollImages} horizontal>
              {this.state.images.map(item => (
                <ImagePreview
                  canDelete={false}
                  image={item.link}
                  onPress={this.toggleModalImagePreview}
                />
              ))}
            </ScrollView>
          )}
          <View style={styles.wrapperInformation}>
            <Text style={styles.heading}>
              {MarkerDetailLang.informationMarker.toUpperCase()}
            </Text>
            <View style={styles.line}>
              <ItemMarkerDetail
                title={MarkerDetailLang.address}
                description={this.props.marker.address || ""}
              />
              <ItemMarkerDetail
                title={MarkerDetailLang.note}
                description={this.props.marker.note || ""}
              />
              <ItemMarkerDetail
                title={MarkerDetailLang.useReminder}
                description={this.props.marker.useReminder ? "Ya" : "Tidak"}
              />
              <ItemMarkerDetail
                title={MarkerDetailLang.reminderAt}
                description={
                  this.props.marker.useReminder
                    ? `${this.props.marker.reminderAt.date} ${
                        this.props.marker.reminderAt.time
                      }`
                    : ""
                }
              />
            </View>
          </View>
          <View style={styles.wrapperInformation}>
            <Text style={styles.heading}>
              {MarkerDetailLang.informationOcr.toUpperCase()}
            </Text>
            <View style={styles.line}>
              {has(this.props.marker, "ocr") &&
                this.props.marker.ocr.map(({ word }) => {
                  let i = 0;
                  let description = "";

                  while (i < word.Words.length) {
                    description += `${word.Words[i].WordText} `;
                    i++;
                  }

                  return (
                    <ItemMarkerDetail
                      title={`OCR TEXT ${i}`}
                      description={description}
                    />
                  );
                })}
            </View>
          </View>
          <View style={styles.wrapperInformation}>
            <Text style={styles.heading}>
              {MarkerDetailLang.maps.toUpperCase()}
            </Text>
            <MapView
              initialRegion={{
                latitude: this.props.marker.maps.latitude,
                longitude: this.props.marker.maps.longitude,
                latitudeDelta: 0.0052,
                longitudeDelta: 0.0052
              }}
              style={styles.map}
            >
              <MapView.Marker
                coordinate={{
                  latitude: this.props.marker.maps.latitude,
                  longitude: this.props.marker.maps.longitude
                }}
              />
            </MapView>
            <View style={styles.wrapperButtonMaps}>
              <TouchableOpacity onPress={this.openMaps(false)}>
                <Image
                  resizeMode={"cover"}
                  style={styles.imageMaps}
                  source={require("../assets/images/maps.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={this.openMaps(true)}>
                <Image
                  resizeMode={"cover"}
                  style={styles.imageMaps}
                  source={require("../assets/images/directions.png")}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: 15
  },
  scrollImages: {
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 3,
    backgroundColor: "#d3d3d3"
  },
  wrapperInformation: {
    marginVertical: 5,
    marginHorizontal: 8
  },
  heading: {
    borderBottomWidth: 0.5,
    borderColor: "#808080",
    fontSize: 14,
    textAlign: "right",
    marginVertical: 8,
    color: "#808080"
  },
  line: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  map: {
    alignSelf: "center",
    width: "100%",
    height: 150
  },
  wrapperButtonMaps: {
    position: "absolute",
    bottom: 5,
    right: 5,
    flexDirection: "row",
    zIndex: 10
  },
  imageMaps: {
    width: 25,
    height: 25,
    marginHorizontal: 5
  }
});

const mapStateToProps = ({ listMarker }, currentProps) => {
  return {
    marker: listMarker.list.find(
      ({ markerId }) =>
        markerId ===
        currentProps.navigation.getParam(
          MarkerDetailScreen.MARKER_DETAIL_ID,
          ""
        )
    )
  };
};

export default connect(mapStateToProps)(MarkerDetailScreen);
