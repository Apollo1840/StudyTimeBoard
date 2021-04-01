import React, { Component } from 'react';
class DashboardLeaderboardWeek extends Component {
    state = {  }
    render() { 
        return (
        <div id="lastweek_leaderboard_display" className="mt-5 mb-5">
            <h3 style={{fontSize: "150%"}}> Leaderboard of this week: </h3>
            <br/>
    
            <div>
                <p style={{fontSize: "120%"}}> 🏆 The leader of this board is:<b> someone </b> (with
                    some_time)</p>
            </div>
    
            <div class="text-center">
                <img src="path/to/the/chart" width="100%" height="100%" />
            </div>

        </div>);
    }
}
 
export default DashboardLeaderboardWeek;