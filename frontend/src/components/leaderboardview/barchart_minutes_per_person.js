import React, { Component } from "react";
import Plot from "react-plotly.js";

const testData = 
  {
    "Monday": {"Congyu":207.0,"Diqing":207.0},
    "Tuesday":{"Congyu":203.0,"Diqing":203.0}
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
          data={Object.keys(this.props.data).map((key, index) => ({
            type: "bar",
            y: Object.keys(this.props.data[key]),
            x: Object.values(this.props.data[key]),
            orientation: "h",
            name: key,
            marker: { color: this.state.weekday_colors[index] },
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

export default BarchartMinutesPerPerson;
export { BarchartMinutesPerPerson, BarchartMinutesPerPersonPerWeekday };
