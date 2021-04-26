import React, { Component } from "react";
import { BarChartMinutesPerPersonPerToday } from "../../shared/charts/BarChartPerPerson";
import TimeboardService from "../../../services/TimeboardService";
class DashboardLeaderboardWeek extends Component {
  state = {
    data: [], // similar to weeklyData in LeaderboardView
    winner: "someone",
    winnerTime: "sometime",
  };

  componentDidMount() {
    // update state with TimeboardService
  }

  render() {
    return (
      <div id="lastweek_leaderboard_display" className="mt-5 mb-5">
        <h3 style={{ fontSize: "150%" }}> Leaderboard of this week: </h3>
        <br />

        <div>
          <p style={{ fontSize: "120%" }}>
            🏆 The leader of this board is:<b> {this.state.winner} </b> (with{" "}
            {this.state.winnerTime})
          </p>
        </div>

        <div className="text-center">
          <BarChartMinutesPerPersonPerToday data={this.state.data} />
        </div>
      </div>
    );
  }
}

export default DashboardLeaderboardWeek;
