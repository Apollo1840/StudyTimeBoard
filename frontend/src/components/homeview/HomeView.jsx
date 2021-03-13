import React, { Component } from 'react';
import QuoteCard from './QuoteCard';
import RecordForm from './RecordForm';
import DashboardActiveUser from './DashboardActiveUser';
import DashboardStudyKing from './DashboardStudyKing';
import DashboarLeaderboardWeek from './DashboardLeaderboardWeek';

class HomeView extends Component {
    constructor(props){
        super(props);
        this.state = {
            
        }
    }

    render() {
        return(
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