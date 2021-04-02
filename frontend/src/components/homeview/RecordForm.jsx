import AuthService from "../../services/AuthService";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import store from "../../redux-store";

class RecordForm extends Component {
  state = {};

  greet_user = () => {
    return (
      <div class="ml-3">
        <p>
          Hi <b>{store.getState().auth.username}</b>, record your study time,
          then you can
          <Link to="/leaderboard"> compete with others </Link>, or
          <Link to="/"> watch your analysis </Link>
        </p>
      </div>
    );
  };

  ask_for_user = () => {
    return (
      <div className="input-group mb-5 ml-3 mr-3">
        <input
          type="text"
          className="form-control"
          placeholder="Type here your username (* must)"
          name="username"
        />
      </div>
    );
  };

  render() {
    let isAuthenticated = AuthService.isAuthenticated();
    return (
      <div className="mt-5 mb-5">
        <form id="record_time">
          <h3 style={{ fontSize: "150%" }}> Record form: </h3>

          <div className="jumbotron">
            <div id="greeting_user">
              <div className="row">
                {isAuthenticated ? <this.greet_user /> : <this.ask_for_user />}
              </div>
            </div>

            <div id="go_hold_buttons">
              <div className="row" style={{ color: "#AAA" }}>
                <p className="ml-3">
                  {" "}
                  Click "Go“ or ”Hold“ when you start or end the study period:{" "}
                </p>
              </div>
              <div className="row" id="the_buttons">
                <div className="col text-center">
                  <button
                    className="btn btn-outline-primary"
                    id="go"
                    style={{
                      width: "100px",
                      height: "100px",
                      fontSize: "140%",
                      borderRadius: "50%",
                    }}
                    name="go"
                    onClick="submit_show_spinner()"
                  >
                    Go
                  </button>
                </div>

                <div class="col text-center">
                  <button
                    class="btn btn-outline-primary"
                    id="hold"
                    style={{
                      width: "100px",
                      height: "100px",
                      fontSize: "140%",
                      borderRadius: "50%",
                    }}
                    name="hold"
                    onClick="submit_show_spinner()"
                  >
                    Hold
                  </button>
                </div>
              </div>
            </div>

            <hr />

            <div id="duration_input">
              <div className="row">
                <p style={{ color: "#AAA" }} className="ml-3">
                  {" "}
                  Or input concrete time interval:{" "}
                </p>
              </div>

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
            </div>

            <div id="record_form_spinner" className="text-center"></div>
          </div>
        </form>
      </div>
    );
  }
}

export default RecordForm;
