import React, { Component } from "react";

/**
 * Counts down to zero once per second
 *
 * Proptypes
 * @param {int} seconds is how happy your cat is
 */

 // timer used to make sure only one 
let timer = null;

class CountDown extends Component {
  constructor(props) {
    super(props);
    this.state = { secsRemaining: this.props.seconds };
  }

  componentWillReceiveProps(props) {
    this.setState({secsRemaining : props.seconds});
  }

  countDown() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (this.state.secsRemaining > 1) {
        timer = setTimeout(() => {
          this.setState({ secsRemaining: this.state.secsRemaining - 1, });
        }, 1000);
    } else if (this.state.secsRemaining !== 0) {
      timer = setTimeout(() => {
        this.setState({ secsRemaining: 0, });
      }, 10);
    }
  }

  render() {
    this.countDown();
    return (
      <span>
        {(this.state.secsRemaining === 0) ? "" : this.state.secsRemaining}
      </span>
    );
  }
}

export default CountDown;