import React, { Component } from "react";
import "./Landing.css";

class Rules extends Component {
    constructor(props) {
      super(props);
      // Initialize Default State
      this.state = {};
    }
  
    componentDidMount() {
      // remember -- api calls go here!

    }

    render() {
        return (
          <>
            <h1>Welcome to MITopoly! Rules Page</h1>
            <h2>An infinite Monopoly-like game for MIT! Inspired by the infinite coorridor!</h2>
          
            <h2> How does this work?</h2>
            <h4>Log in to play MITopoly by yourself (Coming soon: with friends!)</h4>
            <h2>Just like regular monopoly except:</h2>
            <ul>
              <li>Board spaces are locations at MIT!</li>
              <li>Players are in student groups. 
                These groups want to expand their influence by 
                fundraising and recruiting new members.</li>
                <li>Players buy booths to advertise their student groups. (instead of hotels)</li>
                <li>When you land on a location with a booth that you don't own, 
               you have to donate to their cause so that they'll stop pestering you. </li>
               <li>MIT is like the Bank. At the beginning, they own all the locations.</li>
              <li>Enjoy!</li>
            </ul>
          </>
        );
      }
    }
    
    export default Rules;
