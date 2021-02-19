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
    this.state = {
      spaces: [],
      dice: 0,
      turnMessage: "",
      player : {money: 0, location: 0, isTurn: false, didStartTurn: false, ghost: true},

    }
  }

  componentDidMount() {
    // remember -- api calls go here!
    this.updateBoard();
    
    get("api/player").then((playerObj) => {
      let turnMessage = "";
      if (playerObj.isTurn) {
        turnMessage = "It's your turn!";
      }  
      this.setState({
        player: playerObj,
        turnMessage: turnMessage,
      });
    });

    socket.on("newTurn", (result) => {
      console.log("^^^ newTurn data" + JSON.stringify(result));
      //update board
      this.updateBoard();
      //display who's turn it is
      let turnMessage = "";
      let curPlayer = this.state.player;
      if (result.gameStatus === "active") {
        if (result.player.userId === this.props.userId) {
          turnMessage = "it's your turn!";
          curPlayer = result.player;
        } else {
          turnMessage = "It's " + result.player.name + "'s turn.";
        }
      } else if (result.gameStatus === "hold") {
        turnMessage = "Game on hold. Request Turn to resume play."
      }

      this.setState({
        turnMessage: turnMessage,
        player: curPlayer, 
      });
    });
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
          onClick={() => {
            this.startTurn(); //bug
          }}
        >
          <div className="Profile-avatar" />
        </div>
        <button
          type="submit"
          value="Submit"
          onClick={this.requestTurn}
        >
          Request a Turn
        </button>
        <button
          type="submit"
          value="Submit"
          onClick={() => {this.endTurn(true);}}
        >
          Buy and End Turn
        </button>

        <button
          type="submit"
          value="Submit"
          onClick={() => {this.endTurn(false);}}
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