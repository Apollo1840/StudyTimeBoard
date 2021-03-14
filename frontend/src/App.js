import logo from './logo.svg';
import './App.css';
import NavBar from './components/navbar'
import About from './About'
import Leaderboard from './Leaderboard'
import HomeView from './components/homeview/HomeView'
import LoginView from './components/loginview/LoginView'

import React, { useEffect, useState } from 'react';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom'

class App extends React.Component {
  render(){
    return(
      <Router>
          <div>
            <NavBar />
            <Switch>
                <Route path="/" exact component={HomeView} />
                <Route path="/about" component={About} />
                <Route path="/leaderboard" component={Leaderboard} />
                <Route path="/login" exact component={LoginView} />
            </Switch>
          </div>
      </Router>
    );
   }
}

export default App;
