import React, { Component } from "react";
import Plot from "react-plotly.js";
import { LineChartTimeStreamColorWay } from "../../../shared/colorThemes";

class LineChartTimeStream extends Component {
  // props are:
  //    - data: array of 2 item arrays, the items are string (eg. "18:00"), means start_time and end_time of a studying period.

  state = {};

  // this is needed for plotly to recognize it as a datetime format
  time2datetime = (timestr_array) => {
    return timestr_array.map((time) => "2020-08-08 " + time);
  };

  render() {
    // to define the xaxis range and draw a horizontal line
    const timerange = this.time2datetime(["00:00", "23:59"]);

    // prepare the data variables for plotly to draw
    var data = this.props.data.map((item, index) => ({
      mode: "lines",
      y: this.props.data[index].map(() => 0),
      x: this.time2datetime(this.props.data[index]),
      line: {
        //color: "rgb(128, 0, 128)",
        width: 15,
      },
    }));

    // the base line data variable
    data.push({
      mode: "lines",
      y: [0, 0],
      x: timerange,
      line: { color: "#bdbdbd" },
    });

    // to debug
    console.log(data);

    return (
      <div>
        <Plot
          data={data}
          layout={{
            width: 800,
            height: 200,
            showlegend: false,
            colorway: LineChartTimeStreamColorWay,
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
