import React, { Component } from "react";
import AuthService from "../../services/AuthService";
import TimeboardService from "../../services/TimeboardService";
import {
  LineChartInterval,
  LineChartIntervalPerWeek,
} from "../shared/charts/LineChartInterval";
import BarChartPerDay from "../shared/charts/BarChartPerDay";
import LineChartPerDay from "../shared/charts/LineChartPerDay";
import store from "../../redux-store";

class PersonalAnalysisView extends Component {
  // TODO: might need a separate file for storing constant error messages.
  ERROR_INVALID_DATE =
    "Returned data has invalid date, database might be corrupted!";

  state = {
    username: "someone",
    numberStars: 10,
    averageHoursPerDay: 0,

    barChartData: null, // logged durations of current user, displayed by bar chart
    LineChartData: null,
    intervalChartData: null, // logged intervals of current user, displayed by waterfall chart
    intervalPerWeekChartData: null, // logged intervals of current user, displayed by waterfall chart
  };

  componentDidMount() {
    this.setState({ username: store.getState().auth.username });
    this.updateDurations();
    this.updateDurationsAverage();
    this.updateIntervals();
    this.updateIntervalsPerWeek();
  }

  // updaters
  updateDurations = () => {
    TimeboardService.getPersonalDurations()
      .then((data) => {
        this.setState({
          barChartData: this.buildBarChartData(data),
        });
      })
      .catch((e) => {
        alert(e);
      });
  };

  updateDurationsAverage = () => {
    TimeboardService.getPersonalDurationsAverage()
      .then((data) => {
        this.setState({
          LineChartData: this.buildLineChartData(data),
        });
      })
      .catch((e) => {
        alert(e);
      });
  };

  updateIntervals = () => {
    TimeboardService.getPersonalIntervals()
      .then((data) => {
        this.setState({
          intervalChartData: this.buildIntervalChartData(data),
        });
      })
      .catch((e) => {
        alert(e);
      });
  };

  updateIntervalsPerWeek = () => {
    TimeboardService.getPersonalIntervalsPerWeek()
      .then((data) => {
        this.setState({
          intervalPerWeekChartData: this.buildIntervalPerWeekChartData(data),
        });
      })
      .catch((e) => {
        alert(e);
      });
  };

  // dataBuliders
  buildBarChartData = (data) => {
    if (
      this.constainsInvalidDate(data.map((entry) => new Date(entry["date"])))
    ) {
      return null;
    }

    let result = data.map((entry) => {
      return [new Date(entry["date"]), entry["minutes"]];
    });
    return result;
  };

  buildLineChartData = (data) => {
    if (
      this.constainsInvalidDate(data.map((entry) => new Date(entry["date"])))
    ) {
      return null;
    }

    let hours = data.map((entry) => {
      return [new Date(entry["date"]), entry["hours"]];
    });
    let hours_avg = data.map((entry) => {
      return [new Date(entry["date"]), entry["hours_avg"]];
    });
    let hours_expo_avg = data.map((entry) => {
      return [new Date(entry["date"]), entry["hours_expo_avg"]];
    });

    let result = {
      hours: hours,
      hours_avg: hours_avg,
      hours_expo_avg,
    };
    return result;
  };

  buildIntervalChartData = (data) => {
    if (
      this.constainsInvalidDate(data.map((entry) => new Date(entry["date"])))
    ) {
      return null;
    }

    let result = data.map((entry) => [
      new Date(entry["date"]),
      new Date("2000.1.1 " + entry["start_time"]),
      new Date("2000.1.1 " + entry["end_time"]),
    ]);

    return result;
  };

  buildIntervalPerWeekChartData = (data) => {
    let result = data.map((entry) => [
      entry["id_week"],
      new Date("2000.1.1 " + entry["start_time"]),
      new Date("2000.1.1 " + entry["end_time"]),
    ]);
    return result;
  };

  // helper function
  constainsInvalidDate = (dates) => {
    let hasInvalidDate = dates.some((date) => isNaN(date));
    if (hasInvalidDate) {
      console.error(this.ERROR_INVALID_DATE);
      alert(this.ERROR_INVALID_DATE);
      return true;
    } else {
      return false;
    }
  };

  render() {
    let isAuthenticated = AuthService.isAuthenticated();

    if (!isAuthenticated) {
      window.location.replace("/login");
    }

    let i;
    let stars = "";
    for (i = 0; i < this.state.numberStars; i++) {
      stars += "⭐";
    }

    return (
      <div className="container">
        <div style={{ fontSize: "300%" }}>
          <b>{this.state.username}</b>
        </div>

        <div style={{ fontSize: "200%" }}>{stars}</div>

        <br />
        <br />

        <div>Average Hours per day: {this.averageHoursPerDay}</div>

        <br />
        <hr />
        <br />

        <div style={{ fontSize: "120%" }}>
          <div className="jumbotron">
            {this.state.barChartData ? (
              <BarChartPerDay data={this.state.barChartData} />
            ) : (
              <div>loading</div>
            )}
            {this.state.LineChartData ? (
              <LineChartPerDay data={this.state.LineChartData} />
            ) : (
              <div>loading</div>
            )}
          </div>

          <div className="jumbotron">
            {this.state.intervalChartData ? (
              <LineChartInterval data={this.state.intervalChartData} />
            ) : (
              <div>loading</div>
            )}
            {this.state.intervalPerWeekChartData ? (
              <LineChartIntervalPerWeek
                data={this.state.intervalPerWeekChartData}
              />
            ) : (
              <div>loading</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default PersonalAnalysisView;
