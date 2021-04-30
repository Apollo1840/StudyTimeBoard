import React, { Component } from "react";
import { BarChartMinutesPerPersonPerToday } from "../../shared/charts/BarChartPerPerson";
import TimeboardService from "../../../services/TimeboardService";
import { CURRENT } from "../../../services/TimeboardService";
class DashboardLeaderboardWeek extends Component {
  state = {
    data: [], // similar to weeklyData in LeaderboardView
    winner: "someone",
    winnerTime: "sometime",
  };

  componentDidMount() {
    this.updateWeeklyData();
  }

  // fetch logged study time of current week, data is grouped by week day, example:
  // {"Monday": {"tom": 12, "jerry": 20}, "Tuesday": {"tom": 20, "jerry": 12}}
  updateWeeklyData = () => {
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
      .catch((e) => {
        alert(e);
      });
  };

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
