import React, { Component } from "react";
import "./Dice.css";

/**
 * Component that renders cat happiness
 *
 * Proptypes
 * @param {int} catHappiness is how happy your cat is
 */
class Dice extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <div className="Dice-container">
        <div className="Dice-story">
          <p className="Dice-storyContent">{this.props.dice}</p>
        </div>
      </div>
    );
  }
}

export default Dice;
