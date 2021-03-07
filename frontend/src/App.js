import logo from './logo.svg';
import './App.css';
import NavBar from './components/navbar'
import QuoteCard from './components/quotecard'
import RecordForm from './components/recordform'
import DashboardActiveUser from './components/dashboard_activeuser'
import DashboardStudyKing from './components/dashboard_todayking'
import DashboarLeaderboardWeek from './components/dashboard_leaderboard_week'
import React, { useEffect, useState } from 'react';

class App extends React.Component {
  render(){
    return(
      <React.Fragment>
      <NavBar />
      <main className="container">
        <QuoteCard />
        <RecordForm />
        <DashboardActiveUser />
        <DashboardStudyKing />
        <DashboarLeaderboardWeek />
      </main>
      </React.Fragment>
    );
   }
}

export default App;
