import React, { Component } from "react";
import SingleSpace from "./SingleSpace.js"
import CountDown from "../modules/CountDown.js";

import "./Console.css";

class Console extends Component {
    // props include
    //  userName
    //  turnMessage
    //  timer
    //  hideMoreTime
    //  requestMoreTimeCallback
    constructor(props) {
      super(props);
    }
  
    componentDidMount() {
    }

    render() {
      return(
        <>
          <hr className="Profile-line" />
          <h2 className="Console-userName u-textCenter">{this.props.userName}</h2>
          <hr className="Profile-line" />
          <div className="u-textCenter">
            {this.props.turnMessage} 
            &nbsp;&nbsp;
            <CountDown seconds={this.props.timer/1000} />
            &nbsp;&nbsp;
            <button
              type="submit"
              value="Submit"
              onClick={this.props.requestMoreTimeCallback}
              hidden={this.props.hideMoreTime}
            >
              Get More Time
            </button>
          </div>
        </>
      );
    }
}

export default Board;