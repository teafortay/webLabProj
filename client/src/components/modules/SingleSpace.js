import React, { Component } from "react";
import "../../utilities.css";

/*
name: String,
  canOwn: Boolean,
  owner: String,
  pricePerBooth: Number,
  rentPerBooth: Number,
  numberOfBooths,
  color: String,
*/
class SingleSpace extends Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      return (
        <div>
          <span style={{color: this.props.color}}>{this.props.name}</span>
          <span>{" | owned by: " + this.props.owner}</span>
          <span>{" | number of booths: " + this.props.numberOfBooths}</span>
        </div>
      );
    }
  }
  
  export default SingleSpace;
  