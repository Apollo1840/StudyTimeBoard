import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap'
import AuthService from "../../services/AuthService";
import {login} from "../../redux/authActions";
import store from "../../redux-store";

class RegisterView extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      confirm_password: ''
    }


    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault()
    let username= this.state.username
    let password = this.state.password
    let confirm_password = this.state.confirm_password

    AuthService.register(username, password)
    .then((data) => {
      store.dispatch(login(username,data.token));
    })
    .catch((e) => {
      alert(e);
      this.setState({
        error: e
      });
    });
  }

  render() {
    return(
      <main className="container">
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter username" onChange={e => this.setState({username: e.target.value})}/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password" onChange={e => this.setState({password: e.target.value})}/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Confirm password</Form.Label>
            <Form.Control type="password" placeholder="Confirm password" onChange={e => this.setState({confirm_password: e.target.value})}/>
          </Form.Group>
          <Button variant="primary" type="submit">Submit</Button>
        </Form>
      </main>
    );
  }
}

export default RegisterView;
