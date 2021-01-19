import React, { Component } from "react";
import GoogleLogin from "react-google-login";
import "./Landing.css";

const CLIENT_ID = "618465845830-amoicmialm8fckas9j0q65j8c30qiqg6.apps.googleusercontent.com";

class Landing extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {};
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    return (
      <>
       <GoogleLogin
          clientId={CLIENT_ID}
          buttonText="Login"
          onSuccess={this.props.handleLogin}
          onFailure={(err) => console.log(err)}
        />

        <h1>Welcome to MITopoly!</h1>
        <h2>A Monopoly-like game for MIT!</h2>
      
        <h2> How does this work?</h2>
        <ul>
          <li>Log in to play MITopoly with friends!</li>
          <li>Invite friends!</li>
          <li>Enjoy!</li>
        </ul>
      </>
    );
  }
}

export default Landing;