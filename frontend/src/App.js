import logo from "./logo.svg";
import "./App.css";
import NavBar from "./components/navbar";
import PomodoroView from "./components/pomodoroview/PomodoroView";
import AboutView from "./components/aboutview/AboutView";
import LeaderboardView from "./components/leaderboardview/LeaderboardView";
import PersonalAnalysisView from "./components/personalanalysisview/PersonalAnalysisView";
import HomeView from "./components/homeview/HomeView";
import LoginView from "./components/loginview/LoginView";
import RegisterView from "./components/registerview/RegisterView";

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <NavBar />
          <Switch>
            <Route path="/" exact component={HomeView} />
            <Route path="/pomodoro" component={PomodoroView} />
            <Route path="/about" component={AboutView} />
            <Route path="/leaderboard" component={LeaderboardView} />
            <Route path="/personal_analysis" component={PersonalAnalysisView} />
            <Route path="/login" exact component={LoginView} />
            <Route path="/register" exact component={RegisterView} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
