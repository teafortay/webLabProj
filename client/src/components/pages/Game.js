import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import "./Game.css";

const CLIENT_ID = "618465845830-amoicmialm8fckas9j0q65j8c30qiqg6.apps.googleusercontent.com";

class Game extends Component {
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
        <GoogleLogout
            clientId={CLIENT_ID}
            buttonText="Logout"
            onLogoutSuccess={this.props.handleLogout}
            onFailure={(err) => console.log(err)}
          />
    <p>Player {this.props.userName} has $2500</p>
    </>


    );
  }
}

export default Game;