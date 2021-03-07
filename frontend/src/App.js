import logo from './logo.svg';
import './App.css';
import About from './About'
import Leaderboard from './Leaderboard'
import NavBar from './components/navbar'
import QuoteCard from './components/quotecard'
import RecordForm from './components/recordform'
import DashboardActiveUser from './components/dashboard_activeuser'
import DashboardStudyKing from './components/dashboard_todayking'
import DashboarLeaderboardWeek from './components/dashboard_leaderboard_week'

import React, { useEffect, useState } from 'react';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom'

class App extends React.Component {
  render(){
    return(
      <Router>
          <div>
            <NavBar />
            <Switch>
                <Route path="/about" component={About} />
                <Route path="/leaderboard" component={Leaderboard} />
                <Route path="/" exact component={Home} />
            </Switch>
          </div>
      </Router>
      
    );
   }
}

const Home = () => (
  <div>
      <main className="container">
        <QuoteCard />
        <RecordForm />
        <DashboardActiveUser />
        <DashboardStudyKing />
        <DashboarLeaderboardWeek />
      </main>
  </div>
)

export default App;
