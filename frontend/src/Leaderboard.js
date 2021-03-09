import React from 'react';

class Leaderboard extends React.Component {

    state = {
        "path_to_chart_lastweek": null,
        "path_to_chart_all": null,
        "name_winner_lastweek": null,
        "duration_str_lastweek": null,
        "name_winner": null,
        "duration_str": null
    }
  
    componentDidMount() {
        fetch("/api/get_leaderboards")
        .then(response => response.json()
            .then(jsondata => console.log(jsondata)))
      }
  
    render(){
        return(
            <div>leaderboards</div>
        )
    }
  }
  
  export default Leaderboard;