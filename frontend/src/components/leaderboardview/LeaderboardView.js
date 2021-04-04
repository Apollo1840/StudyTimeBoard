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
    name_winner_lastweek: "somebody",
    duration_str_lastweek: "sometime",
    name_winner: "somebody",
    duration_str: "sometime",
  };

  /* state description:

		weeklyData: Map: dayKey:userKey:minutesValue, 
			-dayKey: str, weekdays, eg. "Monday"
			-userKey: str, name of the user
			-minutesValue: float, the amount of minutes that user have for that day.

		totalData: Map: userKey: minutesValue: 
			-userKey: str, name of the user
			-minutesValue: float, the amount of minutes that user have from beginning.

		name_winner_lastweek: str: username of the winner of the last week.

		duration_str_lastweek: str: the pharse describing how much the winner of the last week studied.

		name_winner: str: username of the winner from beginning

		duration_str: str: the pharse describing how much the winner from beginning

  */

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    TimeboardService.getLastweekMinutes()
      .then((data) => {
        this.setState({
          weeklyData: data,
        });
      })
      .catch((e) => {
        alert(e);
      });

    TimeboardService.getUserMinutes()
      .then((data) => {
        this.setState({
          totalData: data,
        });
      })
      .catch((e) => {
        alert(e);
      });
  };

  render() {
    return (
      <div className="container">
        <div className="mt-5">
          <div>
            <p>
              The leader of this board is:
              <b>{this.state.name_winner_lastweek}</b>
              (with {this.state.duration_str_lastweek})
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
              The leader of this board is:<b>{this.state.name_winner}</b>
              (with {this.state.duration_str})
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
