import React, { Component } from "react";

import AuthService from "../../services/AuthService";
import TimeboardService from "../../services/TimeboardService";
import PersonalInfoService from "../../services/PersonalInfoService";

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
    averageHoursPerDay: "",

    barChartData: null, // logged durations of current user, displayed by bar chart
    LineChartData: null, // logged durations of current user, displayed by line chart
    intervalChartData: null, // logged intervals of current user, displayed by waterfall chart
    intervalPerWeekChartData: null, // logged intervals of current user, displayed by waterfall chart
  };

  componentDidMount() {
    this.setState({ username: store.getState().auth.username });
    this.updateDurationAvg();
    this.updateNumberStars();
    this.updateDurations();
    this.updateDurationsAverage();
    this.updateIntervals();
    this.updateIntervalsPerWeek();
  }

  updateDurationAvg = () => {
    TimeboardService.getPersonalDurationAvg()
      .then((data) => {
        this.setState({
          averageHoursPerDay: data["avg_hours"],
        });
      })
      .catch((e) => {
        alert(e);
      });
  };

  updateNumberStars = () => {
    PersonalInfoService.getNumberStars()
      .then((data) => {
        this.setState({
          numberStars: data["n_stars"],
        });
      })
      .catch((e) => {
        alert(e);
      });
  };

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
    return this.buildData(data, this.buildSingleMetricEntry("minutes"));
  };

  buildLineChartData = (data) => {
    if (this.hasInvalidDate(data.map((entry) => new Date(entry["date"])))) {
      return null;
    }

    return {
      hours: data.map(this.buildSingleMetricEntry("hours")),
      hours_avg: data.map(this.buildSingleMetricEntry("hours_avg")),
      hours_expo_avg: data.map(this.buildSingleMetricEntry("hours_expo_avg")),
    };
  };

  buildIntervalChartData = (data) => {
    return this.buildData(data, this.buildIntervalChartEntry);
  };

  buildIntervalPerWeekChartData = (data) => {
    return this.buildData(data, this.buildIntervalPerWeekEntry, false);
  };

  // EntryBuilders
  buildSingleMetricEntry = (metric) => {
    return (entry) => [new Date(entry["date"]), entry[metric]];
  };
  buildIntervalChartEntry = (entry) => [
    new Date(entry["date"]),
    new Date("2000.1.1 " + entry["start_time"]),
    new Date("2000.1.1 " + entry["end_time"]),
  ];
  buildIntervalPerWeekEntry = (entry) => [
    entry["id_week"],
    new Date("2000.1.1 " + entry["start_time"]),
    new Date("2000.1.1 " + entry["end_time"]),
  ];

  // helper function
  buildData = (data, EntryBuilder, checkDate = true) => {
    if (
      checkDate &&
      this.hasInvalidDate(data.map((entry) => new Date(entry["date"])))
    ) {
      return null;
    }
    return data.map(EntryBuilder);
  };

  hasInvalidDate = (dates) => {
    let constainsInvalidDate = dates.some((date) => isNaN(date));
    if (constainsInvalidDate) {
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

        <div>Average Hours per day: {this.state.averageHoursPerDay}</div>

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
