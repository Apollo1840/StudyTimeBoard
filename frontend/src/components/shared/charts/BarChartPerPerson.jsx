import React, { Component } from "react";
import Plot from "react-plotly.js";
import { WeekdayColorWay } from "../../../shared/colorThemes";

// test data for this.props.data
const testData = {
  Monday: { Congyu: 207.0, Diqing: 207.0 },
  Tuesday: { Congyu: 203.0, Diqing: 203.0 },
};

//TODO: layouts can be put in props

function BarChartMinutesPerPerson(props) {
  return (
    <div>
      <Plot
        data={[
          {
            type: "bar",
            y: Object.keys(props.data),
            x: Object.values(props.data),
            orientation: "h",
          },
        ]}
        layout={{
          autosize: true,
          title: props.title,
        }}
        useResizeHandler={true}
        style={{ width: "100%", height: "100%" }}
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
          autosize: true,
          title: props.title,
          barmode: "stack",
        }}
        useResizeHandler={true}
        style={{ width: "100%", height: "100%" }}
      ></Plot>
    </div>
  );
}

function BarChartMinutesPerPersonPerWeekday(props) {
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

function BarChartMinutesPerPersonPerToday(props) {
  const dayCategory = ["Previous", "Today"];
  return BarChartMinutesPerPersonByCategory({ ...props, dayCategory });
}

export {
  BarChartMinutesPerPerson,
  BarChartMinutesPerPersonPerToday,
  BarChartMinutesPerPersonPerWeekday,
};
