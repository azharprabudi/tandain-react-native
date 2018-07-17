import React, { Component } from "react";
import { View, Animated, StyleSheet, Easing } from "react-native";

class LoadingAnimation extends Component {
  constructor() {
    super();
    this.bullet = {
      first: new Animated.Value(0),
      second: new Animated.Value(1)
    };
  }

  componentDidMount() {
    this.runAnimation();
  }

  componentWillUnmount() {
    this.bullet.first.stopAnimation();
    this.bullet.second.stopAnimation();
  }

  runAnimation = () => {
    Animated.stagger(250, [
      Animated.timing(this.bullet.first, {
        toValue: this.bullet.first["_value"] === 0 ? 1 : 0,
        duration: 400,
        easing: Easing.linear
      }),
      Animated.timing(this.bullet.second, {
        toValue: this.bullet.second["_value"] === 0 ? 1 : 0,
        duration: 400,
        easing: Easing.linear
      })
    ]).start(this.runAnimation);
  };

  render() {
    const marginTopFirstBullet = this.bullet.first.interpolate({
      inputRange: [0, 1],
      outputRange: [-60, 0]
    });

    const marginTopSecondBullet = this.bullet.second.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -60]
    });

    return (
      <View style={styles.container}>
        <Animated.View
          style={[styles.bullet, { marginTop: marginTopFirstBullet }]}
        />
        <Animated.View
          style={[styles.bullet, { marginTop: marginTopSecondBullet }]}
        />
        <Animated.View
          style={[styles.bullet, { marginTop: marginTopFirstBullet }]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "white"
  },
  bullet: {
    width: 25,
    height: 25,
    borderRadius: 25,
    backgroundColor: "#3F51B5",
    marginHorizontal: 3,
    elevation: 3
  }
});

export default LoadingAnimation;
