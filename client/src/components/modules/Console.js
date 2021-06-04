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
    //  requestATurnCallback
    //  hideRequestATurn
    //  buyAndEndTurnCallback
    //  hideBuyAndEndTurn
    //  endTurnCallback
    //  hideEndTurn
    //  endTurnMessage
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
          <div className="u-textCenter">
            {this.props.turnMessage} 
            &nbsp;&nbsp;
            <CountDown seconds={this.props.timer/1000} />
            &nbsp;&nbsp;
            <button type="submit" value="Submit"
              onClick={this.props.requestMoreTimeCallback}
              hidden={this.props.hideMoreTime} >
              Get More Time
            </button>
            <br />
            <button type="submit" value="Submit"
              onClick={this.props.requestATurnCallback}
              hidden={this.props.hideRequestATurn} >
              Request a Turn
            </button>
            <button type="submit" value="Submit"
              onClick={this.props.buyAndEndTurnCallback}
              hidden={this.props.hideBuyAndEndTurn} >
              Buy and End Turn
            </button>
            <button type="submit" value="Submit"
              onClick={this.props.endTurnCallback}
              hidden={this.props.hideEndTurn} >
              {this.props.endTurnMessage}
            </button>
            <br />
          </div>
        </>
      );
    }
}

export default Console;