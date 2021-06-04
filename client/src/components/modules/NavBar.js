import React, { Component } from "react";
import { Link } from "@reach/router";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import "./NavBar.css";
const GOOGLE_CLIENT_ID = "618465845830-amoicmialm8fckas9j0q65j8c30qiqg6.apps.googleusercontent.com";

/**
 * The navigation bar at the top of all pages. Takes no props.
 */
class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav className="NavBar-container">
        <div className="NavBar-title u-inlineBlock">MITopoly</div>
        <div className="NavBar-linkContainer u-inlineBlock">
          <Link to="/" className="NavBar-link">
            Game
          </Link>
          <Link to="/rules/" className="NavBar-link">
            Rules
          </Link>
          {this.props.userId ? (
            <GoogleLogout
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Logout"
              onLogoutSuccess={this.props.handleLogout}
              onFailure={(err) => console.log(err)}
              className="NavBar-login"
            />
          ) : (
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Login"
              onSuccess={this.props.handleLogin}
              onFailure={(err) => console.log(err)}
              className="NavBar-login"
            />
          )}
          <div className="NavBar-playerText u-inlineBlock">
              Player: {this.props.userName} - ${this.props.userMoney}<br />
              Location: {this.props.userLocation}
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;
