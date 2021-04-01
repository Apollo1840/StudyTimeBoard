import React, { Component } from "react";
import Plot from "react-plotly.js";

class LineChartTimeStream extends Component {
  state = {};

  time2datetime = (timestr_array) => {
    return timestr_array.map((time) => "2020-08-08 " + time);
  };

  render() {
    const timerange = this.time2datetime(["00:00", "23:59"]);
    var data = this.props.data.map((item, index) => ({
      mode: "lines",
      y: this.props.data[index].map(() => 0),
      x: this.time2datetime(this.props.data[index]),
      line: {
        //color: "rgb(128, 0, 128)",
        width: 15,
      },
    }));

    // this base line
    data.push({
      mode: "lines",
      y: [0, 0],
      x: timerange,
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
              tickformat: "%H:%M:%S",
              range: timerange,
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
