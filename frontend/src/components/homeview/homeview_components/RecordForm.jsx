import React, { Component } from "react";
import { Link } from "react-router-dom";
import store from "../../../redux-store";
import AuthService from "../../../services/AuthService";
import SubmitRecordService from "../../../services/SubmitRecordService";

const round_button_style = {
  width: "100px",
  height: "100px",
  fontSize: "140%",
  borderRadius: "50%",
};

function GreetUser() {
  return (
    <div className="ml-3">
      <p>
        Hi <b>{store.getState().auth.username}</b>, record your study time, then
        you can
        <Link to="/leaderboard"> compete with others </Link>, or
        <Link to="/"> watch your analysis </Link>
      </p>
    </div>
  );
}

function AskForUser(props) {
  return (
    <div className="input-group mb-5 ml-3 mr-3">
      <input
        type="text"
        className="form-control"
        placeholder="Type here your username (* must)"
        name="username"
        onChange={props.handleUsername}
      />
    </div>
  );
}

function GoButton(props) {
  return (
    <div className="col text-center">
      <button
        className="btn btn-outline-primary"
        style={round_button_style}
        id="go"
        name="go"
        onClick={props.handleSubmitGo}
      >
        {props.children}
      </button>
    </div>
  );
}

function HoldButton(props) {
  return (
    <div className="col text-center">
      <button
        className="btn btn-outline-primary"
        style={round_button_style}
        id="hold"
        name="hold"
        onClick={props.handleSubmitHold}
      >
        {props.children}
      </button>
    </div>
  );
}

class RecordForm extends Component {
  state = {
    user_name: "unknown",
    user_status: "holding",
  };

  componentDidMount() {
    // todo: acquire initial user_status
  }

  handleUsername = (event) => {
    this.setState({ user_name: event.target.value });
  };

  handleSubmitGo = () => {
    // todo: show spinner here, reset state after submission sucessed
    this.setState({ user_status: "studying" });
    // todo: another response for no authorized user

    let username = AuthService.isAuthenticated()
      ? store.getState().auth.username
      : this.state.user_name;

    // todo: catch error and alert user, for example: username not exists
    SubmitRecordService.submit_go(username)
      .then(() => {})
      .catch((msg) => {
        this.setState({ user_status: "holding" });
        alert(msg);
        console.error(msg);
      });
  };

  handleSubmitHold = () => {
    // todo: show spinner here, reset state after submission sucessed
    this.setState({ user_status: "holding" });
    // todo: another response for no authorized user

    let username = AuthService.isAuthenticated()
      ? store.getState().auth.username
      : this.state.user_name;

    // todo: catch error and alert user, for example: username not exists
    SubmitRecordService.submit_hold(username)
      .then(() => {})
      .catch((msg) => {
        this.setState({ user_status: "studying" });
        alert(msg);
        console.error(msg);
      });
  };

  render() {
    let isAuthenticated = AuthService.isAuthenticated();
    let greeting = isAuthenticated ? (
      <GreetUser />
    ) : (
      <AskForUser handleUsername={this.handleUsername} />
    );

    let buttons;
    if (AuthService.isAuthenticated() && this.state.user_status === "holding") {
      buttons = <GoButton handleSubmitGo={this.handleSubmitGo}> Go </GoButton>;
    } else if (
      AuthService.isAuthenticated() &&
      this.state.user_status === "studying"
    ) {
      buttons = (
        <>
          <GoButton handleSubmitGo={this.handleSubmitGo}> Re-Go </GoButton>
          <HoldButton handleSubmitHold={this.handleSubmitHold}>Hold</HoldButton>
        </>
      );
    } else {
      // it means !AuthService.isAuthenticated()
      buttons = (
        <>
          <GoButton handleSubmitGo={this.handleSubmitGo}> Go </GoButton>
          <HoldButton handleSubmitHold={this.handleSubmitHold}>Hold</HoldButton>
        </>
      );
    }

    return (
      <div className="mt-5 mb-5">
        <h3 style={{ fontSize: "150%" }}> Record form: </h3>

        <div className="jumbotron">
          <div className="row" id="greeting_user">
            {greeting}
          </div>

          <div id="go_hold_buttons">
            <div className="row ml-3" style={{ color: "#AAA" }}>
              Click "Go“ or ”Hold“ when you start or end the study period:
            </div>
            <div className="row" id="the_buttons">
              {buttons}
            </div>
          </div>

          <hr />

          <div id="duration_input">
            <div className="row">
              <p style={{ color: "#AAA" }} className="ml-3">
                Or input concrete time interval:
              </p>
            </div>

            <form id="record_time" onSubmit={this.submit_duration}>
              <div className="row">
                <div className="col input-group mb-3 mr-5">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon1">
                      start time
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="eg. 09:00"
                    name="start_time"
                  />
                </div>

                <div className="col input-group mb-3 ml-5">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon2">
                      end time
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="eg. 18:00"
                    name="end_time"
                  />
                </div>

                <div className="col mb-3 ml-5">
                  <button
                    type="submit"
                    className="btn btn-primary float-right mr-2"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default RecordForm;
