import React, { Component } from "react";
import Plot from "react-plotly.js";
import { WeekdayColorWay } from "../../shared/colorThemes";

// test data for this.props.data
const testData = {
  Monday: { Congyu: 207.0, Diqing: 207.0 },
  Tuesday: { Congyu: 203.0, Diqing: 203.0 },
};

//TODO: layouts can be put in props

function BarchartMinutesPerPerson(props) {
  return (
    <div>
      <Plot
        data={[
          {
            type: "bar",
            y: Object.keys(this.props.data),
            x: Object.values(this.props.data),
            orientation: "h",
          },
        ]}
        layout={{
          width: 1000,
          height: 1200,
          title: this.props.title,
        }}
      ></Plot>
    </div>
  );
}

function BarChartMinutesPerPersonByCategory(props) {
  const sortedDayCategroy = props.dayCategory.filter((dayKey) =>
    Object.keys(props.data).includes(dayKey)
  );
  return (
    <div>
      <Plot
        data={sortedDayCategroy.map((dayKey, index) => ({
          type: "bar",
          y: Object.keys(props.data[dayKey]), // users
          x: Object.values(props.data[dayKey]), // minutes of users
          orientation: "h",
          name: dayKey,
          marker: { color: WeekdayColorWay[index] },
        }))}
        layout={{
          width: 1000,
          height: 800,
          title: props.title,
          barmode: "stack",
        }}
      ></Plot>
    </div>
  );
}

function BarchartMinutesPerPersonPerWeekday(props) {
  const dayCategory = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return BarChartMinutesPerPersonByCategory({ ...props, dayCategory });
}

function BarchartMinutesPerPersonPerToday(props) {
  const dayCategory = ["Previous", "Today"];
  return BarChartMinutesPerPersonByCategory({ ...props, dayCategory });
}

export {
  BarchartMinutesPerPerson,
  BarchartMinutesPerPersonPerToday,
  BarchartMinutesPerPersonPerWeekday,
};
