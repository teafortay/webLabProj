import React, { Component } from "react";
import "../../utilities.css";

class SingleSpace extends Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      return (
        <div>
          <span className="u-bold">{this.props.name}</span>
          <span style={{color: this.props.color}}>{" | " + this.props.color}</span>
        </div>
      );
    }
  }
  
  export default SingleSpace;
  