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

        <h1>Good luck on your project :)</h1>
        <h2> What we provide in this skeleton</h2>
        <ul>
          <li>Google Auth (Skeleton.js & auth.js)</li>
          <li>Socket Infrastructure (client-socket.js & server-socket.js)</li>
          <li>User Model (auth.js & user.js)</li>
        </ul>

        
        <h2> What you need to change</h2>
        <ul>
        
          <li>Fix logIn/ logOut</li>
          <li>Fix socket error</li>
          <li>Do database stuff?</li>
          <li>Add a favicon to your website at the path client/dist/favicon.ico??</li>
        </ul>
      </>
    );
  }
}

export default Landing;