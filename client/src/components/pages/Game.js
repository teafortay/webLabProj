import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import Board from "../modules/Board.js";
import SingleSpace from "../modules/SingleSpace.js";

import { get } from "../../utilities";

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
      playerMoney: 0,
      playerProperties: [],
      playerLocation: 0,
      
    }
  }

  componentDidMount() {
    // remember -- api calls go here!
    get("/api/board").then((spaceObjs) => {
      this.setState({spaces: spaceObjs});
    });
    
    get("api/player")
      .then((playerObj) => {
      this.setState({
        playerMoney: playerObj.money,
        playerLocation: playerObj.location,
      });
    });
/*
    get("api/startTurn")
    .then((result) => {
      console.log(JSON.stringify(result));
    });
    */
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

        <div
          className="Profile-avatarContainer"
          onClick={() => {
            this.testMove();
          }}
        >
          <div className="Profile-avatar" />
        </div>

        <hr className="Profile-line" />

        <h2 className="Profile-name u-textCenter">{this.props.userName}</h2>

        <hr className="Profile-line" />

        <div className="u-flex">
          <div className="Profile-subContainer u-textCenter">
            <h4 className="Profile-subTitle">Your game stats:</h4>
            <div id="profile-description">
              <p>You currently own:{this.state.playerProperties}</p>
              <p>You currenty have: ${this.state.playerMoney}</p>
            </div>
          </div>
          <div className="Profile-subContainer u-textCenter">
            <h4 className="Profile-subTitle">You rolled:</h4>
            <Dice dice={this.state.dice} />
          </div>
          <div className="Profile-subContainer u-textCenter">
            <h4 className="Profile-subTitle">Your current location:</h4>
            <div id="favorite-cat">{this.state.spaces.filter(s => s._id === this.state.playerLocation)
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