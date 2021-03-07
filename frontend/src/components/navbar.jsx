import React, { Component } from 'react';
import {Link} from "react-router-dom";

class NavBar extends Component {
    state = {  }
    render() { 
        return (     
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <a className="navbar-brand" href="#">StudyTimeBoard
                <div style={{color:"gray", fontSize: "50%"}}>(Beta v0.5.0)</div>
            </a>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav mr-auto">
                    <Link to="/"> <a className="nav-link" id="nav-home">Home</a> </Link>
                    <Link to="/"> <a className="nav-link" id="nav-personal-analysis">Personal Analysis</a> </Link>
                    <Link to="/leaderboard"> <a className="nav-link" id="nav-leaderboard">Leaderboard</a> </Link>
                    <Link to="/about"> <a className="nav-link" id="nav-about">About</a> </Link>
                </div>
                <div className="navbar-nav">
                    <a className="nav-item nav-link" href="/">Login</a>
                    <a className="nav-item nav-link" href="/">Register</a>
            </div>
            </div>
        </nav>);
    }
}
 
export default NavBar;