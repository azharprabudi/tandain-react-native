import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  DatePickerAndroid,
  ToastAndroid,
  Keyboard,
  Animated,
  Easing,
  Modal,
  BackHandler
} from "react-native";
import { TextInput, Switch, Text, Button } from "react-native-paper";
import ImageViewer from "react-native-image-zoom-viewer";
import { Permissions, ImagePicker } from "expo";
import PropTypes from "prop-types";
import isArray from "lodash/isArray";
import uniqueId from "lodash/uniqueId";

// my module
import MarkerLang from "../../languages/MarkerLang";
import AddImage from "../../components/MarkerScreen/AddImage";
import GlobalLang from "../../languages/GlobalLang";
import DateTimePicker from "../DateTimePicker";
import ImagePreview from "./ImagePreview";

class FormMarker extends Component {
  state = {
    indexImagePreview: 0,
    visiblePreviewImage: false
  };

  constructor() {
    super();
    this.toggleImages = new Animated.Value(1);
  }

  componentDidMount() {
    // listener keyboard show
    this.keyboardShow = Keyboard.addListener(
      "keyboardDidShow",
      this.doToggleImages(0)
    );

    // listener keyboard hide
    this.keyboardHide = Keyboard.addListener(
      "keyboardDidHide",
      this.doToggleImages(1)
    );
  }

  componentWillUnmount() {
    // remove listener
    this.keyboardShow.remove();
    this.keyboardHide.remove();
  }

  /* running animation */
  doToggleImages = value => () => {
    Animated.timing(this.toggleImages, {
      toValue: value,
      duration: 200,
      easing: Easing.linear
    }).start();
  };

  /* change address */
  onChangeAddress = value => {
    this.props.onChangeTextForm("maps", "address", value);
  };

  /* change note */
  onChangeNote = value => {
    this.props.onChangeTextForm("note", "", value);
  };

  /* change use reminder */
  onChangeUseReminder = async () => {
    // set permission push notification
    let nextValueSwitch = !this.props.form.useReminder;
    if (nextValueSwitch) {
      const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      if (status === "granted") {
        nextValueSwitch = true;
      } else {
        nextValueSwitch = false;
        Alert.alert(GlobalLang.failed, GlobalLang.needYourPermission);
      }
    }
    this.props.onChangeTextForm("useReminder", "", nextValueSwitch);
  };

  /* on change date and time picker */
  onChangeDateTime = (stateName, value) => {
    this.props.onChangeTextForm("reminderAt", stateName, value);
  };

  /* save the form */
  onSubmit = () => {
    Alert.alert(
      GlobalLang.confirmation,
      MarkerLang.confirmationForm,
      [
        {},
        {
          text: GlobalLang.no,
          onPress: () => {},
          style: "cancel"
        },
        {
          text: GlobalLang.yes,
          onPress: this.props.onSubmit
        }
      ],
      { cancelable: false }
    );
  };

  /* get permission and get image */
  onImageAdd = async () => {
    try {
      // permission camera write and read
      const { status: statusCameraRoll } = await Permissions.askAsync(
        Permissions.CAMERA_ROLL
      );

      // permisson open camera
      const { status: statusCamera } = await Permissions.askAsync(
        Permissions.CAMERA
      );

      if (statusCameraRoll === "granted" && statusCamera === "granted") {
        // image selected from galery
        const imageSelected = await ImagePicker.launchCameraAsync({
          quality: 0.6,
          base64: true
        });

        // condition where the image not to be cancelled
        if (!imageSelected.cancelled) {
          // id for every image
          const id = uniqueId(`image_${new Date().getTime()}`);
          const data = {
            id,
            image: imageSelected.base64
          };
          this.props.onImageAdd(data);
        }
      } else {
        throw new Error(GlobalLang.declinePermissionCamera);
      }
    } catch (e) {
      ToastAndroid.show(
        isArray(e) ? JSON.stringify(e) : e.toString(),
        ToastAndroid.SHORT
      );
    }
  };

  /* show image preview */
  toggleModalPreview = (index = 0) => () => {
    this.setState({
      indexImagePreview: index,
      visiblePreviewImage: !this.state.visiblePreviewImage
    });
  };

  /* remove image */
  onRemoveImage = id => () => {
    this.props.onRemoveImage(id);
  };

  /* image preview in modal */
  getImagesPreview = () => {
    return this.props.form.images.map(item => {
      return {
        url: `data:image/png;base64,${item.image}`
      };
    });
  };

  /* render ui */
  render() {
    const {
      maps: { address },
      note,
      useReminder,
      reminderAt
    } = this.props.form;

    /* hide images when keyboard show up */
    const marginTopImages = this.toggleImages.interpolate({
      inputRange: [0, 1],
      outputRange: [-120, 0]
    });

    return (
      <View style={styles.container}>
        <Modal
          transparent
          onRequestClose={() => {}}
          visible={this.state.visiblePreviewImage}
        >
          <ImageViewer
            enableImageZoom
            enableSwipeDown
            onSwipeDown={this.toggleModalPreview()}
            index={this.state.indexImagePreview}
            imageUrls={this.getImagesPreview()}
          />
        </Modal>
        <ScrollView showsHorizontalScrollIndicator={false}>
          <Animated.ScrollView
            horizontal
            style={[
              styles.scrollingImage,
              { opacity: this.toggleImages, marginTop: marginTopImages }
            ]}
            showsHorizontalScrollIndicator={false}
          >
            {this.props.form.images.map((item, index) => (
              <ImagePreview
                key={item.id}
                image={`data:image/png;base64,${item.image}`}
                onPress={this.toggleModalPreview(index)}
                onDeletePress={this.onRemoveImage(item.id)}
              />
            ))}
            <AddImage onImageAdd={this.onImageAdd} />
          </Animated.ScrollView>
          <View style={styles.form}>
            <TextInput
              label={MarkerLang.address}
              value={address}
              onChangeText={this.onChangeAddress}
              returnKeyType={"next"}
            />
            <TextInput
              label={MarkerLang.note}
              value={note}
              onChangeText={this.onChangeNote}
              multiline
              numberOfLines={3}
              returnKeyType={"done"}
              onSubmitEditing={this.onSubmit}
            />
            <View style={styles.reminder}>
              <Text style={styles.label}>{MarkerLang.useReminder}</Text>
              <Switch
                value={useReminder}
                onValueChange={this.onChangeUseReminder}
              />
            </View>
            <View style={styles.reminder}>
              <Text style={styles.label}>{MarkerLang.reminderAt}</Text>
              <DateTimePicker
                date={this.props.form.reminderAt.date}
                time={this.props.form.reminderAt.time}
                onValueChange={this.onChangeDateTime}
              />
            </View>
            <Text style={styles.notice}>{MarkerLang.informationImage}</Text>
            <Button
              raised
              primary
              onPress={this.onSubmit}
              loading={this.props.loading}
            >
              <Text style={styles.labelButton}>{MarkerLang.save}</Text>
            </Button>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    paddingBottom: 85
  },
  scrollingImage: {
    paddingVertical: 8,
    paddingHorizontal: 3,
    backgroundColor: "#d3d3d3"
  },
  form: {
    padding: 8
  },
  reminder: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10
  },
  label: {
    color: "#808080"
  },
  labelButton: {
    color: "white"
  },
  notice: {
    color: "red",
    fontSize: 10,
    marginVertical: 10
  }
});

FormMarker.propTypes = {
  form: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChangeTextForm: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

export default FormMarker;
