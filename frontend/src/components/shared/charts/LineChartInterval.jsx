import React, { Component } from "react";
import Plot from "react-plotly.js";
import { LineChartIntervalColorWay } from "../../../shared/colorThemes";

// Dummy data for testing, input data from this.props.data should have the same structure
const dummyData = [
  [
    new Date(2021, 3, 1),
    new Date("2000.1.1 20:25"),
    new Date("2000.1.1  21:30"),
  ],
  [
    new Date(2021, 3, 2),
    new Date("2000.1.1 19:25"),
    new Date("2000.1.1  22:30"),
  ],
  [
    new Date(2021, 3, 5),
    new Date("2000.1.1 13:25"),
    new Date("2000.1.1  21:30"),
  ],
  [
    new Date(2021, 3, 19),
    new Date("2000.1.1 14:25"),
    new Date("2000.1.1  23:30"),
  ],
  [
    new Date(2021, 3, 21),
    new Date("2000.1.1 17:25"),
    new Date("2000.1.1  19:30"),
  ],
];

const onedayTimerange = ["2000-1-1 00:00", "2000-1-1 23:59"];
const onedayTimerangeReversed = ["2000-1-1 23:59", "2000-1-1 00:00"];

// Display intervals in a waterfall chart, the waterfall chart is a modified react-plotly lines chart, data should be an
// array of array of size 3 specifying x-axis, y-axis start and y-axis end, e.g. see dummyData.
function LineChartInterval(props) {
  // Convert input data to the format compatible with react-plotly
  let data = props.data.map((entry) => ({
    // entry: 0: date, 1: start_time, 2: end_time
    x: [entry[0], entry[0]], // Duplicate x-axis to build two 2D coordinates
    y: [entry[1], entry[2]],
    mode: "lines",
    line: {
      width: 10,
    },
  }));

  return (
    <Plot
      data={data}
      layout={{
        autosize: true,
        showlegend: false,
        colorway: LineChartIntervalColorWay,
        yaxis: {
          tickformat: "%H:%M:%S",
          range: onedayTimerangeReversed,
        },
        xaxis: {
          showgrid: true,
          zeroline: false,
          autotick: true,
        },
      }}
      useResizeHandler={true}
      style={{ width: "100%", height: "100%" }}
    />
  );
}

function LineChartIntervalPerWeek(props) {
  let last_weekid = props.data[props.data.length - 1][0];

  // Convert input data to the format compatible with react-plotly
  let data = props.data.map((entry) => {
    return {
      // entry: 0: weekID, 1: start_time, 2: end_time
      x: [entry[0], entry[0]], // Duplicate x-axis to build two 2D coordinates
      y: [entry[1], entry[2]],
      mode: "lines",
      line: {
        color:
          entry[0] == last_weekid
            ? "rgba(247, 186, 186, 0.3)"
            : "rgba(186, 238, 247, 0.3)",
        width: 10,
      },
    };
  });

  return (
    <Plot
      data={data}
      layout={{
        autosize: true,
        showlegend: false,
        yaxis: {
          tickformat: "%H:%M:%S",
          range: onedayTimerangeReversed,
        },
        xaxis: {
          showgrid: true,
          zeroline: false,
          autotick: true,
        },
      }}
      useResizeHandler={true}
      style={{ width: "100%", height: "100%" }}
    />
  );
}

// array of array of size 3 specifying x-axis, y-axis start and y-axis end, e.g. see dummyData.
function LineChartIntervalSingleDay(props) {
  // props are:
  //    - data: array of 3 items arrays, the items are date, start_time and end_time of a studying interval.

  // prepare the data variables for plotly to draw
  let data = props.data.map((entry) => ({
    // entry: 0: date, 1: start_time, 2: end_time
    x: [entry[1], entry[2]],
    y: [new Date("2000.1.1"), new Date("2000.1.1")],
    mode: "lines",
    line: {
      width: 15,
    },
  }));

  // the base line data variable
  data.push({
    x: onedayTimerange,
    y: [new Date("2000.1.1"), new Date("2000.1.1")],
    mode: "lines",
    line: { color: "#bdbdbd" },
  });

  return (
    <div>
      <Plot
        data={data}
        layout={{
          autosize: true,
          showlegend: false,
          colorway: LineChartIntervalColorWay,
          xaxis: {
            tickformat: "%H:%M:%S",
            range: onedayTimerange,
          },
          yaxis: {
            showgrid: false,
            showline: false,
            showticklabels: false,
          },
        }}
        useResizeHandler={true}
        style={{ width: "100%", height: "100%" }}
      ></Plot>
    </div>
  );
}

export default LineChartInterval;
export {
  LineChartInterval,
  LineChartIntervalSingleDay,
  LineChartIntervalPerWeek,
};
