import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  DatePickerAndroid,
  TimePickerAndroid
} from "react-native";
import { Text } from "react-native-paper";
import isArray from "lodash/isArray";
import isString from "lodash/isString";
import PropTypes from "prop-types";

class DateTimePicker extends Component {
  onChangeDate = async () => {
    try {
      const [stateDate, stateMonth, stateYear] = this.props.date.split("/");

      // open date picker
      let { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date(
          Number(stateYear),
          Number(stateMonth) - 1,
          Number(stateDate)
        )
      });

      // if no tap the cancel button
      if (action !== DatePickerAndroid.dismissedAction) {
        // by default day just like 1 and make it 01
        day = isString(day) ? day : day.toString();
        day = "00".substr(0, 2 - day.length) + day;

        // by default month just like 4 and make it 04
        month = isString(month) ? month : (month + 1).toString();
        month = "00".substr(0, 2 - month.length) + month;

        const date = `${day}/${month}/${year}`;

        this.props.onValueChange("date", date);
      }
    } catch (e) {
      ToastAndroid.show(
        isArray(e) ? JSON.stringify(e) : e.toString(),
        ToastAndroid.SHORT
      );
    }
  };

  onChangeTime = async () => {
    try {
      // split the hour and minute
      const [stateHour, stateMinute] = this.props.time.split(":");

      // open time picker
      let { action, hour, minute } = await TimePickerAndroid.open({
        hour: Number(stateHour),
        minute: Number(stateMinute),
        is24Hour: true
      });

      if (action !== TimePickerAndroid.dismissedAction) {
        // make hour like this 01 - 24
        hour = isString(hour) ? hour : hour.toString();
        hour = "00".substr(0, 2 - hour.length) + hour;

        // make minute like this 01 - 60
        minute = isString(minute) ? minute : minute.toString();
        minute = "00".substr(0, 2 - minute.length) + minute;

        const time = `${hour}:${minute}`;
        this.props.onValueChange("time", time);
      }
    } catch (e) {
      ToastAndroid.show(
        isArray(e) ? JSON.stringify(e) : e.toString(),
        ToastAndroid.SHORT
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.onChangeDate}>
          <View style={styles.wrapper}>
            <Text>{this.props.date}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onChangeTime}>
          <View style={styles.wrapper}>
            <Text>{this.props.time}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  wrapper: {
    padding: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d3d3d3",
    marginHorizontal: 5,
    borderRadius: 5
  }
});

DateTimePicker.propTypes = {
  date: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  onValueChange: PropTypes.func.isRequired
};

export default DateTimePicker;
