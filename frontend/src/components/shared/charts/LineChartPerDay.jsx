import React, { Component } from "react";
import Plot from "react-plotly.js";

// Dummy data for testing, unit should be hours, eg. 1.25
const dummyData = {
  exact: [
    [new Date(2021, 4, 14), 1],
    [new Date(2021, 4, 20), 1.5],
    [new Date(2021, 4, 30), 2],
  ],
  average: [
    [new Date(2021, 4, 14), 0.8],
    [new Date(2021, 4, 20), 1.25],
    [new Date(2021, 4, 30), 1.75],
  ],
  average_exponential: [
    [new Date(2021, 4, 14), 1.1],
    [new Date(2021, 4, 20), 1.4],
    [new Date(2021, 4, 30), 1.9],
  ],
};

// Display a bar chart, input data from this.props.data should follow the structure of dummyData
function LineChartPerDay(props) {
  props = { data: dummyData };

  // Convert input data to the format compatible with react-plotly
  let exact_trace = {
    x: props.data.exact.map((entry) => entry[0]),
    y: props.data.exact.map((entry) => entry[1]),
    type: "scatter",
    mode: "lines",
    name: "exact",
    line: {
      color: "rgba(0, 0, 0, 0.1)",
      dash: "dashdot",
      width: 1,
    },
  };

  let average_trace = {
    x: props.data.average.map((entry) => entry[0]),
    y: props.data.average.map((entry) => entry[1]),
    type: "scatter",
    mode: "lines",
    name: "average",
    line: {
      color: "rgba(188, 247, 186, 0.4)",
      width: 10,
    },
  };

  let average_exponetial_trace = {
    x: props.data.average_exponential.map((entry) => entry[0]),
    y: props.data.average_exponential.map((entry) => entry[1]),
    type: "scatter",
    mode: "lines",
    name: "average_exponential",
    line: {
      color: "rgb(247, 191, 186 )",
      width: 2,
    },
  };

  let data = [exact_trace, average_trace, average_exponetial_trace];

  return (
    <Plot
      data={data}
      layout={{
        title: props.title,
        autosize: true,
        showlegend: true,
        yaxis: { autotick: true },
      }}
      useResizeHandler={true}
      style={{ width: "100%", height: "100%" }}
    />
  );
}

export default LineChartPerDay;
