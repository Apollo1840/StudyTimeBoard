import React, { Component } from "react";
import AuthService from "../../services/AuthService";
import TimeboardService from "../../services/TimeboardService";
import WaterfallChart from "../shared/WaterfallChart";
import BarChart from "../shared/BarChart";

class PersonalAnalysisView extends Component {

  // TODO: might need a separate file for storing constant error messages.
  ERROR_INVALID_DATE = "Returned data has invalid date, database might be corrupted!";

  state = {
    waterfallData: null,  // logged intervals of current user, displayed by waterfall chart
    barchartData: null    // logged durations of current user, displayed by bar chart
  };

  componentDidMount(){
    this.updateDurations();
    this.updateIntervals();
  }

  updateDurations = () => {
    TimeboardService.getPersonalDurations()
      .then((data) => {
        this.setState({
          barchartData: this.buildBarchartData(data)
        });
      })
      .catch((e) => {
        alert(e);
      });
  }

  updateIntervals = () => {
    TimeboardService.getPersonalIntervals()
      .then((data) => {
        this.setState({
          waterfallData: this.buildWaterfallData(data)
        });
      })
      .catch((e) => {
        alert(e);
      });
  }

  buildWaterfallData = (data) => {
    let result =  data.map((entry) =>
      Object.values(entry).map((timeStr, index) => 
        index == 0 ? new Date(timeStr) : new Date("2000.1.1 " + timeStr)
      )
    );
    // check if first column contains invalid date
    let hasInvalidDate = result.some((entry) => isNaN(entry[0]));
    if (hasInvalidDate) {
      console.error(this.ERROR_INVALID_DATE);
      alert(this.ERROR_INVALID_DATE);
      result = null;
    }
    return result;
  }

  buildBarchartData = (data) => {
    let result = data.map((entry) => {
      return [new Date(entry["date"]), entry["minutes"]];
    });
    // check if first column contains invalid date
    let hasInvalidDate = result.some((entry) => isNaN(entry[0]));
    if (hasInvalidDate) {
      console.error(this.ERROR_INVALID_DATE);
      alert(this.ERROR_INVALID_DATE);
      result = null;
    }
    return result;
  }

  render() {
    let isAuthenticated = AuthService.isAuthenticated();

    if (!isAuthenticated) {
      window.location.replace("/login");
    }
     
    return (
      <div>
        {this.state.waterfallData ? <WaterfallChart data = {this.state.waterfallData}/> : <div>loading</div>}
        {this.state.barchartData ? <BarChart data = {this.state.barchartData}/> : <div>loading</div>}
      </div>
    );
  }
}

export default PersonalAnalysisView;
