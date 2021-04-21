import React, { Component } from "react";
import ActiveUsersService from "../../../services/ActiveUsersService";

function EncourageUserSlogan() {
  return (
    <>
      <p> None. </p>
      <p style={{ color: "#FF5733" }}>
        Good chance, click "Go" and to be the first one!
      </p>
    </>
  );
}

function StudyingUsers(props) {
  return (
    <ul>
      {props.studying_users.map((name) => (
        <li key={name}>
          {name}: <b style={{ color: "#86ff33" }}>active</b>
        </li>
      ))}
    </ul>
  );
}

class DashboardActiveUser extends Component {
  constructor(props) {
    super(props);
    this.state = { studying_users: [] };
    this._interval = null;
  }

  componentDidMount() {
    //todo: handle error
    this._interval = setInterval(
      ActiveUsersService.getActiveUsers()
        .then((users) => this.setState({ studying_users: users }))
        .catch((msg) => console.error(msg)),
      10000
    );
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  render() {
    let users =
      this.state.studying_users.length === 0 ? (
        <EncourageUserSlogan />
      ) : (
        <StudyingUsers studying_users={this.state.studying_users} />
      );
    return (
      <div id="studying_users" className="mt-5 mb-5">
        <h3 style={{ fontSize: "150%" }}> Currently studying users: </h3>
        <br />
        {users}
      </div>
    );
  }
}

export default DashboardActiveUser;
