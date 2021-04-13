import React, { Component } from "react";
import AuthService from "../../services/AuthService";
import Chart from "react-google-charts";

const testMinutesByDate = 
  { 
    "01.04.2021": 111,
    "02.04.2021": 112,
    "03.04.2021": 122 
  };
const testIntervalsByDate = 
  { 
    "01.04.2021": [[10,20], [25,30], [100, 300]],
    "02.04.2021": [[10,20], [25,30], [100, 300]],
    "03.04.2021": [[10,20], [25,30], [100, 300]] 
  };

class PersonalAnalysisView extends Component {
  state = {
    minutesByDate: null,
    intervalsByDate: null
  };

  componentDidMount(){
    this.updateMinutesByDate();
    this.updateIntervalsByDate();
  }

  updateMinutesByDate = () => {
    this.setState({
      minutesByDate: testMinutesByDate
    })
  }

  updateIntervalsByDate = () => {
    this.setState({
      intervalsByDate: testIntervalsByDate
    })
  }

  render() {
    let isAuthenticated = AuthService.isAuthenticated();

    if (!isAuthenticated) {
      window.location.replace("/login");
    }

    return (
      <div>
        <Chart
          width={'100%'}
          height={'300px'}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={[
            [
              { type: 'number', label: 'x' },
              { type: 'number', label: 'values' },
              { id: 'i0', type: 'number', role: 'interval' },
              { id: 'i1', type: 'number', role: 'interval' }
              //{ type: 'string', role: 'tooltip' }
              //{ id: 'i2', type: 'number', role: 'interval' },
              //{ id: 'i2', type: 'number', role: 'interval' },
              //{ id: 'i2', type: 'number', role: 'interval' },
              //{ id: 'i2', type: 'number', role: 'interval' },
            ],
            [1, 100, 90, 110 ],//, 85, 96, 104, 120],
            [2, 120, 95, 130 ],//, 90, 113, 124, 140],
            [3, 130, 105, 140 ],//, 100, 117, 133, 139],
            [4, 90, 85, 95 ],//, 85, 88, 92, 95],
            [5, 70, 74, 63 ],//, 67, 69, 70, 72],
            [6, 30, 39, 22 ],//, 21, 28, 34, 40],
            [7, 80, 77, 83 ],//, 70, 77, 85, 90],
            [8, 100, 90, 110 ]//, 85, 95, 102, 110],
          ]}
          options={{
            series: [{ color: '#1A8763' }],
            intervals: { lineWidth: 1, barWidth: 1, style: 'boxes' },
            legend: 'none',
          }}
          rootProps={{ 'data-testid': '4' }}
        />
        <Chart
          width={'100%'}
          height={'300px'}
          chartType="CandlestickChart"
          loader={<div>Loading Chart</div>}
          data={[
            [
            'day', 'a', 'b', 'c', 'd'//, {type: "string", role: "tooltip"/*, p: { html: true }*/}
              //{ type: 'date', label: 'x' },
              //{ type: 'number', label: 'values' },
              //{ id: 'i0', type: 'number', role: 'interval', label: 'values'},
              //{ id: 'i0', type: 'number', role: 'interval', label: 'values'}
            ],
           [new Date(2021,3,1), 90, 90, 110, 110],
           [new Date(2021,3,2), 80, 80, 110, 110],
           [new Date(2021,3,3), 70, 70, 110, 110],
           [new Date(2021,3,2), 120, 120, 130, 130],
           [new Date(2021,3,3), 130, 130, 140, 140],
           [new Date(2021,3,6), 90, 90, 110, 110],
           [new Date(2021,3,7), 90, 90, 110, 110],
          ]}
          options={{
            //series: [{ color: '#1A8763' }],
            //intervals: { lineWidth: 1, barWidth: 1, style: 'boxes' },
            legend: 'none',
            tooltip: {  trigger: "none"}
          }}
          rootProps={{ 'data-testid': '4' }}
        />
        personal_analysis_page
      </div>
    );
  }
}

export default PersonalAnalysisView;
