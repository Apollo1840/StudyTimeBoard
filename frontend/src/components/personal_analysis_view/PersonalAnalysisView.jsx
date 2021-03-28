import React, { Component } from "react";
import AuthService from "../../services/AuthService";

class PersonalAnalysisView extends Component {
  state = {};
  render() {
    let isAuthenticated = AuthService.isAuthenticated();

    if (isAuthenticated) {
      return <div>personal_analysis_page</div>;
    } else {
      window.location.replace("/login");
    }
  }
}

export default PersonalAnalysisView;
