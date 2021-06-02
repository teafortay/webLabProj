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
        <h2>An infinite Monopoly-like game for MIT! Inspired by the infinite coorridor!</h2>
      
        <h2> How does this work?</h2>
        <h4>Log in to play MITopoly</h4>
        <h2>Just like regular monopoly except:</h2>
        <ul>
          <li>Board spaces are locations at MIT!</li>
          <li>Players are in student groups. 
            These groups want to expand their influence by 
            fundraising and recruiting new members.</li>
            <li>Players buy booths to advertise their student groups. (instead of hotels)</li>
            <li>When you land on a location with a booth that you don't own, 
           you have to donate to their cause so that they'll stop pestering you. </li>
           <li>MIT is like the Bank. At the beginning, they own all the locations.</li>
          <li>Enjoy!</li>
        </ul>
      </>
    );
  }
}

export default Landing;