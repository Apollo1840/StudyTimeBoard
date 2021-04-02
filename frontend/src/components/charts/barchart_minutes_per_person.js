import React, { Component } from "react";
import Plot from "react-plotly.js";

class BarchartMinutesPerPerson extends Component {
  render() {
    return (
      <div>
        <Plot
          data={[
            {
              type: "bar",
              y: this.props.users,
              x: this.props.data,
              orientation: "h",
            },
          ]}
          layout={{
            width: 1000,
            height: 2000,
            title: this.props.title,
          }}
        ></Plot>
      </div>
    );
  }
}

class BarchartMinutesPerPersonPerWeekday extends Component {
  state = {
    weekdays: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    weekday_colors: [
      "rgb(56, 125, 89)",
      "rgb(11, 55, 125)",
      "rgb(81, 81, 81)",
      "rgb(21, 45, 145)",
      "rgb(31, 125, 25)",
      "rgb(41, 55, 85)",
      "rgb(111, 45, 125)",
    ],
  };
  render() {
    return (
      <div>
        <Plot
          data={this.props.data.map((item, index) => ({
            type: "bar",
            y: this.props.users,
            x: item,
            orientation: "h",
            name: this.state.weekdays[index],
            marker: { color: this.state.weekday_colors[index] },
          }))}
          layout={{
            width: 1000,
            height: 500,
            title: this.props.title,
            barmode: "stack",
          }}
        ></Plot>
      </div>
    );
  }
}

export { BarchartMinutesPerPerson, BarchartMinutesPerPersonPerWeekday };
