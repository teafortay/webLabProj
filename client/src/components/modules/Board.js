import React, { Component } from "react";
import SingleSpace from "./SingleSpace.js"
import "./Board.css";
import Column from "./Column.js";

class Board extends Component {
    constructor(props) {
      super(props);
      
    }
  
    componentDidMount() {
       
    }

    render() {
      const column1 = this.props.spaces.slice(0,20);
      const column2 = this.props.spaces.slice(20);
      return(
        <div className="Board-row">
          <div className="Board-column">
            <Column spaces={column1} />
          </div>
          <div className="Board-column">
            <Column spaces={column2} />
          </div>
        </div>
      );
    }


}

export default Board;