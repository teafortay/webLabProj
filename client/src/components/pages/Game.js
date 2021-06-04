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
      dice: 0,
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
 
  requestTurn() {
    get("api/requestTurn").then((player) => {
      //console.log("get api/requestTurn result:"+JSON.stringify(player));
    });
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
        dice: ""+result.dice.die1+", "+result.dice.die1,
        canBuy: result.canBuy,
        mePlayer: result.player,
      })
      
    });
  }

  endTurn(boughtProperty) {
    post("api/endTurn", {boughtProperty: boughtProperty}).then((player) => {
      this.setState({
        mePlayer: player
      });
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
          <div className="Profile-subContainer u-textCenter">
            <h4 className="Profile-subTitle">Your game stats:</h4>
            <div id="profile-description">
            
              <p>You currenty have: ${this.state.mePlayer.money}</p>
            </div>
          </div>
          
          <div className="Profile-subContainer u-textCenter" >
            <div
              className="Profile-turnContainer u-textCenter"
              onClick={() => { this.startTurn(); }}
              hidden={!(this.state.mePlayer.isTurn && !this.state.mePlayer.didStartTurn)} >
              <div className={this.getTurnClassName()} />
            </div>
            <div className="u-textCenter"
              hidden={(this.state.mePlayer.isTurn && !this.state.mePlayer.didStartTurn)} >
              <h4 className="Profile-subTitle">You rolled: {this.state.dice}</h4>
            </div>
          </div>

          <div className="Profile-subContainer u-textCenter">
            <h4 className="Profile-subTitle">Your current location:</h4>
            <div id="favorite-cat">{this.state.spaces.filter(s => s._id === this.state.mePlayer.location)
              .map((s) =>
              <SingleSpace
              key={`SingleSpace_${s._id}`}
              id = {s._id}
              name={s.name}
              color={s.color}
              owner={s.owner}
              numberOfBooths={s.numberOfBooths}
            />
          )}
              </div>
          </div>
        </div>
        <GameEvents events={this.state.gameEvents} />
      </>


    );
  }
}

export default Game;