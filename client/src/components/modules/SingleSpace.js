import React, { Component } from "react";
import "../../utilities.css";

/*
_id: Nuber
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
      if (this.props.canOwn) {
        return (
          <div>
            <span>{this.props.id + ". "}</span>
            <span style={{color: this.props.color}}>{this.props.name}</span>
            <span>{" | owned by: " + this.props.owner}</span>
            <span>{" | rent: " + this.props.numberOfBooths * this.props.rentPerBooth}</span>
          </div>);
      } else {
        return (
          <div>
            <span>{this.props.id + ". "}</span>
            <span style={{color: this.props.color}}>{this.props.name}</span>
          </div>);
      }
      
    }
  }
  
  export default SingleSpace;
  