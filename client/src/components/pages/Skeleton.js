import React, { Component } from "react";

import Landing from "./Landing.js";
import Game from "./Game.js";

/*
(
      <>
        {this.props.userId ? (
          <GoogleLogout
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Logout"
            onLogoutSuccess={this.props.handleLogout}
            onFailure={(err) => console.log(err)}
          />
        ) : (
          <GoogleLogin
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Login"
            onSuccess={this.props.handleLogin}
            onFailure={(err) => console.log(err)}
          />
        )}
*/
import "../../utilities.css";
import "./Skeleton.css";

//const CLIENT_ID = "618465845830-amoicmialm8fckas9j0q65j8c30qiqg6.apps.googleusercontent.com";

class Skeleton extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {};
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    //console.log(this.props.userId)
    if (this.props.userId) {
      return (<Game
        userId={this.props.userId}
        userName={this.props.userName}
       />);
      } else {
        return (<Landing 
          />);
       }
  }

}

export default Skeleton;
