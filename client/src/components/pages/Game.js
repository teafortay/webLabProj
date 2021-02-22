import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import Board from "../modules/Board.js";
import SingleSpace from "../modules/SingleSpace.js";

import { get, post } from "../../utilities";
import { socket } from "../../client-socket.js"

import "./Game.css";
import "./Profile.css";
import Dice from "../modules/Dice.js";
//import player from "../../../../server/models/player.js";


const CLIENT_ID = "618465845830-amoicmialm8fckas9j0q65j8c30qiqg6.apps.googleusercontent.com";

class Game extends Component {

  constructor(props) {
    super(props);
    
    // Initialize Default State
    const turnMessage = this.getTurnMessage("hold", false, "");
    console
    this.state = {
      spaces: [],
      dice: 0,
      turnMessage: turnMessage,
      player : {money: 0, location: 0, isTurn: false, didStartTurn: false, ghost: true},
      gameStatus: "hold",
    }
  }

  componentDidMount() {
    // remember -- api calls go here!
    this.updateBoard();
    
    get("api/player").then((playerObj) => {
      let turnMessage = this.getTurnMessage(this.state.gameStatus, playerObj.isTurn, "");
      this.setState({
        player: playerObj,
        turnMessage: turnMessage,
      });
    });

    socket.on("newTurn", (result) => {
      console.log("^^^ newTurn data" + JSON.stringify(result));
      //update board
      this.updateBoard();

      // update turn display
      let curPlayer = this.state.player;
      let turnMessage = "";
      if (result.gameStatus === "active") {
        let userHasTurn = result.player.userId === this.props.userId ? true : false;
        turnMessage = this.getTurnMessage("active", userHasTurn, result.player.name);
        if (userHasTurn) {
          curPlayer = result.player; // update state player below with updated player record
        }
      } else {
        curPlayer.isTurn = false;
        curPlayer.didStartTurn = false;
        turnMessage = this.getTurnMessage(result.gameStatus, false, "");
      }

      this.setState({
        turnMessage: turnMessage,
        player: curPlayer, 
        gameStatus: result.gameStatus,
      });

    }); // componentDidMount()

  } // componentDidMount()

  getTurnMessage(gameStatus, curPlayerIsTurn, playerName="")  {
    let outMessage = "";
    if (gameStatus === "active") {
      if (curPlayerIsTurn) {
        outMessage = "it's your turn! Roll the dice.";
      } else {
        if (playerName != "") {
          outMessage = "It's " + playerName + "'s turn.";
        } else {
          outMessage = "It's another player's turn.";
        }
      }
    } else if (gameStatus === "hold") {
      outMessage = "Game on hold. Request a turn to resume play."
    }
    return outMessage;
  }

  updateBoard() {
    get("/api/board").then((spaceObjs) => {
      this.setState({spaces: spaceObjs});
    });
  }
 
  requestTurn() {
    get("api/requestTurn").then((player) => {
      console.log("get api/requestTurn result:"+JSON.stringify(player));
    });
  }
  
  someVar=13;
  startTurn() {
    get("api/startTurn").then((result) => {
      console.log(JSON.stringify(result));
      this.setState({
        dice: result.dice,
        player: result.player,
      })
      
    });
  }

  endTurn(boughtProperty) {
    console.log("*******");
    post("api/endTurn", {boughtProperty: boughtProperty}).then((player) => {
      this.setState({
        player: player
      });
      this.updateBoard();
      console.log("api/endTurn response: "+JSON.stringify(player));
    }); 
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

        <div>
          <Board
          spaces={this.state.spaces}
          />
        </div>

        <div>{this.state.turnMessage}</div>

        <div
          className="Profile-avatarContainer"
          onClick={() => { this.startTurn(); }}
          hidden={!(this.state.player.isTurn && !this.state.player.didStartTurn)}
        >
          <div className="Profile-avatar" />
        </div>
        <div>
          Game status: {this.state.gameStatus}, 
          isTurn: {this.state.player.isTurn ? "true" : "false"},  
          didStartTurn: {this.state.player.didStartTurn ? "true" : "false"}
        </div>
        <button
          type="submit"
          value="Submit"
          onClick={this.requestTurn}
          hidden={!(this.state.gameStatus === "hold")}
        >
          Request a Turn
        </button>
        <button
          type="submit"
          value="Submit"
          onClick={() => {this.endTurn(true);}}
          hidden={!(this.state.player.isTurn && this.state.player.didStartTurn)}
        >
          Buy and End Turn
        </button>

        <button
          type="submit"
          value="Submit"
          onClick={() => {this.endTurn(false);}}
          hidden={!(this.state.player.isTurn && this.state.player.didStartTurn)}
        >
          End Turn
        </button>

        <hr className="Profile-line" />

        <h2 className="Profile-name u-textCenter">{this.props.userName}</h2>

        <hr className="Profile-line" />

        <div className="u-flex">
          <div className="Profile-subContainer u-textCenter">
            <h4 className="Profile-subTitle">Your game stats:</h4>
            <div id="profile-description">
              <p>You currently own:{this.state.playerProperties}</p>
              <p>You currenty have: ${this.state.player.money}</p>
            </div>
          </div>
          <div className="Profile-subContainer u-textCenter">
            <h4 className="Profile-subTitle">You rolled:</h4>
            <Dice dice={this.state.dice} />
          </div>
          <div className="Profile-subContainer u-textCenter">
            <h4 className="Profile-subTitle">Your current location:</h4>
            <div id="favorite-cat">{this.state.spaces.filter(s => s._id === this.state.player.location)
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
      </>


    );
  }
}

export default Game;