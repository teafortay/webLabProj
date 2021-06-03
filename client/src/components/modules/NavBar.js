import React, { Component } from "react";
import { Link } from "@reach/router";

import "./NavBar.css";

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
        </div>
      </nav>
    );
  }
}

export default NavBar;
