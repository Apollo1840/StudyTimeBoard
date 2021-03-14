import React, { Component } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from "react-router-dom";
import UserService from "../services/AuthService";

class NavBar extends Component {
    state = {  }

    // TODO: how to use react-bootstrap NAV without refreshing the web page?
    loginRegisterButtons = () => {
        return(
            <div className="navbar-nav">
                <Nav.Link as={Link} to ="/login">Login</Nav.Link>
                <Nav.Link as={Link} to ="/register">Register</Nav.Link>
            </div>
        )
    }

    logoutButton = () => {
        return(
            <div className="navbar-nav">
                <Nav.Link as={Link} to ="/">Logout</Nav.Link>
            </div>
        )
    }

    render() {
        let isAuthenticated = UserService.isAuthenticated();

        return (
            <div>
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
                        <Nav.Link as={Link} to ="/login" id="nav-home"> Home </Nav.Link>
                        <Nav.Link as={Link} to="/" id="nav-personal-analysis">Personal Analysis </Nav.Link>
                        <Nav.Link as={Link} to="/leaderboard" id="nav-leaderboard">Leaderboard </Nav.Link>
                        <Nav.Link as={Link} to="/about" id="nav-about">About </Nav.Link>
                    </div>
                    
                    {isAuthenticated ? <this.logoutButton/> : <this.loginRegisterButtons/>}
                    
                </div>
            </nav>
            </div>
        );
    }
}
 
export default NavBar;