import React from "react";
import {
  BarchartMinutesPerPerson,
  BarchartMinutesPerPersonPerWeekday,
} from "./barchart_minutes_per_person";
import TimeboardService from "../../services/TimeboardService";

class LeaderboardView extends React.Component {
  state = {
    // TODO: test with empty data responded from server
    weeklyData: {},
    totalData: {},
    weeklyWinner: "Unknown",
    weeklyWinnerMinutes: 0,
    totalWinner: "Unknown",
    totalMinutes: 0,
  };

  /* state description:

    weeklyData: Map: dayKey:userKey:minutesValue, 
      -dayKey: str, weekdays, eg. "Monday"
      -userKey: str, name of the user
      -minutesValue: float, the amount of minutes that user have for that day.

    totalData: Map: userKey: minutesValue: 
      -userKey: str, name of the user
      -minutesValue: float, the amount of minutes that user have from beginning.

    weeklyWinner: str: username of the winner of the last week.

    weeklyWinnerMinutes: int

    totalWinner: str: username of the winner from beginning

    totalMinutes: str: int
  */

  componentDidMount() {
    this.updateWeeklyData();
    this.updateTotalData();
  }

  // fetch logged study time of current week, data is grouped by week day, example:
  // {"Monday": {"tom": 12, "jerry": 20}, "Tuesday": {"tom": 20, "jerry": 12}}
  updateWeeklyData = () => {
    TimeboardService.getMinutesLastweek()
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

  // fetch logged study time of all time, example:
  // {"tom": 1001, "jerry": 999}
  updateTotalData = () => {
    TimeboardService.getMinutesWholeTime()
      .then((data) => {
        let totalWinner = this.getKeyWithMaxValue(data);
        this.setState({
          totalData: data,
          totalWinner: totalWinner,
          totalWinnerMinutes: data[totalWinner],
        });
      })
      .catch((e) => {
        alert(e);
      });
  };

  #privateField;

  // get the key with max value, json object must contain multiple key value pairs
  getKeyWithMaxValue = (jsonObject) => {
    return Object.keys(jsonObject).reduce((a, b) =>
      jsonObject[a] > jsonObject[b] ? a : b
    );
  };

  render() {
    return (
      <div className="container">
        <div className="mt-5">
          <div>
            <p>
              The leader of this board is:
              <b>{this.state.weeklyWinner}</b>
              (with {this.state.weeklyWinnerMinutes} minutes)
            </p>
          </div>

          <BarchartMinutesPerPersonPerWeekday
            title="Leaderboard of the last week (minutes)"
            data={this.state.weeklyData}
          />
        </div>

        <div className="mt-5">
          <div>
            <p>
              The leader of this board is:<b>{this.state.totalWinner}</b>
              (with {this.state.totalWinnerMinutes} minutes)
            </p>
          </div>
          <BarchartMinutesPerPerson
            title="Leaderboard of entire time (minutes)"
            data={this.state.totalData}
          />
        </div>
      </div>
    );
  }
}

export default LeaderboardView;
