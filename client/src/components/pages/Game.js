import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import SingleSpace from "../modules/SingleSpace.js";

import { get } from "../../utilities";

import "./Game.css";
import "./Profile.css";
import Dice from "../modules/Dice.js";


const CLIENT_ID = "618465845830-amoicmialm8fckas9j0q65j8c30qiqg6.apps.googleusercontent.com";

class Game extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      spaces: [],
      dice: 0,
      playerLocation: 0,
    }
  }

  componentDidMount() {
    // remember -- api calls go here!
    get("/api/board").then((spaceObjs) => {
      this.setState({spaces: spaceObjs});
    });
  }

  rollDice = () => {
    const rand = Math.random();
    const diceRoll = (Math.floor(rand * 11) + 2);
    return diceRoll;
  };

  movePlayer =() => {
    const playerLoc = this.state.playerLocation;
    const diceRollResult = this.rollDice();
    let newLoc = playerLoc + diceRollResult;
    const boardLength = this.state.spaces.length;
    if (newLoc >= boardLength) {
      newLoc -= boardLength;
    }
    this.setState({
      playerLocation: newLoc,
      dice: diceRollResult,
    });
  };

  render() {
    return (
      <>
        <GoogleLogout
            clientId={CLIENT_ID}
            buttonText="Logout"
            onLogoutSuccess={this.props.handleLogout}
            onFailure={(err) => console.log(err)}
          />

        <div className="Game-margin">
          {this.state.spaces.map((space) => (
            <SingleSpace
            key={`SingleSpace_${space._id}`}
            id = {space._id}
              name={space.name}
              color={space.color}
              owner={space.owner}
              numberOfBooths={space.numberOfBooths}
            />
          ))}
        </div>

        <div
          className="Profile-avatarContainer"
          onClick={() => {
            this.movePlayer();
          }}
        >
          <div className="Profile-avatar" />
        </div>

        <hr className="Profile-line" />

        <h1 className="Profile-name u-textCenter">{this.props.userName}</h1>

        <hr className="Profile-line" />

        <div className="u-flex">
          <div className="Profile-subContainer u-textCenter">
            <h4 className="Profile-subTitle">Your game stats:</h4>
            <div id="profile-description">
              You currently own 1 property and have 1 booth on it. You currently have $2050.
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