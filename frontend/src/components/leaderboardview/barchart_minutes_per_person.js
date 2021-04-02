import React, { Component } from "react";
import Plot from "react-plotly.js";
import { WeekdayColorWay } from "../../shared/colorThemes";

// test data for this.props.data
const testData = {
  Monday: { Congyu: 207.0, Diqing: 207.0 },
  Tuesday: { Congyu: 203.0, Diqing: 203.0 },
};

//TODO: the order of the weekdays seems to be wrong
//TODO: layouts can be put in props

class BarchartMinutesPerPersonPerWeekday extends Component {
  // this.props.data:  dayKey: userKey: minutesValue

  state = {};

  render() {
    const weekdays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const weekdays_appeared_in_order = weekdays.filter((dayKey) =>
      Object.keys(this.props.data).includes(dayKey)
    );
    return (
      <div>
        <Plot
          data={weekdays_appeared_in_order.map((dayKey, index) => ({
            type: "bar",
            y: Object.keys(this.props.data[dayKey]), // users
            x: Object.values(this.props.data[dayKey]), // minutes of users
            orientation: "h",
            name: dayKey,
            marker: { color: WeekdayColorWay[index] },
          }))}
          layout={{
            width: 1000,
            height: 800,
            title: this.props.title,
            barmode: "stack",
          }}
        ></Plot>
      </div>
    );
  }
}

class BarchartMinutesPerPerson extends Component {
  // this.props.data: userKey: minutesValue
  render() {
    return (
      <div>
        <Plot
          data={[
            {
              type: "bar",
              y: Object.keys(this.props.data),
              x: Object.values(this.props.data),
              orientation: "h",
            },
          ]}
          layout={{
            width: 1000,
            height: 1200,
            title: this.props.title,
          }}
        ></Plot>
      </div>
    );
  }
}

export { BarchartMinutesPerPerson, BarchartMinutesPerPersonPerWeekday };
