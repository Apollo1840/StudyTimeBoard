import React from "react";
import {
  BarchartMinutesPerPerson,
  BarchartMinutesPerPersonPerWeekday,
} from "./barchart_minutes_per_person";
import TimeboardService from "../../services/TimeboardService";

// users_lastweek: list of usernames, with dim: (id_person(sort_by_total_minutes_lastweek))
// minutes_lasweek: list of list of minutes, with dim: (id_weekday(sort_by_num), id_person(sort_by_total_minutes_lastweek))
// users: list of usernames, with dim: (id_person(sort_by_total_minutes))
// minutes: list of minutes, with dim: (id_person(sort_by_minutes))

class LeaderboardView extends React.Component {
  state = {
    // TODO: test with empty data responded from server
    weeklyData:{},
    totalData:{},
    name_winner_lastweek: "somebody",
    duration_str_lastweek: "sometime",
    name_winner: "somebody",
    duration_str: "sometime",
  };

  componentDidMount() {
    this.fetchData()
  }

  fetchData = () => {
    TimeboardService.getLastweekMinutes()
        .then((data) => {
            this.setState({
              weeklyData: data
            })
        })
        .catch((e) => {
            alert(e);
        });
    
    TimeboardService.getUserMinutes()
        .then((data) => {
          this.setState({
            totalData: data
          })
        })
        .catch((e) => {
          alert(e)
        })
  }

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
