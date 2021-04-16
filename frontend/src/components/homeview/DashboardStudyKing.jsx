import React, { Component } from "react";
import LineChartTimeStream from "./linechart_time_stream.js";
import StudyKingService from "../../services/StudyKingService";
class DashboardStudyKing extends Component {
  // todo: unify the key from backend and frontend
  state = {
    winner: "unknown",
    winnerMinutes: "unknown",
    timeline: [
      ["08:00", "12:00"],
      ["12:30", "12:40"],
      //[13, 14],
      //[15.5, 15.8],
      //[16, 18],
      //[20, 23],
    ],
  };

  componentDidMount() {
    StudyKingService.getStudyKing()
      .then((data) =>
        this.setState({
          timeline: data.timeline,
          winner: data.name_winner,
          winnerMinutes: data.duration_str,
        })
      )
      .catch((msg) => console.log(msg));
  }

  render() {
    return (
      <div id="today_study_king_display" className="mt-5 mb-5">
        <h3 style={{ fontSize: "150%" }}>Today's study king:</h3>
        <br />
        <p style={{ fontSize: "120%" }}>
          <b> 🔥 {this.state.winner} </b> (with {this.state.winnerMinutes})
        </p>
        <div class="text-center">
          <LineChartTimeStream data={this.state.timeline} />
        </div>
      </div>
    );
  }
}

export default DashboardStudyKing;
