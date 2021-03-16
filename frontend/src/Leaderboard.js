import React from "react";
import BarchartMinutesPerPersonPerWeekday from "./components/charts/barchart_minutes_per_person";

class Leaderboard extends React.Component {
  state = {
    path_to_chart_lastweek: null,
    path_to_chart_all: null,
    name_winner_lastweek: null,
    duration_str_lastweek: null,
    name_winner: null,
    duration_str: null,
  };

  componentDidMount() {
    fetch("/api/get_leaderboards").then((response) =>
      response.json().then((jsondata) => this.setState(jsondata))
    );
  }

  render() {
    return (
      <div>
        <BarchartMinutesPerPersonPerWeekday
          title="Leaderboard of the last week"
          users={["congyu", "shangsu", "diqing"]}
          data={[
            [10, 2, 3],
            [1, 0, 3],
            [23, 12, 0],
          ]}
        />
      </div>
    );
  }
}

export default Leaderboard;
