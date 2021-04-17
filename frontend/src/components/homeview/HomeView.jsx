import React, { Component } from "react";
import QuoteCard from "./homeview_components/QuoteCard";
import RecordForm from "./homeview_components/RecordForm";
import DashboardActiveUser from "./homeview_components/DashboardActiveUser";
import DashboardStudyKing from "./homeview_components/DashboardStudyKing";
import DashboarLeaderboardWeek from "./homeview_components/DashboardLeaderboardWeek";

class HomeView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <main className="container">
        <QuoteCard />
        <RecordForm />
        <DashboardActiveUser />
        <DashboardStudyKing />
        <DashboarLeaderboardWeek />
      </main>
    );
  }
}

export default HomeView;
