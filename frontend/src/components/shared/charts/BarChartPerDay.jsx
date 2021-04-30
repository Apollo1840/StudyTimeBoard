import React, { Component } from "react";
import Plot from "react-plotly.js";

// Dummy data for testing
const dummyData = [
  [new Date(2021, 4, 14), 100],
  [new Date(2021, 4, 20), 150],
  [new Date(2021, 4, 30), 200],
];

// Display a bar chart, input data from this.props.data should follow the structure of dummyData
class BarChartPerDay extends Component {
  render() {
    // Convert input data to the format compatible with react-plotly
    let data = [
      {
        x: this.props.data.map((entry) => entry[1]),
        y: this.props.data.map((entry) => entry[0]),
        type: "bar",
        orientation: "h",
      },
    ];

    return (
      <Plot
        data={data}
        layout={{
          title: this.props.title,
          autosize: true,
          showlegend: false,
          yaxis: {},
          xaxis: {
            zeroline: false,
            autotick: true,
          },
        }}
        useResizeHandler={true}
        style={{ width: "100%", height: "100%" }}
      />
    );
  }
}

export default BarChartPerDay;
