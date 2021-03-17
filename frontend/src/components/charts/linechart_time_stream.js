import React, { Component } from "react";
import Plot from "react-plotly.js";

class LineChartTimeStream extends Component {
  state = {};
  render() {
    var data = this.props.data.map((item, index) => ({
      mode: "lines",
      y: this.props.data[index].map(() => 0),
      x: this.props.data[index],
      line: {
        //color: "rgb(128, 0, 128)",
        width: 15,
      },
    }));

    data.push({
      mode: "lines",
      y: [0, 0],
      x: [0, 24],
      line: { color: "#bdbdbd" },
    });

    console.log(data);

    return (
      <div>
        <Plot
          data={data}
          layout={{
            width: 800,
            height: 200,
            showlegend: false,
            colorway: ["#f3cec9", "#e7a4b6", "#cd7eaf", "#a262a9", "#6f4d96"],
            xaxis: {
              showgrid: true,
              gridcolor: "#bdbdbd",
              gridwidth: 2,
            },
            yaxis: {
              autorange: true,
              showgrid: false,
              zeroline: false,
              showline: false,
              autotick: true,
              ticks: "",
              showticklabels: false,
            },
          }}
        ></Plot>
      </div>
    );
  }
}

export default LineChartTimeStream;
