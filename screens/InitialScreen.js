import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated
} from "react-native";
import { Text } from "react-native-paper";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Swiper from "react-native-swiper";
import { DangerZone } from "expo";
import { StackActions, NavigationActions } from "react-navigation";

// my module
import { finishedReadIntroduction } from "../ducks/SystemDuck";
import LoadingAnimation from "../components/LoadingAnimation";
import GlobalLang from "../languages/GlobalLang";

class InitialScreen extends Component {
  state = {
    status: 0, // status visited 0 => loading, 1 => not yet visit
    index: 0
  };

  constructor() {
    super();
    this.lottie = {
      first: new Animated.Value(0),
      second: new Animated.Value(0),
      third: new Animated.Value(0)
    };
  }

  componentDidMount() {
    if (this.props.system.visited) {
      // reset to main screen if ever visited
      this.resetToMainScreen();
    } else {
      this.setState({
        ...this.state,
        status: 1
      });
      this.runAnimation("first");
    }
  }

  componentWillUnmount() {
    this.lottie.first.stopAnimation();
    this.lottie.second.stopAnimation();
    this.lottie.third.stopAnimation();
  }

  runAnimation = indexName => {
    Animated.timing(this.lottie[indexName], {
      toValue: this.lottie[indexName]["_value"] === 0 ? 1 : 0,
      duration: 6000
    }).start();
  };

  // reset to main navigation
  resetToMainScreen = () => {
    const resetNavigation = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "Main" })]
    });
    // dispatch
    this.props.navigation.dispatch(resetNavigation);
  };

  // previous button press callback
  onPreviousPress = () => {
    if (this.state.index - 1 >= 0) {
      this.onIndexChanged(Number(this.state.index) - 1);
    }
  };

  // trigger when finish
  onFinished = () => {
    this.props.finishedReadIntroduction();
    this.resetToMainScreen();
  };

  // next button press callback
  onNextPress = () => {
    if (this.state.index === 2) {
      this.onFinished();
    } else {
      this.onIndexChanged(Number(this.state.index) + 1);
    }
  };

  /* index change swiper */
  onIndexChanged = index => {
    /* switch animation */

    switch (index) {
      case 0:
        this.runAnimation("first");
        break;
      case 1:
        this.runAnimation("second");
        break;
      case 2:
        this.runAnimation("third");
        break;
      default:
        break;
    }

    // scrolling swiper
    this.swiper.scrollBy(1);

    // set index
    this.setState({
      ...this.state,
      index
    });
  };

  renderPagination = () => (
    <View style={styles.wrapperButton}>
      <TouchableWithoutFeedback onPress={this.onNextPress}>
        <View style={styles.button}>
          <Text style={styles.labelButton}>
            {GlobalLang.next.toUpperCase()}
          </Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={this.onFinished}>
        <View style={[styles.button, styles.borderButton]}>
          <Text style={styles.labelButton}>
            {GlobalLang.done.toUpperCase()}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );

  render() {
    if (this.state.status === 0) {
      return <LoadingAnimation />;
    }
    return (
      <Swiper
        style={styles.container}
        index={0}
        ref={swiper => {
          this.swiper = swiper;
        }}
        renderPagination={this.renderPagination}
        scrollEnabled={false}
      >
        <View style={styles.wrapperSlider}>
          <View style={styles.wrapperLottie}>
            <DangerZone.Lottie
              style={styles.lottie}
              source={require("../assets/lottie/animation-w800-h800.json")}
              progress={this.lottie.first}
            />
          </View>
          <Text style={styles.description}>{GlobalLang.addYourLocation}</Text>
        </View>
        <View style={styles.wrapperSlider}>
          <View style={styles.wrapperLottie}>
            <DangerZone.Lottie
              style={styles.lottie}
              source={require("../assets/lottie/animation-w500-h296.json")}
              progress={this.lottie.second}
            />
          </View>
          <Text style={styles.description}>{GlobalLang.getNotification}</Text>
        </View>
        <View style={styles.wrapperSlider}>
          <View style={styles.wrapperLottie}>
            <DangerZone.Lottie
              style={styles.lottie}
              source={require("../assets/lottie/animation-w500-h500.json")}
              progress={this.lottie.third}
            />
          </View>
          <Text style={styles.description}>{GlobalLang.takePhoto}</Text>
        </View>
      </Swiper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#018786"
  },
  wrapperSlider: {
    flex: 1,
    paddingTop: 24,
    marginHorizontal: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  wrapperLottie: {
    width: 150,
    height: 150,
    borderRadius: 150,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    marginVertical: 15
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    color: "#eee",
    elevation: 10
  },
  lottie: {
    width: 180,
    height: 180
  },
  wrapperButton: {
    flexDirection: "row",
    height: 50
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },
  borderButton: {
    borderLeftWidth: 1,
    borderColor: "rgba(0,0,0,0.5)"
  },
  labelButton: {
    fontSize: 16,
    color: "black"
  }
});

const mapStateToProps = ({ system }) => ({
  system
});

export default connect(
  mapStateToProps,
  { finishedReadIntroduction }
)(InitialScreen);
