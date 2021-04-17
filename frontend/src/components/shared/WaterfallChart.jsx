import React, { Component } from "react";
import Plot from "react-plotly.js";
import { LineChartTimeStreamColorWay } from "../../shared/colorThemes";

// Dummy data for testing, input data from this.props.data should have the same structure
const dummyData =
  [
    [new Date(2021,3,1), new Date("2000.1.1 20:25"), new Date("2000.1.1  21:30")],
    [new Date(2021,3,2), new Date("2000.1.1 19:25"), new Date("2000.1.1  22:30")],
    [new Date(2021,3,5), new Date("2000.1.1 13:25"), new Date("2000.1.1  21:30")],
    [new Date(2021,3,19), new Date("2000.1.1 14:25"), new Date("2000.1.1  23:30")],
    [new Date(2021,3,21), new Date("2000.1.1 17:25"), new Date("2000.1.1  19:30")]
  ];

// Display a waterfall chart using a modified react-plotly lines chart, data should be an array of array of size 3
// specifying x-axis, y-axis start and y-axis end, e.g. see dummyData.
class WaterfallChart extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // Convert input data to the format compatible with react-plotly
    let data = this.props.data.map((entry) => (
      {
        x: [entry[0], entry[0]],  // Duplicate x-axis to build two 2D coordinates
        y: [entry[1], entry[2]],
        mode: 'lines',
        line: {
          width: 10
        }
      }));

    return (
      <Plot
        data={data}
        layout={{
          autosize: true,
          showlegend: false,
          colorway: LineChartTimeStreamColorWay,
          yaxis: {
            tickformat: "%H:%M:%S",
            range: ["2000-1-1 23:59", "2000-1-1 00:00"],
          },
          xaxis: {
            showgrid: false,
            zeroline: false,
            autotick: true,
          },
        }}
        useResizeHandler= {true}
        style = {{width: "100%", height: "100%"}}
      />
    );
  }
}

export default WaterfallChart;
