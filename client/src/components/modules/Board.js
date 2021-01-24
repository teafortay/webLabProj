import React, { Component } from "react";
import SingleSpace from "./SingleSpace.js"
import "./Board.css";

class Board extends Component {
    constructor(props) {
      super(props);
      
    }
  
    componentDidMount() {
       
    }

    render() {
        return(
            <div className="Board-margin">
          {this.props.spaces.map((space) => (
            <SingleSpace
            key={`SingleSpace_${space._id}`}
            id = {space._id}
              name={space.name}
              color={space.color}
              owner={space.owner}
              numberOfBooths={space.numberOfBooths}
              rentPerBooth={space.rentPerBooth}
              canOwn={space.canOwn}
            />
          ))}
        </div>

        );
    }


}

export default Board;