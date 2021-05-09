import React from "react";
import AdminService from "../../services/AdminService";

function AboutView() {
  const reloadData = () => {
    AdminService.reloadDataFromGooglesheet()
      .then(window.location.replace("/"))
      .catch((msg) => {
        alert(msg);
      });
  };

  return (
    <div className="container text-left">
      <p className="mt-5"> Author: Congyu Zou ; Diqing Chang; Sa Li </p>

      <p> Develop history: </p>
      <ul>
        <li>Beta v0.1: Basic studytime leaderboard</li>
        <li>Beta v0.2: + boostrap page style and weekly leaderboard.</li>
        <li>Beta v0.3: + personal study time report.</li>
        <li>Beta v0.3.1: + new study event chart.</li>
        <li>Beta v0.3.9: + in-app data input.</li>
        <li>Beta v0.4.0: Enable true login.</li>
        <li>Beta v0.4.1: Upgrade the layouts on desktop as well as mobile version.</li>
        <li>Beta v0.4.2: User experience improvement on home page</li>
        <li>
          Beta v0.4.5: User experience improvement on home page, smart "go or hold" decision; show today's study king
          and his study event stream; leaderboard of one week in home page differ from today and not today; leaderboard
          of one week in leaderboard page improved to show each weekday.
        </li>
        <li>
          Beta v0.4.8: Database update; User experience improvement on home page, spinner for request handling; display
          current studying users;
        </li>
        <li>
          Beta v0.4.9: Database update, true user system with registering enabled; Codebase refactored, enable faster
          start-dev;
        </li>
        <li>Beta v0.5.0: Personal analysis page update, new charts; Add simple user input varificaiton</li>
        <li>Beta v0.6.0-pre: switch frontend to React; enable Pomodoro Clock</li>
      </ul>
      <button onClick={reloadData}>reload_data</button>
    </div>
  );
}

export default AboutView;
