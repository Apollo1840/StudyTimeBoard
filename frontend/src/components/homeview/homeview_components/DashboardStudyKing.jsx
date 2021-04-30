import React, { Component } from "react";
import { LineChartIntervalSingleDay } from "../../shared/charts/LineChartInterval";
import StudyKingService from "../../../services/StudyKingService";

class DashboardStudyKing extends Component {
  state = {
    winner: "some user",
    winnerMinutes: "some time", // todo: considering receiving it as Double and change it to str via js code
    timeline: [
      [
        new Date(2021, 3, 1),
        new Date("2000.1.1 9:25"),
        new Date("2000.1.1  12:30"),
      ],
      [
        new Date(2021, 3, 2),
        new Date("2000.1.1 18:25"),
        new Date("2000.1.1  22:30"),
      ],
    ],
  };

  componentDidMount() {
    //todo: handle error properly
    StudyKingService.getStudyKing()
      .then((data) => this.setState(data))
      .catch((msg) => {
        console.error(msg);
        alert(msg);
      });
  }

  transformTimeLine = (timeline) => {
    // input:  array of arrays of strs, each array of strs contains 2 str, stands for : startTIme, endTime
    // output: array of arrays of Dates, each array of Dates contains three Date, stands for : Date, startTime, EndTime
    return timeline.map((strTimeArray) => [
      new Date("2000.1.1"),
      new Date("2000.1.1 ".concat(strTimeArray[0])),
      new Date("2000.1.1 ".concat(strTimeArray[1])),
    ]);
  };

  render() {
    return (
      <div id="today_study_king_display" className="mt-5 mb-5">
        <h3 style={{ fontSize: "150%" }}>Today's study king:</h3>
        <br />
        <p style={{ fontSize: "120%" }}>
          <b> 🔥 {this.state.winner} </b> (with {this.state.winnerMinutes})
        </p>
        <div className="text-center">
          <LineChartIntervalSingleDay
            data={this.transformTimeLine(this.state.timeline)}
          />
        </div>
      </div>
    );
  }
}

export default DashboardStudyKing;
