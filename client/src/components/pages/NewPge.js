import React, { Component } from "react";

import "../../utilities.css";

class NewPge extends Component {
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
          <h1>This is a new page</h1>
      );
  }

}

export default NewPge;
