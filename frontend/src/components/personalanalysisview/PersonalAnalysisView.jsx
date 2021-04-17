import React, { Component } from "react";
import AuthService from "../../services/AuthService";
import TimeboardService from "../../services/TimeboardService";
import WaterfallChart from "../shared/WaterfallChart";
import BarChart from "../shared/BarChart";

class PersonalAnalysisView extends Component {
  state = {
    waterfallData: null,
    barchartData: null
  };

  componentDidMount(){
    this.updateMinutesByDate();
    this.updateTimestampsByDate();
  }

  updateMinutesByDate = () => {
    this.setState({
    })
  }

  updateTimestampsByDate = () => {
    TimeboardService.getPersonalTimestamps()
      .then((data) => {
        // TODO: check js object data structure
        let waterfallData = this.buildWaterfallData(data);
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
    return result;
  }

  render() {
    let isAuthenticated = AuthService.isAuthenticated();

    if (!isAuthenticated) {
      window.location.replace("/login");
    }

    return (
      <div>
        {this.state.waterfallData ? <WaterfallChart data={this.state.waterfallData}/> : <div>loading</div>}
        <BarChart x={[]} y={[]} />
      </div>
    );
  }
}

export default PersonalAnalysisView;
