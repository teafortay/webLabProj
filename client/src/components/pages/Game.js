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
    }
  }

  componentDidMount() {
    // remember -- api calls go here!
    get("/api/board").then((spaceObjs) => {
      this.setState({spaces: spaceObjs});
    });
  }

  roll_dice = () => {
    const rand = Math.random();
    const diceRoll = (Math.floor(rand * 11) + 2);
    return diceRoll;
  };

  incrementCatHappiness = () => {
    this.setState({
      catHappiness: this.roll_dice(),
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
        <p>
          Player {this.props.userName} has $2500
        </p>

        <div>
          {this.state.spaces.map((space) => (
            <SingleSpace
            key={`SingleSpace_${space._id}`}
              name={space.name}
              color={space.color}
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
        <div className="u-flex">
          <div className="Profile-subContainer u-textCenter">
          </div>
          <div className="Profile-subContainer u-textCenter">
            <h4 className="Profile-subTitle">You rolled:</h4>
            <CatHappiness catHappiness={this.state.catHappiness} />
          </div>
          <div className="Profile-subContainer u-textCenter">
          </div>
        </div>
      </>


    );
  }
}

export default Game;