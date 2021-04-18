import React, { Component } from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../redux/authActions";
import AuthService from "../services/AuthService";
import store from "../redux-store";

const mapStateToProps = (state) => ({
  auth: state.auth,
});

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    AuthService.logout().then(() => {
      store.dispatch(logout());
    });
  }

  loginRegisterButtons = () => {
    return (
      <div className="navbar-nav">
        <Nav.Link as={Link} to="/login">
          Login
        </Nav.Link>
        <Nav.Link as={Link} to="/register">
          Register
        </Nav.Link>
      </div>
    );
  };

  avatar = () => {
    return (
      <div className="navbar-nav">
        <Nav.Link to={""} as={Link}>Hello {this.props.auth.username}</Nav.Link>
        <Nav.Link to={""} as={Link} onClick={this.handleLogout}>
          Logout
        </Nav.Link>
      </div>
    );
  };

  render() {
    let isAuthenticated = AuthService.isAuthenticated();

    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <a className="navbar-brand" href="#">
            StudyTimeBoard
            <div style={{ color: "gray", fontSize: "50%" }}>(Beta v0.5.0)</div>
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav mr-auto">
              <Nav.Link as={Link} to="/" id="nav-home">
                Home
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/personal_analysis"
                id="nav-personal-analysis"
              >
                Personal Analysis
              </Nav.Link>

              <Nav.Link as={Link} to="/leaderboard" id="nav-leaderboard">
                Leaderboard
              </Nav.Link>

              <Nav.Link as={Link} to="/about" id="nav-about">
                About
              </Nav.Link>
            </div>

            {isAuthenticated ? <this.avatar /> : <this.loginRegisterButtons />}
          </div>
        </nav>
      </div>
    );
  }
}

export default connect(mapStateToProps)(NavBar);
