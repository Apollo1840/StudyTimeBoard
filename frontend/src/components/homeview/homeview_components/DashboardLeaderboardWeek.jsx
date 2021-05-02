import React, { Component } from "react";
import { BarChartMinutesPerPersonPerToday } from "../../shared/charts/BarChartPerPerson";
import TimeboardService from "../../../services/TimeboardService";
import { CURRENT } from "../../../services/TimeboardService";
class DashboardLeaderboardWeek extends Component {
  state = {
    weeklyData: [], // similar to weeklyData in LeaderboardView
    weeklyWinner: "someone",
    weeklyWinnerMinutes: 0,
  };

  componentDidMount() {
    TimeboardService.getMinutesLastWeek(CURRENT)
      .then((data) => {
        // TODO: check js object data structure
        let leaderboard = {}; // weekly leaderboard
        Object.keys(data).forEach((weekday) => {
          Object.keys(data[weekday]).forEach((name) => {
            if (!leaderboard[name]) leaderboard[name] = 0;
            leaderboard[name] += data[weekday][name];
          });
        });
        let weeklyWinner = this.getKeyWithMaxValue(leaderboard);
        this.setState({
          weeklyData: data,
          weeklyWinner: weeklyWinner,
          weeklyWinnerMinutes: leaderboard[weeklyWinner],
        });
      })
      .catch((msg) => {
        console.error(msg);
        alert(msg);
      });
  }

  // get the key with max value, json object must contain multiple key value pairs
  getKeyWithMaxValue = (jsonObject) => {
    return Object.keys(jsonObject).reduce((a, b) =>
      jsonObject[a] > jsonObject[b] ? a : b
    );
  };

  render() {
    return (
      <div id="lastweek_leaderboard_display" className="mt-5 mb-5">
        <h3 style={{ fontSize: "150%" }}> Leaderboard of this week: </h3>
        <br />

        <div>
          <p style={{ fontSize: "120%" }}>
            🏆 The leader of this board is:<b> {this.state.weeklyWinner} </b>{" "}
            (with {this.state.weeklyWinnerMinutes} minutes)
          </p>
        </div>

        <div className="text-center">
          <BarChartMinutesPerPersonPerToday data={this.state.weeklyData} />
        </div>
      </div>
    );
  }
}

export default DashboardLeaderboardWeek;
