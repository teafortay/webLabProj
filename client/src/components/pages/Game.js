import React, { Component } from "react";
import Board from "../modules/Board.js";
import SingleSpace from "../modules/SingleSpace.js";

import { get, post } from "../../utilities";
import { socket } from "../../client-socket.js"

import "./Game.css";
import "./Profile.css";
import Dice from "../modules/Dice.js";
import Console from "../modules/Console.js";
import CountDown from "../modules/CountDown.js";
import GameEvents from "../modules/GameEvents.js";
import { COMMUNITY_CHEST, CHANCE } from "../../../../server/staticSpaces.js";

class Game extends Component {

  constructor(props) {
    super(props);
    
    // Initialize Default State
    const turnMessage = this.getTurnMessage("hold", false, "");
    this.state = {
      spaces: [],
      canBuy: false,
      message: "",
      mePlayer : {userId: this.props.userId, 
                  name: "", money: 0, location: 0, 
                  isTurn: false, didStartTurn: false, ghost: true},
      turnPlayer: { userId: "", 
                    name: "", money: 0, location: 0, 
                    isTurn: false, didStartTurn: false, ghost: true},
      gameStatus: "hold",
      timer: 0,
      gameEvents: [],
    }
  }

  componentDidMount() {
    // remember -- api calls go here!
    this.updateBoard();
    
    get("api/player").then((playerObj) => {
      let turnPlayer = this.state.turnPlayer;
      if (playerObj.isTurn) {
        turnPlayer = playerObj;
      }
      this.setState({
        mePlayer: playerObj,
        turnPlayer: turnPlayer,
      });
      this.updatePlayer();
    });

    
    socket.on("newTurn", (result) => {
      this.handleNewTurnMessage(result);
    });

    socket.on("gameEvent", (result) => {
      let currentDate = new Date();
      let time = currentDate.toLocaleTimeString();
      // currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
      const eventsClone = [...this.state.gameEvents];
      eventsClone.unshift(time+" "+result.event); // add to top of list
      this.setState({
        gameEvents: eventsClone,
      });
    });

  } // componentDidMount()

  /**
   * Recieves result object with format:
   *  {
   *    gameStatus: <active or hold>, 
   *    turnPlayer: {
   *      userId: string, 
          name: string, 
          money: integer, 
          location: integer, 
          isTurn: boolean, 
          didStartTurn: boolean, 
          ghost: boolean
        }
        timer: integer in miliseconds
      }
    */
  handleNewTurnMessage(result) {
    //console.log("-*- newTurn data" + JSON.stringify(result));
    //update board
    this.updateBoard();

    // update turn display
    let mePlayer = this.state.mePlayer;
    if (result.gameStatus === "active" && result.turnPlayer.userId === this.state.mePlayer.userId) {
      mePlayer = result.turnPlayer; // updates mePlayer below with updated player record
      this.setState({message:""}); // reset message
    } 
    // clear turn values to make sure mePlayer cannot play when game is on hold
    if (result.gameStatus === "hold") {
      mePlayer.isTurn = false;
      mePlayer.didStartTurn = false;
    }

    this.setState({
      mePlayer: mePlayer, 
      turnPlayer: result.turnPlayer,
      gameStatus: result.gameStatus,
      timer: result.timer,
    });
    this.updatePlayer();
  }

  getTurnMessage() {
    let outMessage = "";
    // handle early call to this function before state is set
    if (typeof this.state === 'undefined') {
      return "this.state is undefined";
    }

    if (this.state.gameStatus === "active") {
      if (this.state.mePlayer.userId === this.state.turnPlayer.userId) {
        if (this.state.mePlayer.didStartTurn) {
          outMessage = "End you turn."
        } else {
          outMessage = "it's your turn! Roll the dice.";
        }
      } else {
        if (this.state.turnPlayer.name != "") {
          if (this.state.turnPlayer.didStartTurn) {
            outMessage = " Waiting for " + this.state.turnPlayer.name + " to end their turn."
          } else {
            outMessage = " Waiting for " + this.state.turnPlayer.name + " to start their turn."
          }
        } else {
          outMessage = "It's another player's turn.";
        }
      }
    } else if (this.state.gameStatus === "hold") {
      outMessage = "Game on hold. Request a turn to resume play."
    }
    return outMessage;
  }

  getEndTurnMessage() {
    if (this.state.spaces.length > 0) {
      const space = this.state.spaces.find((s) => this.state.mePlayer.location === s._id);
      if (space.name === COMMUNITY_CHEST) {
        return "Claim your Treasure!";
      }
    }
    return "End Turn";
  }

  getTurnClassName() {
    if (this.state.spaces.length > 0) {
      const space = this.state.spaces.find((s) => this.state.mePlayer.location === s._id);
      if (space.name === CHANCE) {
        return "Profile-chance";
      }
    }
    return "Profile-dice";
  }

  updateBoard() {
    get("/api/board").then((spaceObjs) => {
      this.setState({spaces: spaceObjs});
    });
  }

  updatePlayer() {
    // use callback to set user details in NavBar via App.js
    const userLocationHTML = this.state.spaces.filter(s => s._id === this.state.mePlayer.location).map((s) =>
      <span>
        <span>{s._id + ". "}</span>
        <span>{s.name}</span>
      </span>
      );
    this.props.setUserDetailsCallback(this.state.mePlayer.money, userLocationHTML);
  }

  requestTurn() {
    get("api/requestTurn").then((player) => {
      //console.log("get api/requestTurn result:"+JSON.stringify(player));
    });
    this.setState({message:""})
  }

  requestMoreTime() {
    get("api/requestMoreTime").then((player) => {
      //console.log("get api/requestMoreTime result:"+JSON.stringify(player));
    });
  }
  
  someVar=13;
  startTurn() {
    get("api/startTurn").then((result) => {
      //console.log("^V^ startTurn result: "+JSON.stringify(result));
      this.setState({
        message: result.playerMessage,
        canBuy: result.canBuy,
        mePlayer: result.player,
      })
      this.updatePlayer();
    });
  }

  endTurn(boughtProperty) {
    post("api/endTurn", {boughtProperty: boughtProperty}).then((result) => {
      this.setState({
        mePlayer: result.player,
        message: result.message,
      });
      this.updatePlayer();
      this.updateBoard();
      //console.log("api/endTurn response: "+JSON.stringify(player));
    }); 
  }

  render() {
    return (
      <>
        <div>
          <Board
          spaces={this.state.spaces}
          />
        </div>

        <Console 
          userName={this.props.userName}
          turnMessage={this.getTurnMessage()}
          timer={this.state.timer}
          hideMoreTime={!(this.state.mePlayer.isTurn)}
          requestMoreTimeCallback={this.requestMoreTime}
          requestATurnCallback={this.requestTurn}
          hideRequestATurn={!(this.state.gameStatus === "hold")}
          buyAndEndTurnCallback={() => {this.endTurn(true);}}
          hideBuyAndEndTurn={!(this.state.mePlayer.isTurn && this.state.mePlayer.didStartTurn && this.state.canBuy)}
          endTurnCallback={() => {this.endTurn(false);}}
          hideEndTurn={!(this.state.mePlayer.isTurn && this.state.mePlayer.didStartTurn)}
          endTurnMessage={this.getEndTurnMessage()}
        />
        

        <div className="u-flex" style={{height:"100px"}}>
          <div className="Profile-subContainer u-textCenter" >
            <div className="u-textCenter"
              hidden={(this.state.message === "")} >
              <h4 className="Profile-subTitle">{this.state.message}</h4>
            </div>
            <div
              className="Profile-turnContainer u-textCenter"
              onClick={() => { this.startTurn(); }}
              hidden={!(this.state.mePlayer.isTurn && !this.state.mePlayer.didStartTurn)} >
              <div className={this.getTurnClassName()} />
            </div>
          </div>
        </div>
        <hr className="Profile-line" />
        <div className="Game-margin">
          <GameEvents events={this.state.gameEvents} />
        </div>
      </>
    );
  }
}

export default Game;