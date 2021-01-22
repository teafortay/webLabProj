import React, { Component } from "react";
import SingleSpace from "./SingleSpace.js"
import "./Board.css";

class Board extends Component {
    constructor(props) {
      super(props);
      this.state = {
      spaces: [],
      }
    }
  
    componentDidMount() {
        get("/api/board").then((spaceObjs) => {
            this.setState({spaces: spaceObjs});
          });
    }

    render() {
        return(
            <div className="Board-margin">
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

        );
    }


}

export default Board;