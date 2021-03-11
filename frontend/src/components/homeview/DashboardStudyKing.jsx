import React, { Component } from 'react';
class DashboardStudyKing extends Component {
    state = {  }
    render() { 
        return (
             <div id="today_study_king_display" className="mt-5 mb-5">
                <h3 style={{fontSize: "150%"}}>Today's study king:</h3>
                <br />
                <p style={{fontSize: "120%"}}><b> 🔥 some_user</b> (with  some_time</p>
                <div class="text-center">
                    <img src="assets/images/Congyu_today_king_16_47_27.png" width="100%" height="100%" />
                </div>
            </div> );
    }
}
 
export default DashboardStudyKing;