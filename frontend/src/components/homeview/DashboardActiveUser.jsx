import React, { Component } from 'react';
class DashboardActiveUser extends Component {
  state = {  }
  render() { 
    return (
    <div id="studying_users" className="mt-5 mb-5">
      <h3 style={{fontSize: "150%"}}> Currently studying users: </h3>
      <br />
      <p> None. </p>
      <p style={{color: "#FF5733"}}> Good chance, click "Go" and to be the first one! </p>
    </div>);
  }
}
 
export default DashboardActiveUser;