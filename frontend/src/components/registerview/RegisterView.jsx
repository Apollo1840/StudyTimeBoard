import React, { Component } from 'react';
import { Form, Button, InputGroup, FormControl } from 'react-bootstrap'
import AuthService from "../../services/AuthService";
import { login } from "../../redux/authActions";
import store from "../../redux-store";

class RegisterView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirm_password: '',
      password_type: 'password'
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggelPasswordvisiblity = this.toggelPasswordvisiblity.bind(this)
  }

  handleSubmit(event) {
    event.preventDefault()
    let username = this.state.username
    let password = this.state.password
    let confirm_password = this.state.confirm_password
    if (username === '') {
      alert("Username can't be empty.")
    } else if (password === '') {
      alert("Password can't be empty.")
    } else if (password !== confirm_password) {
      alert("Passwords don't match.")
    } else {
      AuthService.register(username, password)
        .then((data) => {
          store.dispatch(login(username, data.token));
        })
        .catch((e) => {
          alert(e);
          this.setState({
            error: e
          });
        });
    }
  }

  toggelPasswordvisiblity(event) {
    event.preventDefault()
    event.stopPropagation()
    this.setState({
      password_type: this.state.password_type === 'text' ? 'password' : 'text'
    })
  }

  render() {
    return (
      <main className="container">
        <Form onSubmit={this.handleSubmit}>
          <div>
            <br />
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>Username</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl type="text" placeholder="Enter username" onChange={e => this.setState({ username: e.target.value })} />
            </InputGroup>
            <br />
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>Password</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl type={this.state.password_type} placeholder="Enter password" onChange={e => this.setState({ password: e.target.value })} />
              <InputGroup.Append>
                <Button variant="outline-secondary" label={this.state.password_type === 'text' ? 'Hide' : 'Show'} onClick={this.toggelPasswordvisiblity}>{this.state.password_type === 'text' ? 'Hide' : 'Show'}</Button>
              </InputGroup.Append>
            </InputGroup>
            <br />
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>Confirm password</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl type={this.state.password_type} placeholder="Confirm password" onChange={e => this.setState({ confirm_password: e.target.value })} />
            </InputGroup>
          </div>
          <br />
          <Button variant="primary" type="submit">Submit</Button>
        </Form>
      </main>
    );
  }
}

export default RegisterView;
