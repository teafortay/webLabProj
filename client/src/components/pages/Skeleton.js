import React, { Component } from "react";

import Landing from "./Landing.js";
import Game from "./Game.js";
import "../../utilities.css";
import "./Skeleton.css";

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
