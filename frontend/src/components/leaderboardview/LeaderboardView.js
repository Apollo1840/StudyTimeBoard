import React from "react";
import {
  BarchartMinutesPerPerson,
  BarchartMinutesPerPersonPerWeekday,
} from "../../components/charts/barchart_minutes_per_person";
import HttpService from "../../services/HttpService";
import {
  SERVER_BASE_URL,
  LEADERBOARDSDATA_URL,
} from "../../shared/serverUrls.js";

// users_lastweek: list of usernames, with dim: (id_person(sort_by_total_minutes_lastweek))
// minutes_lasweek: list of list of minutes, with dim: (id_weekday(sort_by_num), id_person(sort_by_total_minutes_lastweek))
// users: list of usernames, with dim: (id_person(sort_by_total_minutes))
// minutes: list of minutes, with dim: (id_person(sort_by_minutes))

class LeaderboardView extends React.Component {
  state = {
    users_lastweek: ["congyu", "shangsu", "diqing"],
    minutes_lastweek: [
      [0, 12, 10],
      [10, 8, 13],
      [1, 0, 23],
    ],
    users: ["congyu", "shangsu", "diqing"],
    minutes: [18, 20, 30],
    name_winner_lastweek: "somebody",
    duration_str_lastweek: "sometime",
    name_winner: "somebody",
    duration_str: "sometime",
  };

  componentDidMount() {
    HttpService.get(
      SERVER_BASE_URL + LEADERBOARDSDATA_URL,
      (data) => {
        this.setState(data);
      },
      (errorMsg) => {
        console.log(errorMsg);
      }
    );
  }

  render() {
    console.log(this.state);
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
            users={this.state.users_lastweek}
            data={this.state.minutes_lastweek}
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
            users={this.state.users}
            data={this.state.minutes}
          />
        </div>
      </div>
    );
  }
}

export default LeaderboardView;
