import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import SingleSpace from "../modules/SingleSpace.js";

import { get } from "../../utilities";

import "./Game.css";
import "./Profile.css";
import CatHappiness from "../modules/CatHappiness.js";


const CLIENT_ID = "618465845830-amoicmialm8fckas9j0q65j8c30qiqg6.apps.googleusercontent.com";

class Game extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      spaces: [],
      catHappiness: 0,
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

  incrementCatHappiness = () => {
    this.setState({
      catHappiness: this.rollDice(),
    });
  };

  movePlayer =() => {
    const newLoc = playerLocation + catHappiness;
    const boardLength = this.state.spaces.length;
    if (newLoc > boardLength) {
        this.setState({
          playerLocation: (newLoc - boardLength),
        }); 
    } else {
      this.setState({
        playerLocation: newLoc
    });
  };
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

        <div>
          {this.state.spaces.map((space) => (
            <SingleSpace
            key={`SingleSpace_${space._id}`}
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
            this.incrementCatHappiness();
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
            <CatHappiness catHappiness={this.state.catHappiness} />
          </div>
          <div className="Profile-subContainer u-textCenter">
            <h4 className="Profile-subTitle">Your current location:</h4>
            <div id="favorite-cat">{this.state.spaces.filter((space) => (
              space._id=this.state.catHappiness))}</div>
          </div>
        </div>
      </>


    );
  }
}

export default Game;