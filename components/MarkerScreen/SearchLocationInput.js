import React, { Component } from "react";
import { TextInput, StyleSheet } from "react-native";
import MarkerLang from "../../languages/MarkerLang";

class SearchLocationInput extends Component {
  state = {
    search: ""
  };

  static NAVIGATION_SEARCH_LOCATION = "NAVIGATION_SEARCH_LOCATION";

  onChangeSearch = value => {
    this.setState(
      {
        search: value
      },
      () => {
        if (value.length >= 2) {
          this.props.navigation.setParams({
            [SearchLocationInput.NAVIGATION_SEARCH_LOCATION]: value
          });
        }
      }
    );
  };

  render() {
    return (
      <TextInput
        placeholder={MarkerLang.searchLocation}
        onChangeText={this.onChangeSearch}
        value={this.state.search}
        underlineColorAndroid={"transparent"}
        style={styles.textInput}
        returnKeyType={"search"}
      />
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    alignSelf: "stretch"
  }
});

export default SearchLocationInput;
